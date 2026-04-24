const Sidebar = ({ user, activePage, setPage, onLogout }) => {
  const navItems = [
    { id: 'tasks',   icon: '📋', label: 'My Tasks' },
    { id: 'profile', icon: '👤', label: 'Profile' },
    ...(user?.role === 'admin'
      ? [{ id: 'admin', icon: '⚙️', label: 'Admin Panel' }]
      : []),
  ];

  return (
    <aside className="sidebar">
      <div className="logo">Task<span>Flow</span></div>
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-link ${activePage === item.id ? 'active' : ''}`}
          onClick={() => setPage(item.id)}
        >
          <span className="icon">{item.icon}</span>
          {item.label}
        </button>
      ))}
      <div className="sidebar-footer">
        <div className="user-name">{user?.name}</div>
        <div className="user-role">{user?.role}</div>
        <button className="btn-logout" onClick={onLogout}>Sign Out</button>
      </div>
    </aside>
  );
};

export default Sidebar;