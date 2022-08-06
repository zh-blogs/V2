interface MainLayoutProps {
  children: React.ReactNode;
  description: string;
  actions?: React.ReactNode;
}

const MainLayout = ({ children, description, actions }: MainLayoutProps) => {
  return (
    <>
      <div className="h-10 w-full mb-5 border-b-[1px] border-black">
        <div className="my-[18px] mx-9 flex gap-10">
          <div className="text-[#9E9E9E] font-medium flex-grow">
            {description}
          </div>
          {actions}
        </div>
      </div>
      {children}
    </>
  );
};

export default MainLayout;
