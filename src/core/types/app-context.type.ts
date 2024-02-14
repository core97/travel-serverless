export type AppContext = {
  traceId: string;
  request?: {
    method: string;
    url: string;
  };
};
