const ProfilePage = ({ user }) => {
  const token = localStorage.getItem('token');
  const shortToken = token ? token.substring(0, 50) + '...' : 'N/A';

  const fields = [
    { label: 'User ID',     value: user?.id || user?._id },
    { label: 'Full Name',   value: user?.name },
    { label: 'Email',       value: user?.email },
    { label: 'Role',        value: user?.role },
    { label: 'Member Since',value: user?.createdAt ? new Date(user.createdAt).toDateString() : 'N/A' },
    { label: 'JWT Token',   value: shortToken, mono: true },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Profile</h2>
          <p className="page-sub">Your account information</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '520px' }}>
        {/* Avatar row */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
          <div className="profile-avatar">
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '18px' }}>
              {user?.name}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: '13px' }}>{user?.email}</div>
            <span
              className={`badge badge-${user?.role}`}
              style={{ marginTop: '6px', display: 'inline-block' }}
            >
              {user?.role}
            </span>
          </div>
        </div>

        {/* Fields */}
        {fields.map(({ label, value, mono }) => (
          <div key={label} className="profile-field">
            <div className="profile-field-label">{label}</div>
            <div
              className="profile-field-value"
              style={mono ? { fontSize: '11px', opacity: 0.7 } : {}}
            >
              {value || '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
