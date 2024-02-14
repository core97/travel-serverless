import { AsyncLocalStorage } from 'async_hooks';
import { AppContext } from '@/core/types/app-context.type';

export const appContext = new AsyncLocalStorage<AppContext>();

export async function withContextFromHttpEvent(
  callback: () => Promise<void>,
  context: AppContext
) {
  const res = await appContext.run(context, callback);

  return res;
}
