import { Module } from '@nestjs/common';
import { AccountRepositoryProvider } from '~/app/account/providers/account-repository/account-repository.provider';

@Module({
	providers: [AccountRepositoryProvider],
})
export class AccountModule {}
