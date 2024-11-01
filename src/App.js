import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import Home from './pages/Home';
import { HelmetProvider } from 'react-helmet-async';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Logout from './pages/Logout';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword'; 
import ChangeImage from './pages/ChangeImage';
import AdminPanel from './pages/AdminPanel';
import AddUserForm from './pages/AddUserForm';
import EditUserForm from './pages/EditUserForm';
import Sessions from './pages/Sessions';
import AddSessionForm from './pages/AddSessionForm';
import Topics from './pages/Topics';
import AddTopicForm from './pages/AddTopicForm';
import TopicDetails from './pages/TopicDetails';

function App() {
  return (
    <AuthProvider> 
      <HelmetProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute element={<Home />} />} />
              <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
              <Route path="/profile/change-password-form"  element={<ChangePassword />} />
              <Route path="/profile/change-image-form"  element={<ChangeImage />} />
              <Route path="/admin-panel"  element={<AdminPanel />} />
              <Route path="/admin-panel/add-form"  element={<AddUserForm />} />
              <Route path="/admin-panel/edit/:username?" element={<EditUserForm />} />
              <Route path="/sessions"  element={<Sessions />} />
              <Route path="/sessions/add-form"  element={<AddSessionForm />} />
              <Route path="/sessions/edit/:id?"  element={<AddSessionForm />} />
              <Route path="/sessions/:id?/topics"  element={<Topics />} />
              <Route path="/sessions/:id?/topics/add-form"  element={<AddTopicForm />} />
              <Route path="/sessions/:id?/topics/edit/:idt"  element={<AddTopicForm />} />
              <Route path="/sessions/:id?/topics/details/:idt"  element={<TopicDetails />} />
              



              {/* Logout route */}
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </div>
        </Router>
      </HelmetProvider>
    </AuthProvider>
  );
}

export default App;
