import { faker } from '@faker-js/faker/.';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AccessTokenGuard } from '~/app/auth/guards/access-token/access-token.guard';
import { Config } from '~/app/config/services/config/config.service';
import { JwtConfigService } from '~/app/config/services/jwt-config/jwt-config.service';
import { Utils } from '~/app/utils/services/utils/utils.service';

beforeEach(() => {
	faker.seed(
		Utils.genSeedFromString(
			expect.getState().currentTestName ?? AccessTokenGuard.name,
		),
	);
});

describe('AccessTokenGuard', () => {
	let guard: AccessTokenGuard;
	let context: ExecutionContext;
	let service: JwtService;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				AccessTokenGuard,
				{
					provide: Config,
					useValue: {
						jwt: {
							audience: faker.string.nanoid(),
							issuer: faker.string.nanoid(),
							secret: faker.string.nanoid(),
						} satisfies Partial<JwtConfigService> as JwtConfigService,
					} satisfies Partial<Config>,
				},
				{
					provide: JwtService,
					useValue: { verifyAsync: jest.fn() } satisfies Partial<JwtService>,
				},
			],
		}).compile();

		guard = moduleRef.get<AccessTokenGuard>(AccessTokenGuard);
		service = moduleRef.get<JwtService>(JwtService);
	});

	it('should be defined', () => {
		expect(guard).toBeDefined();
	});

	it('should throw UnauthorizedException if no token is found', async () => {
		context = {
			switchToHttp: () =>
				({
					getRequest: jest.fn().mockReturnValue({
						headers: { authorization: 'token' },
					}),
				}) satisfies Partial<HttpArgumentsHost> as unknown as HttpArgumentsHost,
		} satisfies Partial<ExecutionContext> as ExecutionContext;

		try {
			await guard.canActivate(context);
			fail();
		} catch (error) {
			expect(error).toBeInstanceOf(UnauthorizedException);
			expect((error as UnauthorizedException).message).toBe('No token found');
		}
	});

	it('should throw UnauthorizedException if no authorization header is found', async () => {
		context = {
			switchToHttp: () =>
				({
					getRequest: jest.fn().mockReturnValue({ headers: {} }),
				}) satisfies Partial<HttpArgumentsHost> as unknown as HttpArgumentsHost,
		} satisfies Partial<ExecutionContext> as ExecutionContext;

		try {
			await guard.canActivate(context);
			fail();
		} catch (error) {
			expect(error).toBeInstanceOf(UnauthorizedException);
			expect((error as UnauthorizedException).message).toBe('No token found');
		}
	});

	it('should return true if token is valid', async () => {
		context = {
			switchToHttp: () =>
				({
					getRequest: jest.fn().mockReturnValue({
						headers: {
							authorization: `token ${faker.string.nanoid()}.${faker.string.nanoid()}.${faker.string.nanoid()}`,
						},
					}),
				}) satisfies Partial<HttpArgumentsHost> as unknown as HttpArgumentsHost,
		} satisfies Partial<ExecutionContext> as ExecutionContext;

		service.verifyAsync = jest.fn().mockResolvedValue({});
		const res = await guard.canActivate(context);
		expect(res).toBe(true);
	});

	describe('when token is invalid', () => {
		it('should return false', async () => {
			context = {
				switchToHttp: () =>
					({
						getRequest: jest.fn().mockReturnValue({
							headers: {
								authorization: `token ${faker.string.nanoid()}.${faker.string.nanoid()}.${faker.string.nanoid()}`,
							},
						}),
					}) satisfies Partial<HttpArgumentsHost> as unknown as HttpArgumentsHost,
			} satisfies Partial<ExecutionContext> as ExecutionContext;

			service.verifyAsync = jest
				.fn()
				.mockRejectedValue(new Error('Invalid token'));

			const res = await guard.canActivate(context);
			expect(res).toBe(false);
		});
	});

	describe('when error is not an instance of Error', () => {
		it('should return false', async () => {
			context = {
				switchToHttp: () =>
					({
						getRequest: jest.fn().mockReturnValue({
							headers: {
								authorization: `token ${faker.string.nanoid()}.${faker.string.nanoid()}.${faker.string.nanoid()}`,
							},
						}),
					}) satisfies Partial<HttpArgumentsHost> as unknown as HttpArgumentsHost,
			} satisfies Partial<ExecutionContext> as ExecutionContext;

			service.verifyAsync = jest.fn().mockRejectedValue('Invalid token');
			const res = await guard.canActivate(context);
			expect(res).toBe(false);
		});
	});
});
