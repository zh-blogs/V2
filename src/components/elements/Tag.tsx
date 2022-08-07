interface TagProps {
  children: string;
}

const Tag = ({ children }: TagProps) => {
  return (
    <div className="w-fit px-[6px] text-[10px] rounded-[1px] text-[#009EFF] bg-[rgba(145,213,255,0.5)] shadow-[0_0_2px_0_rgba(0,158,255,0.8)]">
      {children}
    </div>
  );
};

export default Tag;
