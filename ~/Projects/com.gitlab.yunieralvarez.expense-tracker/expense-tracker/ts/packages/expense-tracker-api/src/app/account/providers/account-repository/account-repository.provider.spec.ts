import { Test, TestingModule } from '@nestjs/testing';
import { AccountRepositoryProvider } from '~/app/account/providers/account-repository/account-repository.provider';
import { AccountRepository } from '~/app/account/repositories/account/account.repository';
import { mikroOrmTestOptions } from '~/app/orm/options/mikro-orm.options';
import { OrmModule } from '~/app/orm/orm.module';

 describe('AccountRepositoryProvider', () => {
	let repository: AccountRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmModule.forRoot(mikroOrmTestOptions)],
			providers: [AccountRepositoryProvider],
		}).compile();

		repository = module.get<AccountRepository>(AccountRepository);
	});

	it('should be defined', () => {
		expect(repository).toBeDefined();
	});

	it('should be an instance of AccountRepository', () => {
		expect(repository).toBeInstanceOf(AccountRepository);
	});
});
