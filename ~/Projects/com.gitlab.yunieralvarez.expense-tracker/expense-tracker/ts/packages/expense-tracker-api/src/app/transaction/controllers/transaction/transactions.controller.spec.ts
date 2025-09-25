import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '~/app/transaction/services/transaction/transaction.service';
import { TransactionsController } from './transactions.controller';

describe('TransactionsController', () => {
	let controller: TransactionsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TransactionsController],
			providers: [{ provide: TransactionService, useValue: {} }],
		}).compile();

		controller = module.get<TransactionsController>(TransactionsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
