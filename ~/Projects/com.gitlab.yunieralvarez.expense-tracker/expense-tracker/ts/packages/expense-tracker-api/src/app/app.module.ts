import { Module } from '@nestjs/common';
import { AuthModule } from '~/app/auth/auth.module';
import { ConfigModule } from '~/app/config/config.module';
import { DebugModule } from '~/app/debug/debug.module';
import { InstitutionModule } from '~/app/institution/institution.module';
import { LinkModule } from '~/app/link/link.module';
import { OrmModule } from '~/app/orm/orm.module';
import { PlaidModule } from '~/app/plaid/plaid.module';
import { SourceModule } from '~/app/source/source.module';
import { TransactionModule } from '~/app/transaction/transaction.module';
import { TransformerModule } from '~/app/transformer/transformer.module';
import { UserModule } from '~/app/user/user.module';
import { UtilsModule } from '~/app/utils/utils.module';

@Module({
	imports: [
		AuthModule,
		ConfigModule,
		DebugModule,
		InstitutionModule,
		LinkModule,
		OrmModule,
		PlaidModule,
		SourceModule,
		TransactionModule,
		TransformerModule,
		UserModule,
		UtilsModule,
	],
})
export class AppModule {}
