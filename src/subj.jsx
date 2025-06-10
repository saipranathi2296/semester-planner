 import React, { useState } from 'react';
   import './sub.css';
 
   const subj = () => {
     const [subjects, setSubjects] = useState([
       {
         id: 1,
         name: "Computer Science Fundamentals",
         code: "CS101",
         credits: 3,
         targetGrade: "A+",
         currentGrade: "A",
         progress: 100,
         topics: 4,
         totalTopics: 4,
         color: "#FFD1DC",
         tasks: [
           { id: 1, text: "Data Structures", completed: true },
           { id: 2, text: "Algorithms", completed: true },
           { id: 3, text: "OOP Concepts", completed: true },
           { id: 4, text: "Database Basics", completed: true }
         ]
       },
       {
         id: 2,
         name: "English Literature",
         code: "ENG201",
         credits: 3,
         targetGrade: "B+",
         currentGrade: "B",
         progress: 25,
         topics: 1,
         totalTopics: 4,
         color: "#D1E0FF",
         tasks: [
           { id: 1, text: "Shakespeare", completed: true },
           { id: 2, text: "Modern Poetry", completed: false },
           { id: 3, text: "Literary Analysis", completed: false },
           { id: 4, text: "Creative Writing", completed: false }
         ]
       },
       {
         id: 3,
         name: "Calculus 1",
         code: "MATH101",
         credits: 4,
         targetGrade: "A",
         currentGrade: "A-",
         progress: 80,
         topics: 4,
         totalTopics: 5,
         color: "#D1FFD1",
         tasks: [
           { id: 1, text: "Limits and Continuity", completed: true },
           { id: 2, text: "Derivatives", completed: true },
           { id: 3, text: "Chain Rule", completed: true },
           { id: 4, text: "Integrals", completed: true },
           { id: 5, text: "Applications", completed: false }
         ]
       }
     ]);
 
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
 
     const addSubject = () => {
       const progress = Math.round((newSubject.topics / newSubject.totalTopics) * 100);
       const subject = {
         ...newSubject,
         id: Date.now(),
         progress: progress,
         tasks: Array(newSubject.totalTopics).fill().map((_, i) => ({
           id: i + 1,
           text: `Topic ${i + 1}`,
           completed: i < newSubject.topics
         }))
       };
       setSubjects([...subjects, subject]);
       setShowAddModal(false);
       resetForm();
     };
 
     const updateSubject = () => {
       const progress = Math.round((editingSubject.topics / editingSubject.totalTopics) * 100);
       const updatedSubjects = subjects.map(subject =>
         subject.id === editingSubject.id ? { ...editingSubject, progress } : subject
       );
       setSubjects(updatedSubjects);
       setEditingSubject(null);
     };
 
     const deleteSubject = (id) => {
       setSubjects(subjects.filter(subject => subject.id !== id));
       if (selectedSubject && selectedSubject.id === id) {
         setSelectedSubject(null);
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
 
     const addTask = () => {
       if (!newTaskText.trim()) return;
       
       const newTask = {
         id: Date.now(),
         text: newTaskText,
         completed: false
       };
       
       const updatedSubjects = subjects.map(subject => {
         if (subject.id === selectedSubject.id) {
           const updatedTasks = [...subject.tasks, newTask];
           const completedCount = updatedTasks.filter(t => t.completed).length;
           const progress = Math.round((completedCount / updatedTasks.length) * 100);
           return {
             ...subject,
             tasks: updatedTasks,
             totalTopics: updatedTasks.length,
             topics: completedCount,
             progress: progress || 0
           };
         }
         return subject;
       });
       
       setSubjects(updatedSubjects);
       setSelectedSubject(updatedSubjects.find(subject => subject.id === selectedSubject.id));
       setNewTaskText("");
     };
 
     const toggleTaskCompletion = (taskId) => {
       const updatedSubjects = subjects.map(subject => {
         if (subject.id === selectedSubject.id) {
           const updatedTasks = subject.tasks.map(task => 
             task.id === taskId ? { ...task, completed: !task.completed } : task
           );
           const completedCount = updatedTasks.filter(t => t.completed).length;
           const progress = Math.round((completedCount / updatedTasks.length) * 100);
           return {
             ...subject,
             tasks: updatedTasks,
             topics: completedCount,
             progress: progress || 0
           };
         }
         return subject;
       });
       
       setSubjects(updatedSubjects);
       setSelectedSubject(updatedSubjects.find(subject => subject.id === selectedSubject.id));
     };
 
     const deleteTask = (taskId) => {
       const updatedSubjects = subjects.map(subject => {
         if (subject.id === selectedSubject.id) {
           const updatedTasks = subject.tasks.filter(task => task.id !== taskId);
           const completedCount = updatedTasks.filter(t => t.completed).length;
           const progress = Math.round((completedCount / updatedTasks.length) * 100);
           return {
             ...subject,
             tasks: updatedTasks,
             totalTopics: updatedTasks.length,
             topics: completedCount,
             progress: progress || 0
           };
         }
         return subject;
       });
       
       setSubjects(updatedSubjects);
       setSelectedSubject(updatedSubjects.find(subject => subject.id === selectedSubject.id));
     };
 
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
                 key={subject.id} 
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
                       deleteSubject(subject.id);
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
                     <div key={task.id} className="task-item">
                       <label>
                         <input
                           type="checkbox"
                           checked={task.completed}
                           onChange={() => toggleTaskCompletion(task.id)}
                         />
                         <span className={task.completed ? "completed" : ""}>{task.text}</span>
                       </label>
                       <button 
                         className="task-delete-btn"
                         onClick={() => deleteTask(task.id)}
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
 
   export default subj;
 