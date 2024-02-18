import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

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
