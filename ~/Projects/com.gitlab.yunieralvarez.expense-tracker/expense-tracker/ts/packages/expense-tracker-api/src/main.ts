import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from '~/app/app.module';
import { Config } from '~/app/config/services/config/config.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableShutdownHooks();

	const config = app.get(Config);
	const logger = new Logger(bootstrap.name);

	app.setGlobalPrefix('api');
	app.use(helmet());

	app.useGlobalPipes(
		new ValidationPipe({
			forbidNonWhitelisted: true,
			transform: true,
			whitelist: true,
		}),
	);

	if (config.app.isDev()) {
		app.enableCors();
		logger.log('Cors enabled');
	}

	const options = new DocumentBuilder()
		.setTitle('Expense Tracker Api')
		.setDescription('Api for Expense Tracker Application')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('docs', app, document);

	await app.listen(config.app.port);
	logger.log(`Listen in port ${config.app.port}`);
}

bootstrap();

// TODO keep on refactoring import into using full path.
