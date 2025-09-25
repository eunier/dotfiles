import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataInterceptor } from '~/app/transformer/interceptors/data.interceptor';

@Module({
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: DataInterceptor,
		},
	],
})
export class TransformerModule {}
