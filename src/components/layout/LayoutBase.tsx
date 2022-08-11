import { Aiming, Edit, Github, Plus, Shuffle } from '@icon-park/react';

import Box from '../elements/Box';
import Button from '../elements/Button';

const HeaderActions = () => {
  return (
    <>
      <Button icon={<Plus />}>申请添加</Button>
      <Button icon={<Edit />}>申请修改</Button>
      <Button icon={<Aiming />}>绑定认领</Button>
      <Button icon={<Shuffle />}>随机跳转</Button>
    </>
  );
};

const Header = () => {
  return (
    <header className="h-full pt-3 lg:pt-0 lg:ml-11">
      <div className="flex items-center gap-4 lg:gap-10 lg:h-full justify-center lg:justify-start mb-3 lg:mb-0">
        <img
          src="/logo.svg"
          alt="Logo"
          className="w-[100px] h-[100px] lg:w-fit lg:h-fit"
        />
        <div className="lg:h-full lg:py-8 flex flex-col justify-between">
          <div className="text-[#1B1B1B]">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-wider">
              中文博客列表导航
            </h1>
            <div className="my-1 border-t border-2 border-black w-52 lg:w-64" />
            <h2 className="tracking-wide text-xs lg:text-base">
              尝试链接几乎所有的中文博客
            </h2>
          </div>
          <div className="hidden lg:flex gap-8 ">
            <HeaderActions />
          </div>
        </div>
      </div>
      <div className="lg:hidden flex gap-3 justify-center">
        <HeaderActions />
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="mb-4 w-full mx-auto text-center text-[#9E9E9E] font-medium">
      <div>© 中文博客导航 2022 - {new Date().getFullYear()}</div>
      <div>
        <a href="https://beian.miit.gov.cn/" target="_blank">
          豫ICP备17000379号-2
        </a>
      </div>
      <div>
        <a href="https://github.com/zh-blogs/blog-daohang" target="_blank">
          <Github fill="#000" />
          <span className="ml-1">zh-blogs/blog-daohang</span>
        </a>
      </div>
    </footer>
  );
};

interface LayoutBaseProps {
  children: React.ReactNode;
}

const LayoutBase = ({ children }: LayoutBaseProps) => {
  return (
    <>
      <div className="max-w-[1100px] mx-auto lg:mt-[60px] flex flex-col gap-[10px] lg:gap-4">
        <Box className="h-[170px] lg:h-[200px]">
          <Header />
        </Box>
        {children}
        <Footer />
      </div>
    </>
  );
};

export default LayoutBase;
