import Button from '@/components/elements/Button';
import MainLayout from '@/components/layout/MainLayout';

const Actions = () => {
  return (
    <>
      <Button>推荐精选博客</Button>
      <Button>精选博客细则</Button>
    </>
  );
};

const FeaturedPage = () => {
  return (
    <MainLayout description="产有优质内容的原创独立博客" actions={<Actions />}>
      Featured
    </MainLayout>
  );
};

export default FeaturedPage;
