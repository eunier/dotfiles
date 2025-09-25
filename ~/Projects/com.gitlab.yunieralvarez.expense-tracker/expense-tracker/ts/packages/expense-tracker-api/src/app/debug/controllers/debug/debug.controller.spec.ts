import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '~/app/transaction/services/transaction/transaction.service';
import { DebugController } from './debug.controller';

describe('DebugController', () => {
	let controller: DebugController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [DebugController],
			providers: [{ provide: TransactionService, useValue: {} }],
		}).compile();

		controller = module.get<DebugController>(DebugController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
