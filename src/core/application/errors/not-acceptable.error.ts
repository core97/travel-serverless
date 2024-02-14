import { AppError } from '@/core/application/errors/app-error';
import { HttpErrorCode } from '@/core/helpers/http/http-errors.helper';

export class NotAcceptableError extends AppError {
  constructor(message?: string) {
    super(message || 'Not Acceptable', HttpErrorCode.NOT_ACCEPTABLE);
  }
}
