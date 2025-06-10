
import React, { useState, useEffect } from 'react';
import './sub.css';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Replace with your backend URL

const Subjects= () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [newSubject, setNewSubject] = useState({
    name: "",
    code: "",
    credits: 3,
    targetGrade: "A",
    currentGrade: "",
    topics: 0,
    totalTopics: 5,
    color: "#E4E1FF",
    tasks: []
  });
  const [newTaskText, setNewTaskText] = useState("");

  const colors = ["#E4E1FF", "#FFD1E3", "#D1FFE4", "#D1E0FF", "#FFE4D1"];

  // Fetch all subjects on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/subjects`);
        setSubjects(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingSubject !== null) {
      setEditingSubject({
        ...editingSubject,
        [name]: value
      });
    } else {
      setNewSubject({
        ...newSubject,
        [name]: value
      });
    }
  };

  const addSubject = async () => {
    try {
      const progress = Math.round((newSubject.topics / newSubject.totalTopics) * 100);
      const subject = {
        ...newSubject,
        progress: progress,
        tasks: Array(newSubject.totalTopics).fill().map((_, i) => ({
          text: `Topic ${i + 1}`,
          completed: i < newSubject.topics
        }))
      };
      
      const response = await axios.post(`${API_BASE_URL}/subjects`, subject);
      setSubjects([...subjects, response.data]);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  const updateSubject = async () => {
    try {
      const progress = Math.round((editingSubject.topics / editingSubject.totalTopics) * 100);
      const updatedSubject = { ...editingSubject, progress };
      
      const response = await axios.put(
        `${API_BASE_URL}/subjects/${editingSubject._id}`,
        updatedSubject
      );
      
      const updatedSubjects = subjects.map(subject =>
        subject._id === editingSubject._id ? response.data : subject
      );
      
      setSubjects(updatedSubjects);
      setEditingSubject(null);
      
      // Update selected subject if it's the one being edited
      if (selectedSubject && selectedSubject._id === editingSubject._id) {
        setSelectedSubject(response.data);
      }
    } catch (error) {
      console.error('Error updating subject:', error);
    }
  };

  const deleteSubject = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/subjects/${id}`);
      const updatedSubjects = subjects.filter(subject => subject._id !== id);
      setSubjects(updatedSubjects);
      
      if (selectedSubject && selectedSubject._id === id) {
        setSelectedSubject(null);
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  const resetForm = () => {
    setNewSubject({
      name: "",
      code: "",
      credits: 3,
      targetGrade: "A",
      currentGrade: "",
      topics: 0,
      totalTopics: 5,
      color: "#E4E1FF",
      tasks: []
    });
  };

  const openEditModal = (subject, e) => {
    e.stopPropagation();
    setEditingSubject({ ...subject });
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
  };

  const closeSidebar = () => {
    setSelectedSubject(null);
  };

  const addTask = async () => {
    if (!newTaskText.trim()) return;
    
    try {
      const newTask = {
        text: newTaskText,
        completed: false
      };
      
      const response = await axios.post(
        `${API_BASE_URL}/subjects/${selectedSubject._id}/tasks`,
        newTask
      );
      
      const updatedSubjects = subjects.map(subject => {
        if (subject._id === selectedSubject._id) {
          return response.data;
        }
        return subject;
      });
      
      setSubjects(updatedSubjects);
      setSelectedSubject(response.data);
      setNewTaskText("");
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    try {
      // Find the task to get its current completed status
      const task = selectedSubject.tasks.find(t => t._id === taskId);
      if (!task) return;
      
      const response = await axios.put(
        `${API_BASE_URL}/subjects/${selectedSubject._id}/tasks/${taskId}`,
        { completed: !task.completed }
      );
      
      const updatedSubjects = subjects.map(subject => {
        if (subject._id === selectedSubject._id) {
          return response.data;
        }
        return subject;
      });
      
      setSubjects(updatedSubjects);
      setSelectedSubject(response.data);
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/subjects/${selectedSubject._id}/tasks/${taskId}`
      );
      
      const updatedSubjects = subjects.map(subject => {
        if (subject._id === selectedSubject._id) {
          return response.data;
        }
        return subject;
      });
      
      setSubjects(updatedSubjects);
      setSelectedSubject(response.data);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading subjects...</div>;
  }

  return (
    <div className={`subjects-container ${selectedSubject ? 'sidebar-open' : ''}`}>
      <header className="header">
        <div className="logo">
          <span className="logo-icon">📚</span>
          <h1>Subjects</h1>
        </div>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>Add Subject</button>
      </header>

      <div className="subjects-content">
        <div className="subjects-grid">
          {subjects.map(subject => (
            <div 
              key={subject._id} 
              className="subject-card"
              style={{ background: `linear-gradient(135deg, ${subject.color}, #ffffff)` }}
              onClick={() => handleSubjectClick(subject)}
            >
              <div className="subject-header">
                <h3>{subject.name}</h3>
                <div className="subject-code">{subject.code} • {subject.credits} Credits</div>
              </div>
              <div className="progress-section">
                <div className="progress-label">Progress</div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${subject.progress}%` }}
                  ></div>
                </div>
                <div className="progress-details">
                  <span>Topics {subject.topics}/{subject.totalTopics}</span>
                  <span>Target: {subject.targetGrade}</span>
                  {subject.currentGrade && <span>Current: {subject.currentGrade}</span>}
                </div>
              </div>
              <div className="card-actions">
                <button 
                  className="edit-btn"
                  onClick={(e) => openEditModal(subject, e)}
                >
                  ✏️
                </button>
                <button 
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSubject(subject._id);
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Subject Details Sidebar */}
        {selectedSubject && (
          <div 
            className="subject-sidebar active"
            style={{ background: `linear-gradient(135deg, ${selectedSubject.color}, #ffffff)` }}
          >
            <button className="close-sidebar" onClick={closeSidebar}>×</button>
            <div className="sidebar-header">
              <h2>{selectedSubject.name}</h2>
              <div className="subject-meta">
                <span>{selectedSubject.code} • {selectedSubject.credits} Credits</span>
              </div>
            </div>
            
            <div className="grade-info">
              <div className="grade-item">
                <span className="grade-label">Current Grade</span>
                <span className="grade-value">{selectedSubject.currentGrade || "-"}</span>
              </div>
              <div className="grade-item">
                <span className="grade-label">Target Grade</span>
                <span className="grade-value">{selectedSubject.targetGrade}</span>
              </div>
            </div>
            
            <div className="kpi-section">
              <div className="kpi-header">
                <span>Progress</span>
                <span>{selectedSubject.progress}%</span>
              </div>
              <div className="kpi-bar-container">
                <div 
                  className="kpi-bar" 
                  style={{ width: `${selectedSubject.progress}%` }}
                ></div>
              </div>
              <div className="kpi-details">
                Topics completed: {selectedSubject.topics}/{selectedSubject.totalTopics}
              </div>
            </div>
            
            <div className="tasks-section">
              <h3>Topics/Tasks</h3>
              <div className="add-task">
                <input
                  type="text"
                  placeholder="Add new topic/task"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <button onClick={addTask}>Add</button>
              </div>
              <div className="tasks-list">
                {selectedSubject.tasks.map(task => (
                  <div key={task._id} className="task-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task._id)}
                      />
                      <span className={task.completed ? "completed" : ""}>{task.text}</span>
                    </label>
                    <button 
                      className="task-delete-btn"
                      onClick={() => deleteTask(task._id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Subject</h2>
            <div className="form-group">
              <label>Subject Name</label>
              <input
                type="text"
                name="name"
                value={newSubject.name}
                onChange={handleInputChange}
                placeholder="e.g., Calculus 1"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Subject Code</label>
                <input
                  type="text"
                  name="code"
                  value={newSubject.code}
                  onChange={handleInputChange}
                  placeholder="e.g., MATH101"
                />
              </div>
              <div className="form-group">
                <label>Credits</label>
                <input
                  type="number"
                  name="credits"
                  value={newSubject.credits}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Target Grade</label>
                <select
                  name="targetGrade"
                  value={newSubject.targetGrade}
                  onChange={handleInputChange}
                >
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B">B</option>
                  <option value="B-">B-</option>
                  <option value="C+">C+</option>
                  <option value="C">C</option>
                </select>
              </div>
              <div className="form-group">
                <label>Current Grade (Optional)</label>
                <select
                  name="currentGrade"
                  value={newSubject.currentGrade}
                  onChange={handleInputChange}
                >
                  <option value="">Select grade</option>
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B">B</option>
                  <option value="B-">B-</option>
                  <option value="C+">C+</option>
                  <option value="C">C</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Topics Completed</label>
                <input
                  type="number"
                  name="topics"
                  value={newSubject.topics}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Total Topics</label>
                <input
                  type="number"
                  name="totalTopics"
                  value={newSubject.totalTopics}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Color Theme</label>
              <div className="color-options">
                {colors.map(color => (
                  <div
                    key={color}
                    className={`color-option ${newSubject.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewSubject({ ...newSubject, color })}
                  />
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="save-btn" onClick={addSubject}>Add Subject</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Subject Modal */}
      {editingSubject && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Subject</h2>
            <div className="form-group">
              <label>Subject Name</label>
              <input
                type="text"
                name="name"
                value={editingSubject.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Subject Code</label>
                <input
                  type="text"
                  name="code"
                  value={editingSubject.code}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Credits</label>
                <input
                  type="number"
                  name="credits"
                  value={editingSubject.credits}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Target Grade</label>
                <select
                  name="targetGrade"
                  value={editingSubject.targetGrade}
                  onChange={handleInputChange}
                >
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B">B</option>
                  <option value="B-">B-</option>
                  <option value="C+">C+</option>
                  <option value="C">C</option>
                </select>
              </div>
              <div className="form-group">
                <label>Current Grade (Optional)</label>
                <select
                  name="currentGrade"
                  value={editingSubject.currentGrade}
                  onChange={handleInputChange}
                >
                  <option value="">Select grade</option>
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B">B</option>
                  <option value="B-">B-</option>
                  <option value="C+">C+</option>
                  <option value="C">C</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Topics Completed</label>
                <input
                  type="number"
                  name="topics"
                  value={editingSubject.topics}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Total Topics</label>
                <input
                  type="number"
                  name="totalTopics"
                  value={editingSubject.totalTopics}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Color Theme</label>
              <div className="color-options">
                {colors.map(color => (
                  <div
                    key={color}
                    className={`color-option ${editingSubject.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setEditingSubject({ ...editingSubject, color })}
                  />
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setEditingSubject(null)}>Cancel</button>
              <button className="save-btn" onClick={updateSubject}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;
