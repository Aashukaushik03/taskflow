const Spinner = ({ text = 'Loading...' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <span className="spinner" />
    {text}
  </div>
);

export default Spinner;