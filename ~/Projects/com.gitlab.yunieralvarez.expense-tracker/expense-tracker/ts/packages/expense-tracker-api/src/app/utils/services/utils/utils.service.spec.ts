import { Test, TestingModule } from '@nestjs/testing';
import { Utils } from './utils.service';

describe('UtilsService', () => {
	let service: Utils;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [Utils],
		}).compile();

		service = module.get<Utils>(Utils);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('delay', () => {
		it('should delay for the specified time', async () => {
			const start = Date.now();
			await service.delay(1000);
			const end = Date.now();
			expect(end - start).toBeGreaterThanOrEqual(1000);
		});
	});
});
