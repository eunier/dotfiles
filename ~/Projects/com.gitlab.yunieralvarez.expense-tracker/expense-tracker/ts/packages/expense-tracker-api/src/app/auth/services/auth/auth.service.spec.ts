import { faker } from '@faker-js/faker/.';
import {
	EntityManager,
	UniqueConstraintViolationException,
} from '@mikro-orm/postgresql';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginRequestDto } from '~/app/auth/dto/login-request.dto';
import { LoginResponseDto } from '~/app/auth/dto/login-response.dto';
import { RefreshRequestDto } from '~/app/auth/dto/refresh-request.dto';
import { RefreshResponseDto } from '~/app/auth/dto/refresh-response.dto';
import { RegisterDto } from '~/app/auth/dto/register.dto';
import { JwtStandardFields } from '~/app/auth/models/jwt-standard-fields.model';
import { Token } from '~/app/auth/models/token.model';
import { AuthService } from '~/app/auth/services/auth/auth.service';
import { HashingService } from '~/app/auth/services/hashing/hashing.service';
import { Config } from '~/app/config/services/config/config.service';
import { JwtConfigService } from '~/app/config/services/jwt-config/jwt-config.service';
import { UserEntity } from '~/app/user/entities/user/user.entity';
import { UserRepository } from '~/app/user/repositories/user/user.repositories';
import { Utils } from '~/app/utils/services/utils/utils.service';

beforeEach(() => {
	faker.seed(
		Utils.genSeedFromString(
			expect.getState().currentTestName ?? AuthService.name,
		),
	);
});

