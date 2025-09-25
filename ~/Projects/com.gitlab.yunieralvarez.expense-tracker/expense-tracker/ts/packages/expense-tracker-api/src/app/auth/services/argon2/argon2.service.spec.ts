import { Test } from '@nestjs/testing';
import { Argon2Service } from '~/app/auth/services/argon2/argon2.service';

describe('Argon2Service', () => {
	let service: Argon2Service;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [Argon2Service],
		}).compile();

		service = module.get<Argon2Service>(Argon2Service);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should should match password', async () => {
		const hash = await service.hash('password');
		const res = await service.compare('password', hash);
		expect(res).toBe(true);
	});

	it('should should not match password', async () => {
		const hash = await service.hash('password');
		const res = await service.compare('wrong-password', hash);
		expect(res).toBe(false);
	});
});
