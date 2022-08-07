import { Share } from '@icon-park/react';

import Tag from '@/components/elements/Tag';

import type { Blog } from '../api/types';

interface BlogCardProps {
  blog: Omit<Blog, 'feed' | 'id'>;
}

const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <div className="bg-[#F2EAE0] px-4 py-[10px] shadow-md flex flex-col gap-2">
      <div>
        <span className="mr-1 text-sm text-[#BCBCBC] underline decoration-[#8F8F8F] decoration-2 underline-offset-2 font-bold leading-6">
          # {`${blog.idx}`.padStart(4, '0')}
        </span>
        <a
          href={blog.url}
          target="_blank"
          className="text-[#40BBFD] font-medium"
        >
          <span>{blog.name}</span>
          <Share size={10} />
        </a>
      </div>
      <div className="flex flex-wrap gap-x-1 gap-y-[5px]">
        {blog.tags.map((tag, index) => (
          <Tag key={index}>{tag}</Tag>
        ))}
      </div>
      <div className="text-[#9E9E9E] font-bold text-[10px]">{blog.sign}</div>
    </div>
  );
};

export default BlogCard;
