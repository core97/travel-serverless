import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyCallback,
} from 'aws-lambda';
import { logger } from '@/core/application/logger';
import { AppError } from '@/core/application/errors/app-error';
import { httpReponse } from '@/core/helpers/http/http-response.helper';
import { ERROR_CODE_TO_HTTP_STATUS } from '@/core/helpers/http/http-errors.helper';

export function parseHttpEventToRequest(event: APIGatewayProxyEvent): Request {
  const {
    path,
    queryStringParameters,
    multiValueQueryStringParameters,
    httpMethod,
    requestContext,
    body,
    isBase64Encoded,
  } = event;

  const headers = new Headers();

  Object.entries(event.headers).forEach(([key, value]) => {
    if (value) {
      headers.append(key, value);
    }
  });

  const url = new URL(`https://${requestContext.domainName}${path}`);

  let rawQueryString = '';
  let rawMultiQueryString = '';

  if (queryStringParameters) {
    Object.entries(queryStringParameters).forEach(([key, value]) => {
      if (value) {
        rawQueryString += `&${key}=${value}`;
      }
    });
  }

  if (multiValueQueryStringParameters) {
    Object.entries(multiValueQueryStringParameters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length) {
        value.forEach((item) => {
          rawMultiQueryString += `&${key}=${item}`;
        });
      }
    });
  }

  if (rawQueryString || rawMultiQueryString) {
    url.search = '?';

    if (rawQueryString) {
      url.search += rawQueryString;
    }

    if (rawMultiQueryString) {
      url.search += rawMultiQueryString;
    }
  }

  return new Request(url, {
    method: httpMethod,
    headers,
    ...(body && {
      body: isBase64Encoded ? Buffer.from(body, 'base64').toString() : body,
    }),
  });
}

export async function parseToLambdaResponse(
  res: Response,
  options?: { isBase64Encoded?: boolean }
): Promise<APIGatewayProxyResult> {
  const lambdaRes: APIGatewayProxyResult = {
    isBase64Encoded: options?.isBase64Encoded,
    statusCode: res.status,
    headers: {},
    body: '',
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
    lambdaRes.body = await res.text();

    if (lambdaRes.isBase64Encoded) {
      lambdaRes.body = Buffer.from(lambdaRes.body).toString('base64');
    }
  } catch (error) {
    // Response has no body
  }

  return lambdaRes;
}

export async function serverlessHttpCtrl(
  event: APIGatewayProxyEvent,
  callback: (res: Request) => Promise<Response>,
  serverlessCallback: APIGatewayProxyCallback
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
