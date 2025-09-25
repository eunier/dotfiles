import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import { AppModule } from '~/app/app.module';
import { mikroOrmTestOptions } from '~/app/orm/options/mikro-orm.options';
import { OrmModule } from '~/app/orm/orm.module';

describe('AppController (e2e)', () => {
	let app: INestApplication<App>;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideModule(OrmModule)
			.useModule(OrmModule.forRoot(mikroOrmTestOptions))
			.compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('should be defined', () => {
		expect(app).toBeDefined();
	});

	// import * as request from 'supertest';
	// it('/ (GET)', () => {
	// 	return request(app.getHttpServer())
	// 		.get('/')
	// 		.expect(200)
	// 		.expect('Hello World!');
	// });
});
