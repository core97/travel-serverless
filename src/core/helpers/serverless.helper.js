import { HttpEvent, HttpResponse } from '../types/http-event.type';

/**
 * Convert http event from Api Gateway to Request of fetch API
 *
 * @param {HttpEvent} event
 * @returns {Request}
 */
export function parseHttpEventToRequest(event) {
  const {
    rawPath,
    rawQueryString,
    http: { method },
    headers,
    body,
    isBase64Encoded,
  } = event;

  const url = new URL(`https://${process.env.DOMAIN}${rawPath}`);
  url.search = rawQueryString;

  const options = {
    method,
    headers,
    body: isBase64Encoded ? Buffer.from(body, 'base64').toString() : body,
  };

  if (
    method === 'POST' &&
    headers['Content-Type'] === 'application/x-www-form-urlencoded'
  ) {
    options.body = new URLSearchParams(rawQueryString);
  }

  return new Request(url, options);
}

/**
 * Convert Response of fetch API to lambda response
 *
 * @param {Response} res
 * @param {Object} [options]
 * @param {boolean} [options.isBase64Encoded]
 * @returns {Promise<HttpResponse>}
 */
export async function parseToLambdaResponse(res, options) {
  const lambdaRes = {
    isBase64Encoded: options?.isBase64Encoded,
    statusCode: res.status,
    headers: {},
    multiValueHeaders: {},
  };

  res.headers.forEach((value, name) => {
    if (lambdaRes.headers.hasOwnProperty(name)) {
      if (!Array.isArray(lambdaRes.multiValueHeaders[name])) {
        lambdaRes.multiValueHeaders[name] = [lambdaRes.headers[name], value];
      } else {
        lambdaRes.multiValueHeaders[name].push(value);
      }
    } else {
      lambdaRes.headers[name] = value;
    }
  });

  try {
    const body = await res.text();

    lambdaRes.body = typeof body === 'object' ? JSON.stringify(body) : body;

    if (lambdaRes.isBase64Encoded) {
      lambdaRes.body = Buffer.from(body).toString('base64');
    }
  } catch (error) {
    // Response has no body
  }

  return lambdaRes;
}

/**
 * Controller for http events of serverless
 *
 * @param {HttpEvent} event
 * @param {Function} callback
 *
 * @return {Promise<HttpResponse>}
 */
export async function serverlessHttpCtrl(event, callback, serverlessCallback) {
  try {
    logger.info(`Starting request`);

    /**
     * @type {Response}
     */
    const res = await callback(parseHttpEventToRequest(event));

    logger.info(`Request completed`);

    const serverlessRes = await parseToLambdaResponse(res);

    serverlessCallback(serverlessRes);
  } catch (error) {
    logger.error(error, `Request error`);

    let errorRes = null;

    if (error instanceof AppError) {
      const httpStatus = ERROR_CODE_TO_HTTP_STATUS[error.httpCode];

      errorRes = httpReponseHandler.jsonResponse(httpStatus, {
        businessCode: error.businessCode,
        httpCode: error.httpCode,
      });
    } else {
      error = httpReponseHandler.fail()
    }

    const serverlessRes = await parseToLambdaResponse(errorRes);

    serverlessCallback(serverlessRes);
  }
}
