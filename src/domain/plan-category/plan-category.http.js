import { createPlanCategory } from './plan-category.service';
import { httpHandler } from '../../core/application/http-handler';
import { httpReponse } from '../../core/helpers/http/http-response.helper';

export const createPlanCategoryPost = httpHandler(async (req) => {
  const body = await req.json();

  const result = await createPlanCategory(body);
  
  return httpReponse.ok(result);
});
