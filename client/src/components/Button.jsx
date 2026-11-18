import Spinner from './Spinner';

const Button = ({
  children,
  variant = 'primary',
  loading = false,
  className = '',
  ...props
}) => {
  const base = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  return (
    <button className={`${base} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <Spinner size="sm" className="border-white border-t-white/40" />}
      {children}
    </button>
  );
};

export default Button;
