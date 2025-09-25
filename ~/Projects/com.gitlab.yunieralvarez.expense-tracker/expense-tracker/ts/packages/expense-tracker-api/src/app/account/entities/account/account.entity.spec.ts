import { faker } from '@faker-js/faker/.';
import { AccountEntity } from '~/app/account/entities/account/account.entity';
import { AccountRepository } from '~/app/account/repositories/account/account.repository';
import { ExchangePublicTokenRequestAccount } from '~/app/link/dto/exchange-public-token-request-account.dto';
import { SourceEntity } from '~/app/source/entities/source/source.entity';
import { Utils } from '~/app/utils/services/utils/utils.service';

faker.seed(Utils.genSeedFromString(AccountEntity.name));

describe('AccountEntity', () => {
	it('should be defined', () => {
		expect(new AccountEntity()).toBeDefined();
	});
	describe('metadata', () => {
		it('repositoryFn', () => {
			expect(AccountEntity.metadata.repositoryFn()).toBe(AccountRepository);
		});
	});

	it('should match args', () => {
		const args = {
			id: faker.string.uuid(),
			mask: faker.string.numeric(4),
			name: faker.person.firstName(),
			plaidId: faker.string.uuid(),
			subtype: faker.string.alpha(5),
		};

		expect(new AccountEntity(args)).toMatchObject(args);
	});

	it('should has defined source', () => {
		const entity = new AccountEntity({ source: new SourceEntity() });
		expect(entity.source).toBeDefined();
		expect(entity.source).toBeInstanceOf(SourceEntity);
	});

	describe('fromExchangePublicTokenRequestAccount', () => {
		it('should return an AccountEntity', () => {
			const req: ExchangePublicTokenRequestAccount = {
				mask: faker.string.numeric(4),
				name: faker.person.firstName(),
				plaidId: faker.string.uuid(),
				subtype: faker.string.alpha(5),
			};

			const entity = AccountEntity.fromExchangePublicTokenRequestAccount(req);
			expect(entity).toBeInstanceOf(AccountEntity);
			expect(entity.plaidId).toBe(req.plaidId);
			expect(entity.name).toBe(req.name);
			expect(entity.subtype).toBe(req.subtype);
		});
	});
});
