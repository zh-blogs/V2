import { useQuery } from '@tanstack/react-query';

import type { Actions } from '@/components/layout/MainLayout';
import MainLayout from '@/components/layout/MainLayout';

import { getRandomBlogs } from '../api';
import BlogCards from '../components/BlogCards';

const RandomPage = () => {
  const { data, refetch } = useQuery(['randomBlogs'], getRandomBlogs, {
    staleTime: Infinity,
  });

  const actions: Actions = [
    { name: '博客错误上报' },
    { name: '刷新随机博客', action: () => refetch() },
  ];

  return (
    <MainLayout description="随机展示列表中的部分博客" actions={actions}>
      <BlogCards blogs={data} />
    </MainLayout>
  );
};

export default RandomPage;
