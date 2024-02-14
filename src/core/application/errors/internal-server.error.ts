import { AppError } from '@/core/application/errors/app-error';
import { HttpErrorCode } from '@/core/helpers/http/http-errors.helper';

export class InternalServerError extends AppError {
  constructor(message?: string) {
    super(message || 'Internal server error', HttpErrorCode.INTERNAL_ERROR);
  }
}
