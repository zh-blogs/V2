import { useQuery } from '@tanstack/react-query';

import Button from '@/components/elements/Button';
import MainLayout from '@/components/layout/MainLayout';

import { getFeaturedBlogs } from '../api';
import BlogCards from '../components/BlogCards';

const Actions = () => {
  return (
    <>
      <Button>推荐精选博客</Button>
      <Button>精选博客细则</Button>
    </>
  );
};

const FeaturedPage = () => {
  const { data } = useQuery(['featuredBlogs'], getFeaturedBlogs);

  return (
    <MainLayout description="产有优质内容的原创独立博客" actions={<Actions />}>
      <BlogCards blogs={data} />
    </MainLayout>
  );
};

export default FeaturedPage;
