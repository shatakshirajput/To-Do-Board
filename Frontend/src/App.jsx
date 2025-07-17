import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import KanbanBoard from './components/Board/KanbanBoard';
import ActivityLog from './components/Board/ActivityLog';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from "./components/Footer";
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Main Board Component
const BoardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="board-page">
      <Navbar user={user} logout={logout} />
      <div className="main-content">
        <div className="board-container">
          <KanbanBoard />
        </div>
        <div className="sidebar">
          <ActivityLog />
        </div>
      </div>
    </div>
  );
};

// App Component
const App = () => {
  const location = useLocation();
  const isBoardPage = location.pathname === '/board';

  return (
    <AuthProvider>
      <div className="app">
        {!isBoardPage && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route 
            path="/board" 
            element={
              <ProtectedRoute>
                <BoardPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
        {!isBoardPage && <Footer />}
      </div>
    </AuthProvider>
  );
};

export default App;