import { HttpStatus } from '@/core/helpers/http/http-status.helper';

export const httpReponse = {
  jsonResponse(code: HttpStatus, message?: string | Record<string, unknown>) {
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

  ok<T>(dto?: T) {
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

  clientError(message?: string) {
    return this.jsonResponse(HttpStatus.BAD_REQUEST, message);
  },

  unauthorized(message?: string) {
    return this.jsonResponse(HttpStatus.UNAUTHORIZATED, message);
  },

  forbidden(message?: string) {
    return this.jsonResponse(HttpStatus.FORBIDDEN, message);
  },

  notFound(message?: string) {
    return this.jsonResponse(HttpStatus.NOT_FOUND, message);
  },

  conflict(message?: string) {
    return this.jsonResponse(HttpStatus.CONFLICT, message);
  },

  notAcceptable(message?: string) {
    return this.jsonResponse(HttpStatus.NOT_ACCEPTABLE, message);
  },

  invalidParams(message?: string) {
    return this.jsonResponse(HttpStatus.UNPROCESSABLE_ENTITY, message);
  },

  contentTooLarge(message?: string) {
    return this.jsonResponse(HttpStatus.CONTENT_TOO_LARGE, message);
  },

  fail(error?: unknown) {
    const body = error ? JSON.stringify({ message: error?.toString() }) : null;

    return new Response(body, { status: HttpStatus.INTERNAL_ERROR });
  },
};
