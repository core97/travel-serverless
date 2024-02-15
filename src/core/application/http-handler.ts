import {
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyCallback,
} from 'aws-lambda';
import { withContextFromHttpEvent } from '@/core/application/app-context';
import { serverlessHttpCtrl } from '@/core/helpers/serverless.helper';

export function httpHandler(callback: (req: Request) => Promise<Response>) {
  return {
    run(
      event: APIGatewayProxyEvent,
      context: Context,
      serverlessCallback: APIGatewayProxyCallback
    ) {
      return withContextFromHttpEvent(
        () => serverlessHttpCtrl(event, callback, serverlessCallback),
        {
          traceId: event.requestContext.requestId,
          request: {
            method: event.httpMethod,
            url: event.path,
          },
        }
      );
    },
  };
}
