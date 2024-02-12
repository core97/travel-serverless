import { createPlanCategoryPost } from 'domain/plan-category/plan-category.http';

export const createPlanCategoryFn = (event) =>
  createPlanCategoryPost.run(event);
