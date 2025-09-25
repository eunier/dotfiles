import { Test, TestingModule } from '@nestjs/testing';
import { InstitutionRepository } from '~/app/institution/repositories/institution/institution.repository';

describe('InstitutionRepository', () => {
	let service: InstitutionRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [InstitutionRepository],
		}).compile();

		service = module.get<InstitutionRepository>(InstitutionRepository);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
