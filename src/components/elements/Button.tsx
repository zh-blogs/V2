import clsx from 'clsx';

interface ButtonProps {
  icon?: JSX.Element;
  disabled?: boolean;
  onClick?: () => void;
  children: string;
  className?: string;
}

const Button = ({
  icon,
  children,
  disabled,
  onClick,
  className,
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        className,
        'w-[80px] lg:w-[90px] h-[25px] transition-colors bg-[#40A9FF] hover:bg-[#2B699C] active:bg-[#8CCBFF] disabled:bg-[#BFBDB6] text-[#F9F9F9] disabled:text-[#73716D] text-[10px] lg:text-xs font-medium shadow-md rounded-[1px]',
      )}
    >
      <span className="mr-1">{icon}</span>
      <span>{children}</span>
    </button>
  );
};

export default Button;
