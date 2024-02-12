import { HttpEvent, HttpResponse } from 'core/types/http-event.type';

/**
 * @param {HttpEvent} event
 * @param {Function} callback
 *
 * @return {Promise<HttpResponse>}
 */
export async function httpController(event, callback) {
  try {
    logger.info(`Starting request`);

    const result = await callback(event);

    logger.info(`Request completed`);

    return result;
  } catch (error) {
    logger.error(error, `Request error`);

    if (error instanceof AppError) {
      const httpStatus = ERROR_CODE_TO_HTTP_STATUS[error.httpCode];

      return httpReponseHandler.jsonResponse(httpStatus, {
        businessCode: error.businessCode,
        httpCode: error.httpCode,
      });
    }

    return httpReponseHandler.fail();
  }
}
