import { HttpStatus } from './http-status.helper';

export const httpReponse = {
  jsonResponse(code, message) {
    if (message) {
      return new Response(
        JSON.stringify(typeof message === 'string' ? { message } : message),
        {
          status: code,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(null, { status: code });
  },

  ok(dto) {
    if (dto) {
      return new Response(JSON.stringify(dto), {
        status: HttpStatus.OK,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(null, { status: HttpStatus.OK });
  },

  created() {
    return new Response(null, { status: HttpStatus.CREATED });
  },

  clientError(message) {
    return this.jsonResponse(HttpStatus.BAD_REQUEST, message);
  },

  unauthorized(message) {
    return this.jsonResponse(HttpStatus.UNAUTHORIZATED, message);
  },

  forbidden(message) {
    return this.jsonResponse(HttpStatus.FORBIDDEN, message);
  },

  notFound(message) {
    return this.jsonResponse(HttpStatus.NOT_FOUND, message);
  },

  conflict(message) {
    return this.jsonResponse(HttpStatus.CONFLICT, message);
  },

  notAcceptable(message) {
    return this.jsonResponse(HttpStatus.NOT_ACCEPTABLE, message);
  },

  invalidParams(message) {
    return this.jsonResponse(HttpStatus.UNPROCESSABLE_ENTITY, message);
  },

  contentTooLarge(message) {
    return this.jsonResponse(HttpStatus.CONTENT_TOO_LARGE, message);
  },

  fail(error) {
    const body = error ? JSON.stringify({ message: error?.toString() }) : null;

    return new Response(body, { status: HttpStatus.INTERNAL_ERROR });
  },
};
