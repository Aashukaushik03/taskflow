import { useState } from 'react';
import { api } from '../utils/api';
import Alert from './Alert';

const TaskModal = ({ task, onClose, onSaved }) => {
  const isEdit = !!task;
  const [form, setForm] = useState(
    task
      ? { title: task.title, description: task.description, status: task.status, priority: task.priority }
      : { title: '', description: '', status: 'pending', priority: 'medium' }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    if (!form.title.trim()) { setError('Title is required'); return; }
    setLoading(true);
    setError('');
    const res = isEdit
      ? await api.put(`/tasks/${task._id}`, form)
      : await api.post('/tasks', form);
    setLoading(false);
    if (res.success) onSaved(res.data, isEdit);
    else setError(res.message || 'Something went wrong');
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3 className="modal-title">{isEdit ? '✏️ Edit Task' : '➕ New Task'}</h3>
        <Alert type="error" message={error} />
        <div className="form-group">
          <label>Title *</label>
          <input name="title" value={form.title} onChange={change} placeholder="What needs to be done?" />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={change} placeholder="Optional details..." />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={form.status} onChange={change}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="form-group">
          <label>Priority</label>
          <select name="priority" value={form.priority} onChange={change}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={loading}>
            {loading ? <><span className="spinner" /> Saving...</> : (isEdit ? 'Update Task' : 'Create Task')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;