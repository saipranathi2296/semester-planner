 import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Subjects from './Subjects';
import Calendar from './Calendar';
import Doubt from './Doubt';
import Quiz from './Quiz';
import Dash from './Dash';
import { AuthProvider } from './AuthContext'; 

const App = () => {
  return (
    
    <Router>
      <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route index element={<Dash />} />
          <Route path="dash" element={<Dash />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="doubt" element={<Doubt />} />
          <Route path="quiz" element={<Quiz />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
