import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Data } from '~/app/transformer/models/data.interface';

@Injectable()
export class DataInterceptor<T> implements NestInterceptor<T, Data<T>> {
	public intercept(
		_context: ExecutionContext,
		next: CallHandler,
	): Observable<Data<T>> {
		return next.handle().pipe(
			map(
				(data: T): Data<T> => ({
					data,
				}),
			),
		);
	}
}
