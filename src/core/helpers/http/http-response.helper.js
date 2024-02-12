import { HttpStatus } from 'core/helpers/http/http-status.helper';

export const httpReponse = {
  jsonResponse(code, message) {
    if (message) {
      return {
        statusCode: code,
        headers: { 'Content-Type': 'application/json' },
        body: typeof message === 'string' ? message : JSON.stringify(message),
      };
    }

    return {
      statusCode: code,
      headers: { 'Content-Type': 'application/json' },
    };
  },

  ok(dto) {
    if (dto) {
      return {
        statusCode: HttpStatus.OK,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      };
    }

    return {
      statusCode: HttpStatus.OK,
    };
  },

  created() {
    return {
      statusCode: HttpStatus.CREATED,
    };
  },

  clientError(message) {
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      ...(message && { body: message }),
    };
  },

  unauthorized(message) {
    return {
      statusCode: HttpStatus.UNAUTHORIZATED,
      ...(message && { body: message }),
    };
  },

  forbidden(message) {
    return {
      statusCode: HttpStatus.FORBIDDEN,
      ...(message && { body: message }),
    };
  },

  notFound(message) {
    return {
      statusCode: HttpStatus.NOT_FOUND,
      ...(message && { body: message }),
    };
  },

  conflict(message) {
    return {
      statusCode: HttpStatus.CONFLICT,
      ...(message && { body: message }),
    };
  },

  notAcceptable(message) {
    return {
      statusCode: HttpStatus.NOT_ACCEPTABLE,
      ...(message && { body: message }),
    };
  },

  invalidParams(message) {
    return {
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      ...(message && { body: message }),
    };
  },

  contentTooLarge(message) {
    return {
      statusCode: HttpStatus.CONTENT_TOO_LARGE,
      ...(message && { body: message }),
    };
  },

  fail(message) {
    return {
      statusCode: HttpStatus.INTERNAL_ERROR,
      ...(message && { body: message }),
    };
  },
};
