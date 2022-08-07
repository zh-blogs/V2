import { useQuery } from '@tanstack/react-query';

import Button from '@/components/elements/Button';
import MainLayout from '@/components/layout/MainLayout';

import { getRandomBlogs } from '../api';
import BlogCards from '../components/BlogCards';

const RandomPage = () => {
  const { data, refetch, isRefetching } = useQuery(
    ['randomBlogs'],
    getRandomBlogs,
    { staleTime: Infinity },
  );

  return (
    <MainLayout
      description="随机展示列表中的部分博客"
      actions={
        <>
          <Button>博客错误上报</Button>
          <Button onClick={() => refetch()} disabled={isRefetching}>
            刷新随机博客
          </Button>
        </>
      }
    >
      <BlogCards blogs={data} />
    </MainLayout>
  );
};

export default RandomPage;
