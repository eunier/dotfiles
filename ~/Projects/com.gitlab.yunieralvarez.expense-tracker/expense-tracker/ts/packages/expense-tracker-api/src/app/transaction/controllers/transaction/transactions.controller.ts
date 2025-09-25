import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActiveUser } from '../../../auth/decorators/active-user.decorator';
import { TransactionService } from '../../services/transaction/transaction.service';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionsController {
	public constructor(private readonly transactionService: TransactionService) {}

	@Get()
	public async syncTransactions(@ActiveUser('sub') userId: string) {
		await this.transactionService.syncTransactions(userId);
	}
}
