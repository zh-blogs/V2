import { useQuery } from '@tanstack/react-query';

import type { Actions } from '@/components/layout/MainLayout';
import MainLayout from '@/components/layout/MainLayout';

import { getFeaturedBlogs } from '../api';
import BlogCards from '../components/BlogCards';

const FeaturedPage = () => {
  const actions: Actions = [{ name: '推荐精选博客' }, { name: '精选博客细则' }];

  const { data } = useQuery(['featuredBlogs'], getFeaturedBlogs);

  return (
    <MainLayout description="产有优质内容的原创独立博客" actions={actions}>
      <BlogCards blogs={data} />
    </MainLayout>
  );
};

export default FeaturedPage;
