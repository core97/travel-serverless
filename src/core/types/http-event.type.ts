export type HttpEvent = {
  version: string;
  routeKey: string;
  rawPath: string;
  rawQueryString?: string;
  cookies: string[];
  headers: HttpHeaders;
  queryStringParameters?: Record<string, string>;
  requestContext: RequestContext;
  body: any;
  pathParameters?: Record<string, string>;
  isBase64Encoded: boolean;
  stageVariables: Record<string, string>;
};

export type HttpResponse = {
  statusCode: number;
  body?: string;
  isBase64Encoded?: boolean,
  headers?: HttpHeaders;
  multiValueHeaders?: HttpHeaders,
};

type HttpHeaders = Record<string, string>;

type RequestContext = {
  accountId: string;
  apiId: string;
  authentication?: Authentication;
  authorizer?: Authorizer;
  domainName: string;
  domainPrefix: string;
  http: Http;
  requestId: string;
  routeKey: string;
  stage: string;
  time: string;
  timeEpoch: number;
};

type Authentication = {
  clientCert: {
    clientCertPem: string;
    subjectDN: string;
    issuerDN: string;
    serialNumber: string;
    validity: {
      notBefore: string;
      notAfter: string;
    };
  };
};

type Authorizer = {
  jwt: {
    claims: Record<string, string>;
    scopes: string[];
  };
};

type Http = {
  method: string;
  path: string;
  protocol: string;
  sourceIp: string;
  userAgent: string;
};
