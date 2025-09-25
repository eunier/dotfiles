import { Test, TestingModule } from '@nestjs/testing';
import { LinkController } from '~/app/link/controllers/link/link.controller';
import { LinkService } from '~/app/link/services/link/link.service';

describe('LinkController', () => {
	let controller: LinkController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [LinkController],
			providers: [{ provide: LinkService, useValue: {} }],
		}).compile();

		controller = module.get<LinkController>(LinkController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
