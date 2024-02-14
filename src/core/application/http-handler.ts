import { Context, Callback } from 'aws-lambda';
import { withContextFromHttpEvent } from '@/core/application/app-context';
import { serverlessHttpCtrl } from '@/core/helpers/serverless.helper';
import { HttpEvent, HttpResponse } from '@/core/types/http-event.type';

export function httpHandler(callback: (req: Request) => Promise<Response>) {
  return {
    run(
      event: HttpEvent,
      context: Context,
      serverlessCallback: Callback<HttpResponse>
    ) {
      return withContextFromHttpEvent(
        () => serverlessHttpCtrl(event, callback, serverlessCallback),
        {
          traceId: event.requestContext.requestId,
          request: {
            method: event.requestContext.http.method,
            url: event.requestContext.http.path,
          },
        }
      );
    },
  };
}
