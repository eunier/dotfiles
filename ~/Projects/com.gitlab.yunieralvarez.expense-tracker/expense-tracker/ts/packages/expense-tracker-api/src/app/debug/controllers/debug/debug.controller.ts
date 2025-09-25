import { Controller, Delete, Get, Logger } from '@nestjs/common';
import { ActiveUser } from '~/app/auth/decorators/active-user.decorator';
import { ActiveUserData } from '~/app/auth/models/active-user-data.model';
import { TransactionService } from '~/app/transaction/services/transaction/transaction.service';

@Controller('debug')
export class DebugController {
	private readonly logger = new Logger(DebugController.name);

	constructor(private readonly transactionService: TransactionService) {}

	@Get('secured')
	public secured(@ActiveUser() user: ActiveUserData) {
		this.logger.debug('Secured endpoint accessed');
		this.logger.debug(`User: ${JSON.stringify(user)}`);
	}

	@Delete('transaction')
	public async removeTransactions(@ActiveUser('sub') userId: string) {
		return await this.transactionService.removeTransactions(userId);
	}
}
