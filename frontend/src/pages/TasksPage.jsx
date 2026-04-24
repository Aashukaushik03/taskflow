import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import Alert from '../components/Alert';
import Badge from '../components/Badge';
import TaskModal from '../components/TaskModal';

const TasksPage = () => {
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null); // null | 'new' | taskObject
  const [flash, setFlash]     = useState(null); // { type, message }
  const [filter, setFilter]   = useState('all');

  const showFlash = (type, message) => {
    setFlash({ type, message });
    setTimeout(() => setFlash(null), 3000);
  };

  const loadTasks = useCallback(async () => {
    setLoading(true);
    const res = await api.get('/tasks');
    setLoading(false);
    if (res.success) setTasks(res.data);
    else showFlash('error', res.message);
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    const res = await api.delete(`/tasks/${id}`);
    if (res.success) {
      setTasks((prev) => prev.filter((t) => t._id !== id));
      showFlash('success', 'Task deleted successfully');
    } else {
      showFlash('error', res.message);
    }
  };

  const handleSaved = (savedTask, isEdit) => {
    if (isEdit) {
      setTasks((prev) => prev.map((t) => (t._id === savedTask._id ? savedTask : t)));
    } else {
      setTasks((prev) => [savedTask, ...prev]);
    }
    setModal(null);
    showFlash('success', isEdit ? 'Task updated!' : 'Task created!');
  };

  const filtered = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  const counts = {
    all:         tasks.length,
    pending:     tasks.filter((t) => t.status === 'pending').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    completed:   tasks.filter((t) => t.status === 'completed').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">My Tasks</h2>
          <p className="page-sub">Manage and track your work items</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('new')}>
          + New Task
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total</div>
          <div className="stat-value">{counts.all}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value" style={{ color: 'var(--yellow)' }}>{counts.pending}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">In Progress</div>
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{counts['in-progress']}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-value" style={{ color: 'var(--green)' }}>{counts.completed}</div>
        </div>
      </div>

      {/* Flash */}
      {flash && <Alert type={flash.type} message={flash.message} />}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '18px', flexWrap: 'wrap' }}>
        {['all', 'pending', 'in-progress', 'completed'].map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            <span style={{ opacity: 0.7, fontSize: '11px' }}>
              ({f === 'all' ? counts.all : counts[f] || 0})
            </span>
          </button>
        ))}
      </div>

      {/* Task List */}
      {loading ? (
        <div className="empty-state"><div className="empty-icon">⏳</div><p>Loading tasks...</p></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>{filter === 'all' ? 'No tasks yet. Create your first one!' : `No ${filter} tasks.`}</p>
        </div>
      ) : (
        <div className="task-list">
          {filtered.map((task) => (
            <div key={task._id} className="task-card">
              <div className="task-body">
                <div className="task-title">{task.title}</div>
                {task.description && (
                  <div className="task-desc">{task.description}</div>
                )}
                <div className="task-meta">
                  <Badge value={task.status} />
                  <Badge value={task.priority} />
                  {task.user?.name && (
                    <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                      {task.user.name}
                    </span>
                  )}
                  <span style={{ fontSize: '11px', color: 'var(--muted)', marginLeft: 'auto' }}>
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="task-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => setModal(task)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task._id)}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <TaskModal
          task={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

export default TasksPage;
