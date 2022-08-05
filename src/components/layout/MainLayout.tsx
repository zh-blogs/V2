import Box from '../elements/Box';
import Button from '../elements/Button';
import TabItem from '../elements/TabItem';
import { Aiming, Edit, Plus, Shuffle } from '@icon-park/react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <main className="h-[785px] max-w-[1100px] mx-auto mt-14 flex flex-col justify-between">
      <Box className="h-[200px] py-2 pl-11 flex gap-10 items-center">
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
      </Box>
      <Box className="h-[59px] flex gap-10 justify-center">
        <TabItem selected>精选博客</TabItem>
        <TabItem>随机博客</TabItem>
        <TabItem>博客一览</TabItem>
        <TabItem>关于我们</TabItem>
      </Box>
      <Box className="h-[498px]">{children}</Box>
    </main>
  );
};

export default MainLayout;
