export type Blog = {
  id: string;
  idx: number;
  name: string;
  url: string;
  tags: string[];
  sign: string;
  feed: string;
};

export type FeaturedBlogsRes = Omit<Blog, 'feed'>[];

export type RandomBlogsRes = FeaturedBlogsRes;
