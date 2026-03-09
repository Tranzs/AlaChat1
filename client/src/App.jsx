import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import ChatListPage from './pages/ChatListPage';
import ChatPage from './pages/ChatPage';
import UsersPage from './pages/UsersPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to="/chats" /> : <LoginPage />} 
      />
      <Route 
        path="/chats" 
        element={user ? <ChatListPage /> : <Navigate to="/" />} 
      />
      <Route 
        path="/chat/:userId" 
        element={user ? <ChatPage /> : <Navigate to="/" />} 
      />
      <Route 
        path="/users" 
        element={user ? <UsersPage /> : <Navigate to="/" />} 
      />
      <Route 
        path="/profile" 
        element={user ? <ProfilePage /> : <Navigate to="/" />} 
      />
      <Route 
        path="/admin" 
        element={user ? <AdminPage /> : <Navigate to="/" />} 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
