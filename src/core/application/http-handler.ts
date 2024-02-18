import {
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyCallback,
} from 'aws-lambda';
import { withContextFromHttpEvent } from '@/core/application/app-context';
import { HttpResponse } from '@/core/helpers/http/http-response.helper';
import { httpController } from '@/core/helpers/http/http-controller.helper';
import {
  parseHttpEventToRequest,
  parseToLambdaResponse,
} from '@/core/helpers/serverless.helper';

export function httpHandler(
  callback: (req: Request, res: HttpResponse) => Promise<Response>
) {
  return {
    run(
      event: APIGatewayProxyEvent,
      context: Context,
      serverlessCallback: APIGatewayProxyCallback
    ) {
      const traceId = event.requestContext.requestId;

      return withContextFromHttpEvent(
        async () => {
          const requestParsed = parseHttpEventToRequest(event);
          const httpResponse = new HttpResponse();

          httpResponse.headers.set('x-trace-id', traceId);

          const { res, error } = await httpController(
            requestParsed,
            httpResponse,
            callback
          );

          const resParsed = await parseToLambdaResponse(res);

          serverlessCallback(error, resParsed);
        },
        {
          traceId,
          request: {
            method: event.httpMethod,
            url: event.path,
          },
        }
      );
    },
  };
}
