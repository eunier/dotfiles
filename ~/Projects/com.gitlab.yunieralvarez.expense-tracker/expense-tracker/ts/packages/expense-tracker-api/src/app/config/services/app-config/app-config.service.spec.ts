import { Test, TestingModule } from '@nestjs/testing';
import { APP_CONFIG_TOKEN } from '~/app/config/configs/app.config';
import { AppConfigService } from '~/app/config/services/app-config/app-config.service';

describe('Config', () => {
	let service: AppConfigService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AppConfigService,
				{
					provide: APP_CONFIG_TOKEN,
					useValue: {},
				},
			],
		}).compile();

		service = module.get<AppConfigService>(AppConfigService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});