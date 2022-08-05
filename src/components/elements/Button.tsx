interface ButtonProps {
  icon?: JSX.Element;
  disabled?: boolean;
  children: string;
}

const Button = ({ icon, children, disabled }: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      className="w-[90px] h-[25px] transition-colors bg-[#40A9FF] hover:bg-[#2B699C] active:bg-[#8CCBFF] disabled:bg-[#BFBDB6] text-white disabled:text-[#73716D] text-xs leading-6 shadow-md"
    >
      {icon ?? <span>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default Button;
