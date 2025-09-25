import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { PlaidApiClassProvider } from './providers/plaid-api-class.provider';
import { PlaidService } from './services/plaid/plaid.service';

@Module({
	imports: [ConfigModule],
	providers: [PlaidService, PlaidApiClassProvider],
	exports: [PlaidService],
})
export class PlaidModule {}
