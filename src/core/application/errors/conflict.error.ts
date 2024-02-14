import { AppError } from '@/core/application/errors/app-error';
import { HttpErrorCode } from '@/core/helpers/http/http-errors.helper';

export class ConflictError extends AppError {
  constructor(message = 'Conflict', bussinessCode?: string) {
    super(message, HttpErrorCode.CONFLICT, bussinessCode);
  }
}
