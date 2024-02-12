import { prisma } from 'core/application/database';
import { logger } from 'core/application/logger';
import { toSnakeCase } from 'core/helpers/text.helper';

export async function createPlanCategory(params) {
  const code = toSnakeCase(params.code).toUpperCase();

  logger.info(`Creating plan category "${code}"`);

  const planCategory = await prisma.planCategory.create({
    data: {
      code: code,
      name: params.name,
    },
  });

  logger.info(`Plan category created successfully: "${planCategory.id}"`);

  return planCategory;
}
