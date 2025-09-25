import { Test, TestingModule } from '@nestjs/testing';
import { SourceRepository } from './source.service';

describe('SourceService', () => {
	let service: SourceRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [SourceRepository],
		}).compile();

		service = module.get<SourceRepository>(SourceRepository);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
