import { AppError } from '@/core/application/errors/app-error';
import { HttpErrorCode } from '@/core/helpers/http/http-errors.helper';

export class ForbiddenError extends AppError {
  constructor(message?: string) {
    super(message || 'Forbidden', HttpErrorCode.FORBIDDEN);
  }
}
