import Box from '../elements/Box';
import TabItem from '../elements/TabItem';
import LayoutBase from './LayoutBase';

interface IndexLayoutProps {
  children: React.ReactNode;
}

const IndexLayout = ({ children }: IndexLayoutProps) => {
  return (
    <LayoutBase>
      <Box className="h-[59px]">
        <nav className="flex gap-10 justify-center">
          <TabItem selected>精选博客</TabItem>
          <TabItem>随机博客</TabItem>
          <TabItem>博客一览</TabItem>
          <TabItem>关于我们</TabItem>
        </nav>
      </Box>
      <Box className="h-[498px]">
        <main>{children}</main>
      </Box>
    </LayoutBase>
  );
};

export default IndexLayout;
