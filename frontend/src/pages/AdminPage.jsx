import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import Alert from '../components/Alert';
import Badge from '../components/Badge';

const AdminPage = () => {
  const [users, setUsers]     = useState([]);
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash]     = useState(null);

  const showFlash = (type, message) => {
    setFlash({ type, message });
    setTimeout(() => setFlash(null), 3000);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [usersRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/stats'),
      ]);
      setLoading(false);
      if (usersRes.success) setUsers(usersRes.data);
      if (statsRes.success) setStats(statsRes.data);
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user and all their tasks?')) return;
    const res = await api.delete(`/admin/users/${id}`);
    if (res.success) {
      setUsers((prev) => prev.filter((u) => u._id !== id));
      showFlash('success', 'User deleted');
    } else {
      showFlash('error', res.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Admin Panel</h2>
          <p className="page-sub">Manage users and view system stats</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="stats-grid" style={{ marginBottom: '28px' }}>
          <div className="stat-card">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Tasks</div>
            <div className="stat-value">{stats.totalTasks}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending Tasks</div>
            <div className="stat-value" style={{ color: 'var(--yellow)' }}>{stats.pendingTasks}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed</div>
            <div className="stat-value" style={{ color: 'var(--green)' }}>{stats.completedTasks}</div>
          </div>
        </div>
      )}

      {flash && <Alert type={flash.type} message={flash.message} />}

      {/* Users Table */}
      <div className="card">
        <h3 style={{ fontFamily: 'Syne, sans-serif', marginBottom: '16px', fontSize: '16px' }}>
          All Users ({users.length})
        </h3>

        {loading ? (
          <div className="empty-state"><p>Loading users...</p></div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <p>No users found</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px', height: '32px', background: 'var(--accent)',
                          borderRadius: '50%', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontFamily: 'Syne', fontWeight: 700,
                          fontSize: '13px', color: '#fff', flexShrink: 0,
                        }}>
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        {u.name}
                      </div>
                    </td>
                    <td style={{ color: 'var(--muted)' }}>{u.email}</td>
                    <td><Badge value={u.role} /></td>
                    <td style={{ color: 'var(--muted)', fontSize: '12px' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(u._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
