

const MyButton = ({ variant, className, children, ...rest }) => {
  return (
    <button
      type="button"
      className={`hover:shadow-inner px-4 py-2 text-sm rounded-3xl ${className} ${variant === 'primary' ? `bg-blue-500 text-white hover:bg-blue-700 hover:text-white` : variant === 'secondary' ? 'bg-red-500 text-white hover:bg-red-700 hover:text-white' : variant === 'light' ? ` bg-white text-gray-900 hover:bg-white hover:text-blue-500` : ''}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default MyButton;
