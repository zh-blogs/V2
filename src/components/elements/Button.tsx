interface ButtonProps {
  icon?: JSX.Element;
  children: string;
}

const Button = ({ icon, children }: ButtonProps) => {
  return (
    <button className="w-[90px] h-[25px] bg-[#40A9FF] text-white text-xs leading-6 shadow-md">
      {icon ?? <span>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default Button;
