import { createPlanCategory } from 'domain/plan-category/plan-category.service';
import { httpHandler } from 'core/application/http-handler';
import { httpReponse } from 'core/helpers/http/http-response.helper';

export const createPlanCategoryPost = httpHandler(async (req) => {
  const result = await createPlanCategory(req.body);
  return httpReponse.ok(result);
});
