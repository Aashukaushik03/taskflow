import { useState, useEffect } from 'react';
import { api } from './utils/api';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import TasksPage from './pages/TasksPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

const App = () => {
  const [user, setUser]       = useState(null);
  const [page, setPage]       = useState('tasks');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    api.get('/auth/me').then((res) => {
      setLoading(false);
      if (res.success) setUser(res.user);
      else localStorage.removeItem('token');
    });
  }, []);

  const handleLogin = (userData) => { setUser(userData); setPage('tasks'); };
  const handleLogout = () => { localStorage.removeItem('token'); setUser(null); setPage('tasks'); };

  if (loading) {
    return (
      <div className="loading-screen">
        <span className="spinner" style={{ width: '28px', height: '28px', borderWidth: '3px' }} />
        <span>Loading TaskFlow...</span>
      </div>
    );
  }

  if (!user) return <LoginPage onLogin={handleLogin} />;

  const renderPage = () => {
    switch (page) {
      case 'tasks':   return <TasksPage />;
      case 'profile': return <ProfilePage user={user} />;
      case 'admin':   return user.role === 'admin' ? <AdminPage /> : <TasksPage />;
      default:        return <TasksPage />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar user={user} activePage={page} setPage={setPage} onLogout={handleLogout} />
      <main className="main-content">{renderPage()}</main>
    </div>
  );
};

export default App;