import Box from '../elements/Box';
import Button from '../elements/Button';
import { Aiming, Edit, Github, Plus, Shuffle } from '@icon-park/react';

const Header = () => {
  return (
    <header className="h-full py-2 pl-11 flex gap-10 items-center">
      <img src="/logo.svg" alt="Logo" />
      <div className="h-full py-8 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-wider text-[#1B1B1B]">
            中文博客列表导航
          </h1>
          <div className="my-1 border-t border-2 border-black w-64" />
          <h2 className="tracking-wide text-[#1B1B1B]">
            尝试链接几乎所有的中文博客
          </h2>
        </div>
        <div className="flex gap-8">
          <Button icon={<Plus />}>申请添加</Button>
          <Button icon={<Edit />}>申请修改</Button>
          <Button icon={<Aiming />}>绑定认领</Button>
          <Button icon={<Shuffle />}>随机跳转</Button>
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="mb-4 w-full mx-auto text-center text-[#9E9E9E]">
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
      <div className="max-w-[1100px] mx-auto mt-[60px] flex flex-col gap-4">
        <Box className="h-[200px]">
          <Header />
        </Box>
        {children}
        <Footer />
      </div>
    </>
  );
};

export default LayoutBase;
