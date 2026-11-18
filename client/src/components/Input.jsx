const Input = ({ label, error, className = '', ...props }) => (
  <div className={className}>
    {label && <label className="label">{label}</label>}
    <input className={`input-field ${error ? 'border-red-400 focus:border-red-500' : ''}`} {...props} />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

export default Input;
