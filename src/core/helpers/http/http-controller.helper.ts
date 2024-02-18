import { logger } from '@/core/application/logger';
import { AppError } from '@/core/application/errors/app-error';
import { HttpResponse } from '@/core/helpers/http/http-response.helper';
import { ERROR_CODE_TO_HTTP_STATUS } from '@/core/helpers/http/http-errors.helper';

export async function httpController(
  req: Request,
  res: HttpResponse,
  callback: (req: Request, res: HttpResponse) => Promise<Response>
): Promise<{ res: Response; error?: Error | AppError }> {
  try {
    logger.info(`Starting request`);

    const result = await callback(req, res);

    logger.info(`Request completed`);

    return { res: result };
  } catch (error) {
    logger.error(error, `Request error`);

    let resError = res.fail();

    if (error instanceof AppError) {
      const httpStatus = ERROR_CODE_TO_HTTP_STATUS[error.httpCode];

      resError = res.transformToResponse(httpStatus, {
        body: { businessCode: error.businessCode, httpCode: error.httpCode },
      });
    }

    return { res: resError, ...(error instanceof Error && { error }) };
  }
}
