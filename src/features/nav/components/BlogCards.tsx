import type { Blog } from '../api/types';
import BlogCard from './BlogCard';

interface BlogCardsProps {
  blogs?: Omit<Blog, 'feed'>[];
}

const BlogCards = ({ blogs = [] }: BlogCardsProps) => {
  return (
    <div className="grid grid-cols-3 gap-x-10 gap-y-6">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogCards;
