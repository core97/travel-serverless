import { AsyncLocalStorage } from 'async_hooks';
import { AppContext } from '../types/app-context.type';

/**
 * Application context used to store information in asynchronous execution
 *  @type {AsyncLocalStorage<AppContext>}
 */
export const appContext = new AsyncLocalStorage();

/**
 * Executes a function with a context provided from an HTTP event
 * @param {Function} callback
 * @param {AppContext} context
 * @return {Promise<void>}
 */
export async function withContextFromHttpEvent(callback, context) {
  const { callback, context } = params;

  const res = await appContext.run(context, callback);

  return res;
}
