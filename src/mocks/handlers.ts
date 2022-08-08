import { rest } from 'msw';

import { blogs } from './data';
import { shuffleArray } from './utils/shuffleArray';

export const handlers = [
  rest.get('/mock/featured-blogs', (_, res, ctx) => {
    return res(ctx.json(blogs));
  }),
  rest.get('/mock/random-blogs', (_, res, ctx) => {
    return res(ctx.delay(1000), ctx.json(shuffleArray(blogs)));
  }),
];
