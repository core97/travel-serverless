/**
 * @typedef {Object} HttpEvent
 * @property {string} version
 * @property {string} routeKey
 * @property {string} rawPath
 * @property {string} [rawQueryString]
 * @property {string[]} [cookies]
 * @property {Headers} headers
 * @property {Record<string, string>} [queryStringParameters]
 * @property {RequestContext} requestContext
 * @property {*} body
 * @property {Record<string, string>} [pathParameters]
 * @property {boolean} isBase64Encoded
 * @property {Record<string, string>} [stageVariables]
 */

/**
 * @typedef {Object.<string, string>} Headers
 */

/**
 * @typedef {Object} HttpResponse
 * @property {HttpStatus} statusCode
 * @property {string=} body
 * @property {Headers} [headers]
 */

/**
 * @typedef {Object} RequestContext
 * @property {string} accountId
 * @property {string} apiId
 * @property {Authentication} [authentication]
 * @property {Authorizer} [authorizer]
 * @property {string} domainName
 * @property {string} domainPrefix
 * @property {HTTP} http
 * @property {string} requestId
 * @property {string} routeKey
 * @property {string} stage
 * @property {string} time
 * @property {number} timeEpoch
 */

/**
 * @typedef {Object} Authentication
 * @property {ClientCERT} clientCert
 */

/**
 * @typedef {Object} ClientCERT
 * @property {string} clientCertPem
 * @property {string} subjectDN
 * @property {string} issuerDN
 * @property {string} serialNumber
 * @property {Validity} validity
 */

/**
 * @typedef {Object} Validity
 * @property {string} notBefore
 * @property {string} notAfter
 */

/**
 * @typedef {Object} Authorizer
 * @property {Jwt} jwt
 */

/**
 * @typedef {Object} Jwt
 * @property {Record<string, string>} claims
 * @property {string[]} scopes
 */

/**
 * @typedef {Object} HTTP
 * @property {string} method
 * @property {string} path
 * @property {string} protocol
 * @property {string} sourceIp
 * @property {string} userAgent
 */

export {};
