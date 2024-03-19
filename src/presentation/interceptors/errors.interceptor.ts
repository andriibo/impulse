import {
    Injectable,
    CallHandler,
    ExecutionContext,
    BadRequestException,
    NestInterceptor,
    UnauthorizedException, ForbiddenException, NotFoundException
} from '@nestjs/common';
import {BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError} from 'application/errors';
import {catchError, Observable, throwError} from 'rxjs';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((err) => {
                if (err instanceof BadRequestError) {
                    return throwError(() => new BadRequestException(err.message));
                }
                if (err instanceof UnauthorizedError) {
                    return throwError(() => new UnauthorizedException(err.message));
                }
                if (err instanceof ForbiddenError) {
                    return throwError(() => new ForbiddenException(err.message));
                }
                if (err instanceof NotFoundError) {
                    return throwError(() => new NotFoundException(err.message));
                }

                return throwError(() => err);
            }),
        );
    }
}
