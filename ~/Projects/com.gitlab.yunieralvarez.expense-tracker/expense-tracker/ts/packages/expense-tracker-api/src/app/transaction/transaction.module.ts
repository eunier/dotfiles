import { Module } from '@nestjs/common';
import { AccountModule } from '~/app/account/account.module';
import { AccountEntity } from '~/app/account/entities/account/account.entity';
import { ConfigModule } from '~/app/config/config.module';
import { OrmModule } from '~/app/orm/orm.module';
import { PlaidModule } from '~/app/plaid/plaid.module';
import { SourceEntity } from '~/app/source/entities/source/source.entity';
import { SourceModule } from '~/app/source/source.module';
import { TransactionsController } from '~/app/transaction/controllers/transaction/transactions.controller';
import { TransactionEntity } from '~/app/transaction/entities/transaction/transaction.entity';
import { TransactionRepositoryProvider } from '~/app/transaction/providers/transaction-repository.provider';
import { TransactionService } from '~/app/transaction/services/transaction/transaction.service';
import { UtilsModule } from '~/app/utils/utils.module';

@Module({
	imports: [
		AccountModule,
		ConfigModule,
		OrmModule.forFeature([AccountEntity, SourceEntity, TransactionEntity]),
		PlaidModule,
		SourceModule,
		UtilsModule,
	],
	controllers: [TransactionsController],
	providers: [TransactionRepositoryProvider, TransactionService],
	exports: [TransactionService],
})
export class TransactionModule {}
