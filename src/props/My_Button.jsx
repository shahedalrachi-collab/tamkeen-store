
import Button from 'react-bootstrap/Button';

const My_Button = ({
  label,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
  style = {}
}) => {
  return (
    <Button
      className={`mw-100 ${className}`}
      variant={variant}
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {label}
    </Button>
  );
};

export default My_Button;