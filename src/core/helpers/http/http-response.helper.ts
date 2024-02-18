import { HttpStatus } from '@/core/helpers/http/http-status.helper';

export class HttpResponse {
  readonly headers: Headers;

  readonly body?: string | Record<string, unknown> | boolean | number | null;

  constructor() {
    this.headers = new Headers();
  }

  ok<T>(dto?: T): Response {
    if (dto) {
      return this.transformToResponse(HttpStatus.OK, { body: dto });
    }

    return this.transformToResponse(HttpStatus.OK);
  }

  created(): Response {
    return this.transformToResponse(HttpStatus.CREATED);
  }

  clientError(message?: string): Response {
    return this.transformToResponse(HttpStatus.BAD_REQUEST, { body: message });
  }

  unauthorized(message?: string): Response {
    return this.transformToResponse(HttpStatus.UNAUTHORIZATED, {
      body: message,
    });
  }

  forbidden(message?: string): Response {
    return this.transformToResponse(HttpStatus.FORBIDDEN, { body: message });
  }

  notFound(message?: string): Response {
    return this.transformToResponse(HttpStatus.NOT_FOUND, { body: message });
  }

  conflict(message?: string): Response {
    return this.transformToResponse(HttpStatus.CONFLICT, { body: message });
  }

  notAcceptable(message?: string): Response {
    return this.transformToResponse(HttpStatus.NOT_ACCEPTABLE, {
      body: message,
    });
  }

  invalidParams(message?: string): Response {
    return this.transformToResponse(HttpStatus.UNPROCESSABLE_ENTITY, {
      body: message,
    });
  }

  contentTooLarge(message?: string): Response {
    return this.transformToResponse(HttpStatus.CONTENT_TOO_LARGE, {
      body: message,
    });
  }

  fail(message?: unknown): Response {
    let body: string | null = null;

    if (message instanceof Error) {
      body = message.message;
    } else if (typeof message === 'string') {
      body = message;
    }

    return this.transformToResponse(HttpStatus.INTERNAL_ERROR, { body });
  }

  transformToResponse<T extends HttpResponse['body']>(
    code: HttpStatus,
    options?: { body?: T }
  ): Response {
    const headersParsed: Record<string, string> = {};

    this.headers.forEach((value, key) => {
      headersParsed[key] = value;
    });

    return new Response(this.parseBody(options?.body), {
      headers: {
        ...headersParsed,
        ...(typeof options?.body === 'object' && {
          'Content-Type': 'application/json',
        }),
      },
      status: code,
    });
  }

  private parseBody(body?: HttpResponse['body']): BodyInit | null {
    if (typeof body === 'string') {
      return body;
    } else if (typeof body === 'object') {
      return JSON.stringify(body);
    } else if (typeof body === 'boolean') {
      return `${body}`;
    } else if (typeof body === 'number') {
      return body.toString();
    }

    return null;
  }
}
