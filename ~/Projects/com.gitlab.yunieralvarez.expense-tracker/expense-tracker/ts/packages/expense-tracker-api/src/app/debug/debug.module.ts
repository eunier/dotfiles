import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DebugController } from '~/app/debug/controllers/debug/debug.controller';
import { DebugLoggingInterceptor } from '~/app/debug/interceptors/debug-logging/debug-logging.interceptor';
import { TransactionModule } from '~/app/transaction/transaction.module';

@Module({
	imports: [TransactionModule],
	controllers: [DebugController],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: DebugLoggingInterceptor,
		},
	],
})
export class DebugModule {}
