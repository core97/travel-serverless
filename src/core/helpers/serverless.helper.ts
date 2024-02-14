import { Callback } from 'aws-lambda';
import { logger } from '@/core/application/logger';
import { AppError } from '@/core/application/errors/app-error';
import { httpReponse } from '@/core/helpers/http/http-response.helper';
import { ERROR_CODE_TO_HTTP_STATUS } from '@/core/helpers/http/http-errors.helper';
import { HttpEvent, HttpResponse } from '@/core/types/http-event.type';

export function parseHttpEventToRequest(event: HttpEvent) {
  const {
    rawPath,
    rawQueryString,
    requestContext: { http },
    headers,
    body,
    isBase64Encoded,
  } = event;

  const url = new URL(`https://${process.env.DOMAIN}${rawPath}`);

  if (rawQueryString) {
    url.search = rawQueryString;
  }

  const options = {
    method: http.method,
    headers,
    body: isBase64Encoded ? Buffer.from(body, 'base64').toString() : body,
  };

  if (
    http.method === 'POST' &&
    headers['Content-Type'] === 'application/x-www-form-urlencoded'
  ) {
    options.body = new URLSearchParams(rawQueryString);
  }

  return new Request(url, options);
}

export async function parseToLambdaResponse(
  res: Response,
  options?: { isBase64Encoded?: boolean }
) {
  const lambdaRes: HttpResponse = {
    isBase64Encoded: options?.isBase64Encoded,
    statusCode: res.status,
    headers: {},
  };

  res.headers.forEach((value, name) => {
    if (lambdaRes.headers?.hasOwnProperty(name)) {
      lambdaRes.headers = {
        ...lambdaRes.headers,
        [name]: value,
      };
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

export async function serverlessHttpCtrl(
  event: HttpEvent,
  callback: (res: Request) => Promise<Response>,
  serverlessCallback: Callback<HttpResponse>
) {
  try {
    logger.info(`Starting request`);

    const res = await callback(parseHttpEventToRequest(event));

    logger.info(`Request completed`);

    const serverlessRes = await parseToLambdaResponse(res);

    serverlessCallback(null, serverlessRes);
  } catch (error) {
    logger.error(error, `Request error`);

    let errorRes = httpReponse.fail();

    if (error instanceof AppError) {
      const httpStatus = ERROR_CODE_TO_HTTP_STATUS[error.httpCode];

      errorRes = httpReponse.jsonResponse(httpStatus, {
        businessCode: error.businessCode,
        httpCode: error.httpCode,
      });
    }

    const serverlessRes = await parseToLambdaResponse(errorRes);

    serverlessCallback(error instanceof Error ? error : null, serverlessRes);
  }
}
