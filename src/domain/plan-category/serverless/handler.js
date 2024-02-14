import { createPlanCategoryPost } from '../plan-category.http';

export const createPlanCategoryFn = (event, context, callback) =>
  createPlanCategoryPost.run(event, context, callback);
