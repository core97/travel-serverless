import { withContextFromHttpEvent } from 'core/application/app-context';
import { httpController } from 'core/helpers/http/http-controller.helper';
import { HttpEvent } from 'core/types/http-event.type';

/**
 * @param {function(HttpEvent)} callback
 */
export function httpHandler(callback) {
  return {
    run: (event) =>
      withContextFromHttpEvent(() => httpController(event, callback), {
        traceId: event.requestContext.requestId,
        request: {
          method: event.requestContext.http.method,
          url: event.requestContext.http.path,
        },
      }),
  };
}
