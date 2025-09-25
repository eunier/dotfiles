import { faker } from '@faker-js/faker/.';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '~/app/auth/controllers/auth/auth.controller';
import { LoginRequestDto } from '~/app/auth/dto/login-request.dto';
import { LoginResponseDto } from '~/app/auth/dto/login-response.dto';
import { RefreshRequestDto } from '~/app/auth/dto/refresh-request.dto';
import { RefreshResponseDto } from '~/app/auth/dto/refresh-response.dto';
import { RegisterDto } from '~/app/auth/dto/register.dto';
import { Token } from '~/app/auth/models/token.model';
import { AuthService } from '~/app/auth/services/auth/auth.service';
import { Utils } from '~/app/utils/services/utils/utils.service';

beforeEach(() => {
	faker.seed(
		Utils.genSeedFromString(
			expect.getState().currentTestName ?? AuthController.name,
		),
	);
});

describe('AuthController', () => {
	let controller: AuthController;
	let service: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthService,
					useValue: {
						login: jest.fn(),
						refresh: jest.fn(),
						register: jest.fn(),
					} satisfies Partial<AuthService>,
				},
			],
		}).compile();

		controller = module.get<AuthController>(AuthController);
		service = module.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('register', () => {
		it('should call service', async () => {
			const dto = new RegisterDto(
				faker.internet.email(),
				faker.internet.password(),
			);

			const serviceRegisterSpy = jest
				.spyOn(service, 'register')
				.mockResolvedValue(undefined);

			await controller.register(dto);
			expect(serviceRegisterSpy).toHaveBeenCalledWith(dto);
		});
	});

	describe('login', () => {
		it('should call service', async () => {
			const reqDto = new LoginRequestDto(
				faker.internet.email(),
				faker.internet.password(),
			);

			const resDto = new LoginResponseDto(
				faker.string.nanoid() as Token,
				faker.string.nanoid() as Token,
			);

			const serviceLoginSpy = jest
				.spyOn(service, 'login')
				.mockResolvedValue(resDto);

			const res = await controller.login(reqDto);
			expect(serviceLoginSpy).toHaveBeenCalledWith(reqDto);
			expect(res).toEqual(resDto);
		});
	});

	describe('refresh', () => {
		it('should call service', async () => {
			const reqDto = new RefreshRequestDto(faker.string.nanoid() as Token);

			const resDto = new RefreshResponseDto(
				faker.string.nanoid() as Token,
				faker.string.nanoid() as Token,
			);

			const serviceRefreshSpy = jest
				.spyOn(service, 'refresh')
				.mockResolvedValue(resDto);

			const res = await controller.refresh(reqDto);
			expect(serviceRefreshSpy).toHaveBeenCalledWith(reqDto);
			expect(res).toEqual(resDto);
		});
	});
});
