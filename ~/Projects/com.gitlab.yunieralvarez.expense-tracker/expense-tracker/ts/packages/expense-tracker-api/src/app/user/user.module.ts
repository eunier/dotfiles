import { Module } from '@nestjs/common';
import { UserRepositoryProvider } from '~/app/user/providers/user-repository.provider';
import { UserRepository } from '~/app/user/repositories/user/user.repositories';

@Module({
	providers: [UserRepositoryProvider],
	exports: [UserRepository],
})
export class UserModule {}
