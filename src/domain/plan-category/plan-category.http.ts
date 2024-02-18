import { httpHandler } from '@/core/application/http-handler';
import { createPlanCategory } from '@/domain/plan-category/plan-category.service';

export const createPlanCategoryPost = httpHandler(async (req, res) => {
  const body = await req.json();

  const result = await createPlanCategory(body);

  return res.ok(result);
});
