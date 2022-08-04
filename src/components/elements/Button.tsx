interface ButtonProps {
  icon?: JSX.Element;
  children: string;
}

const Button = ({ icon, children }: ButtonProps) => {
  return (
    <button className="w-[90px] h-[25px] transition-colors bg-[#40A9FF] hover:bg-[#2B699C] active:bg-[#8CCBFF] text-white text-xs leading-6 shadow-md">
      {icon ?? <span>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default Button;
