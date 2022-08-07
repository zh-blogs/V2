import { rest } from 'msw';

import { blogs } from './data';

export const handlers = [
  rest.get('/mock/featured-blogs', (_, res, ctx) => {
    return res(ctx.json(blogs));
  }),
  rest.get('/mock/random-blogs', (_, res, ctx) => {
    return res(ctx.json(blogs));
  }),
];
