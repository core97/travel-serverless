import { createPlanCategoryPost } from '@/domain/plan-category/plan-category.http';

export const createPlanCategoryFn = (event: any, context: any, callback: any) => {
  console.log(event);

  createPlanCategoryPost.run(event, context, callback);
}
