import React, { useState, useEffect } from 'react';
import './Calendar.css';

const DailyTracker = () => {
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('tasks')) || []);
  const [completedTasks, setCompletedTasks] = useState(() => JSON.parse(localStorage.getItem('completedTasks')) || []);
  const [feeling, setFeeling] = useState('Good');
  const [productivity, setProductivity] = useState(5);
  const [studyHours, setStudyHours] = useState(0);
  const [journal, setJournal] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [tasks, completedTasks]);

  const addTask = () => {
    const task = prompt('Enter your task:');
    if (task) {
      setTasks([...tasks, { task, date: selectedDate.toDateString(), completed: false }]);
    }
  };

  const toggleComplete = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
    setCompletedTasks(newTasks.filter(t => t.completed));
  };

  const saveJournal = () => {
    alert('Journal saved for ' + selectedDate.toDateString());
  };

  const getCalendarDays = () => {
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1));
  };

  return (
    <div className="tracker-container">
      <header className="tracker-header">
        <h1>📅 Daily Tracker</h1>
        <p>Plan your day and track your progress</p>
      </header>

      <section className="tracker-main">
        <div className="tracker-date">
          <h2>{selectedDate.toDateString()}</h2>
          <p>📝 {tasks.length} tasks &nbsp; ✅ {completedTasks.length} completed</p>
          <button className="add-task" onClick={addTask}>+ Add Task</button>
        </div>

        <div className="tracker-body">
          <div className="calendar">
            <h3>{selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getFullYear()}</h3>
            <div className="calendar-grid">
              {getCalendarDays().map(day => (
                <div
                  key={day.toDateString()}
                  className={`calendar-day ${day.toDateString() === selectedDate.toDateString() ? 'active' : ''}`}
                  onClick={() => setSelectedDate(day)}
                >
                  {day.getDate()}
                </div>
              ))}
            </div>
            <button className="today-btn" onClick={() => setSelectedDate(new Date())}>Today</button>
          </div>

          <div className="tasks-section">
            <div className="task-card">
              <h3>Today's Tasks</h3>
              {tasks.filter(t => t.date === selectedDate.toDateString()).length === 0 ? (
                <p>No tasks for today</p>
              ) : (
                tasks.filter(t => t.date === selectedDate.toDateString()).map((t, i) => (
                  <div key={i}>
                    <input type="checkbox" checked={t.completed} onChange={() => toggleComplete(i)} /> {t.task}
                  </div>
                ))
              )}
            </div>

            <div className="task-card">
              <h3>Completed</h3>
              {completedTasks.length === 0 ? <p>No completed tasks</p> : completedTasks.map((t, i) => <div key={i}>{t.task}</div>)}
            </div>
          </div>
        </div>

        <div className="journal-section">
          <h3>📖 Daily Journal</h3>
          <div className="journal-fields">
            <label>How are you feeling?</label>
            <select value={feeling} onChange={(e) => setFeeling(e.target.value)}>
              <option>😀 Good</option>
              <option>😐 Okay</option>
              <option>😔 Bad</option>
            </select>

            <label>Productivity (1-10)</label>
            <input type="number" min="1" max="10" value={productivity} onChange={(e) => setProductivity(e.target.value)} />

            <label>Study Hours</label>
            <input type="number" value={studyHours} onChange={(e) => setStudyHours(e.target.value)} />

            <label>What happened today?</label>
            <textarea value={journal} onChange={(e) => setJournal(e.target.value)} placeholder="Write about your day..." />

            <button className="save-btn" onClick={saveJournal}>📥 Save Entry</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DailyTracker;
