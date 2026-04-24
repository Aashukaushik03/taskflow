import { useState } from 'react';
import { api } from '../utils/api';
import Alert from '../components/Alert';

const LoginPage = ({ onLogin }) => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setLoading(true);
    setError('');
    const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
    const payload = mode === 'login'
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password, role: form.role };

    const res = await api.post(endpoint, payload);
    setLoading(false);

    if (res.success) {
      localStorage.setItem('token', res.token);
      onLogin(res.user);
    } else {
      setError(res.message || 'Something went wrong');
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') submit(); };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">
          {mode === 'login' ? '👋 Welcome Back' : '🚀 Get Started'}
        </h1>
        <p className="auth-sub">
          {mode === 'login'
            ? 'Sign in to access your dashboard'
            : 'Create your TaskFlow account'}
        </p>

        <Alert type="error" message={error} />

        {mode === 'register' && (
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={change}
              onKeyDown={handleKey}
              placeholder="John Doe"
              autoFocus
            />
          </div>
        )}

        <div className="form-group">
          <label>Email Address</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={change}
            onKeyDown={handleKey}
            placeholder="john@example.com"
            autoFocus={mode === 'login'}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={change}
            onKeyDown={handleKey}
            placeholder="••••••••"
          />
        </div>

        {mode === 'register' && (
          <div className="form-group">
            <label>Account Role</label>
            <select name="role" value={form.role} onChange={change}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}

        <button
          className="btn btn-primary btn-full"
          onClick={submit}
          disabled={loading}
          style={{ marginTop: '4px' }}
        >
          {loading
            ? <><span className="spinner" /> Please wait...</>
            : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        <p className="auth-switch">
          {mode === 'login' ? (
            <>Don't have an account?{' '}
              <a onClick={() => { setMode('register'); setError(''); }}>Register here</a>
            </>
          ) : (
            <>Already have an account?{' '}
              <a onClick={() => { setMode('login'); setError(''); }}>Sign in</a>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
