import { AppError } from '@/core/application/errors/app-error';
import { HttpErrorCode } from '@/core/helpers/http/http-errors.helper';

export class UnprocessableEntityError extends AppError {
  constructor(message?: string) {
    super(message || 'Unprocesable entity', HttpErrorCode.UNPROCESSABLE_ENTITY);
  }
}
