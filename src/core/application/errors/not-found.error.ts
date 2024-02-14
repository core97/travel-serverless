import { AppError } from '@/core/application/errors/app-error';
import { HttpErrorCode } from '@/core/helpers/http/http-errors.helper';

export class NotFoundError extends AppError {
  constructor(message?: string) {
    super(message || 'Not found', HttpErrorCode.NOT_FOUND);
  }
}
