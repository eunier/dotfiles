import {
	CallHandler,
	ExecutionContext,
	Injectable,
	Logger,
	NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';

@Injectable()
export class DebugLoggingInterceptor implements NestInterceptor {
	private readonly logger = new Logger(DebugLoggingInterceptor.name);

	intercept(context: ExecutionContext, next: CallHandler) {
		const request = context.switchToHttp().getRequest();

		this.logger.debug('Request: ', {
			method: request.method,
			url: request.url,
			body: request.body,
		});

		return next.handle().pipe(
			tap((res) => {
				this.logger.debug('Response: ', {
					statusCode: context.switchToHttp().getResponse().statusCode,
					method: request.method,
					url: request.url,
					body: res,
				});
			}),
		);
	}
}