describe('AuthService', () => {
	let service: AuthService;
	let em: EntityManager;
	let hashingService: HashingService;
	let userRepository: UserRepository;
	let jwtService: JwtService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: Config,
					useValue: {
						jwt: {
							audience: faker.string.nanoid(),
							issuer: faker.string.nanoid(),
							secret: faker.string.nanoid(),
							accessTokenTtl: faker.number.int({ min: 1, max: 10 }),
							refreshTokenTtl: faker.number.int({ min: 10, max: 20 }),
						} satisfies Partial<JwtConfigService> as JwtConfigService,
					} satisfies Partial<Config>,
				},
				{
					provide: EntityManager,
					useValue: {
						persistAndFlush: jest.fn(),
					} satisfies Partial<EntityManager>,
				},
				{
					provide: HashingService,
					useValue: { hash: jest.fn() } satisfies Partial<HashingService>,
				},
				{
					provide: JwtService,
					useValue: { signAsync: jest.fn() } satisfies Partial<JwtService>,
				},
				{
					provide: UserRepository,
					useValue: {} satisfies Partial<UserRepository>,
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
		em = module.get<EntityManager>(EntityManager);
		hashingService = module.get<HashingService>(HashingService);
		userRepository = module.get<UserRepository>(UserRepository);
		jwtService = module.get<JwtService>(JwtService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('register', () => {
		it('should call entityManager.persistAndFlush on success', async () => {
			const dto = new RegisterDto(
				faker.internet.email(),
				faker.internet.password(),
			);

			const spy = jest.spyOn(em, 'persistAndFlush');
			hashingService.hash = jest
				.fn()
				.mockResolvedValue(faker.string.alphanumeric(50));

			await service.register(dto);
			expect(spy).toHaveBeenCalledTimes(1);

			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({
					email: 'Nina_Lakin@hotmail.com',
					password: 'u7RGIfXGlJCcrPmGwLHABGcuGkAUAGGdKKX2h5lRfRttHN8Zxg',
				} satisfies Partial<UserEntity>),
			);
		});

		describe('when failure', () => {
			describe('when user already exists', () => {
				it('should throw ConflictException', async () => {
					const dto = new RegisterDto(
						faker.internet.email(),
						faker.internet.password(),
					);

					const spy = jest.spyOn(em, 'persistAndFlush');
					hashingService.hash = jest
						.fn()
						.mockRejectedValue(
							new UniqueConstraintViolationException(new Error('Some error')),
						);

					try {
						await service.register(dto);
						fail('Expected ConflictException to be thrown');
					} catch (err) {
						expect(err).toBeInstanceOf(ConflictException);

						expect((err as ConflictException).message).toEqual(
							'Account already created',
						);
					}
				});
			});

			describe('when some other error occurs', () => {
				it('should throw the error', async () => {
					const dto = new RegisterDto(
						faker.internet.email(),
						faker.internet.password(),
					);

					const spy = jest.spyOn(em, 'persistAndFlush');

					hashingService.hash = jest
						.fn()
						.mockRejectedValue(new Error('Some other error'));

					try {
						await service.register(dto);
						fail('Expected Error to be thrown');
					} catch (err) {
						expect(err).toBeInstanceOf(Error);
						expect((err as Error).message).toEqual('Some other error');
					}
				});
			});
		});
	});

	describe('login', () => {
		describe('when user does not exist', () => {
			it('should throw UnauthorizedException', async () => {
				const dto = new LoginRequestDto(
					faker.internet.email(),
					faker.internet.password(),
				);

				userRepository.findOne = jest.fn().mockResolvedValue(null);

				try {
					await service.login(dto);
					fail('Expected UnauthorizedException to be thrown');
				} catch (err) {
					expect(err).toBeInstanceOf(UnauthorizedException);

					expect((err as UnauthorizedException).message).toEqual(
						'User does not exist',
					);
				}
			});
		});

		describe('when user exist', () => {
			describe('when password does not match', () => {
				it('should throw UnauthorizedException', async () => {
					const dto = new LoginRequestDto(
						faker.internet.email(),
						faker.internet.password(),
					);

					const user = new UserEntity(dto.email, faker.string.alphanumeric(50));

					userRepository.findOne = jest.fn().mockResolvedValue(user);
					hashingService.compare = jest.fn().mockResolvedValue(false);

					try {
						await service.login(dto);
						fail('Expected UnauthorizedException to be thrown');
					} catch (err) {
						expect(err).toBeInstanceOf(UnauthorizedException);

						expect((err as UnauthorizedException).message).toEqual(
							'Password does not match',
						);
					}
				});
			});

			describe('when password matches', () => {
				it('should return access and refresh tokens', async () => {
					const dto = new LoginRequestDto(
						faker.internet.email(),
						faker.internet.password(),
					);

					const user = new UserEntity(dto.email, faker.string.alphanumeric(50));

					userRepository.findOne = jest.fn().mockResolvedValue(user);
					hashingService.compare = jest.fn().mockResolvedValue(true);

					jwtService.signAsync = jest
						.fn()
						.mockResolvedValueOnce(
							Array(3)
								.fill(null)
								.map(() => faker.string.alphanumeric(10))
								.join('.'),
						)
						.mockResolvedValueOnce(
							Array(3)
								.fill(null)
								.map(() => faker.string.alphanumeric(10))
								.join('.'),
						);

					const res = await service.login(dto);

					expect(res).toEqual({
						accessToken: 'jzlSAoShJ3.Q64TrmSpeS.F0x7ZC1RXm',
						refreshToken: '4rlx073kJC.mvNO3eNi37.zGN5lVUfJa',
					} satisfies LoginResponseDto);
				});
			});
		});
	});

	describe('refresh', () => {
		it('should return new access and refresh tokens', async () => {
			const dto = new RefreshRequestDto(
				Array(3)
					.fill(null)
					.map(() => faker.string.alphanumeric(10))
					.join('.') as Token,
			);

			jwtService.verifyAsync = jest.fn().mockResolvedValueOnce({
				sub: faker.string.nanoid(),
			} satisfies Partial<JwtStandardFields>);

			jwtService.signAsync = jest
				.fn()
				.mockResolvedValueOnce(
					Array(3)
						.fill(null)
						.map(() => faker.string.alphanumeric(10))
						.join('.'),
				)
				.mockResolvedValueOnce(
					Array(3)
						.fill(null)
						.map(() => faker.string.alphanumeric(10))
						.join('.'),
				);

			const res = await service.refresh(dto);

			expect(res).toEqual({
				accessToken: 'Fjrmt0XUmo.0zAeEFsuWN.ajeKynnP5K',
				refreshToken: 'la8Ov3UuBL.elvSJJ9niQ.6Z2zBqXZqP',
			} satisfies Partial<RefreshResponseDto>);
		});
	});
});
