import { service } from '@/lib/service';

import type { FeaturedBlogsRes, RandomBlogsRes } from './types';

export const getFeaturedBlogs = (): Promise<FeaturedBlogsRes> => {
  return service.get('/featured-blogs');
};

export const getRandomBlogs = (): Promise<RandomBlogsRes> => {
  return service.get('/random-blogs');
};
