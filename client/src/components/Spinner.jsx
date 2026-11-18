const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };

const Spinner = ({ size = 'md', className = '' }) => (
  <div
    className={`animate-spin rounded-full border-2 border-crimson-200 border-t-crimson-600 ${sizes[size]} ${className}`}
    role="status"
    aria-label="Loading"
  />
);

export default Spinner;
