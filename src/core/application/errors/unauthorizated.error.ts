import { AppError } from '@/core/application/errors/app-error';
import { HttpErrorCode } from '@/core/helpers/http/http-errors.helper';

export class UnauthorizatedError extends AppError {
  constructor(message?: string) {
    super(message || 'Unauthorizated', HttpErrorCode.UNAUTHORIZATED);
  }
}
