import { AppError } from '@/core/application/errors/app-error';
import { HttpErrorCode } from '@/core/helpers/http/http-errors.helper';

export class ContentTooLargeError extends AppError {
  constructor(message?: string) {
    super(message || 'Content Too Large', HttpErrorCode.CONTENT_TOO_LARGE);
  }
}
