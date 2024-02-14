import { withContextFromHttpEvent } from './app-context';
import { serverlessHttpCtrl } from '../helpers/serverless.helper';
import { HttpEvent } from '../types/http-event.type';

/**
 * @param {function(Request)} callback
 */
export function httpHandler(callback) {
  return {
    /**
     * @param {HttpEvent} event
     * @param {Object} context
     * @param {Function} serverlessCallback
     * @return {Promise<Response>}
     */
    run(event, context, serverlessCallback) {
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
