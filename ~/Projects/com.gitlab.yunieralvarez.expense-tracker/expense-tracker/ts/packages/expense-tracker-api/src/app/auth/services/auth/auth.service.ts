import {
	EntityManager,
	UniqueConstraintViolationException,
} from '@mikro-orm/postgresql';
import {
	ConflictException,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { LoginRequestDto } from '~/app/auth/dto/login-request.dto';
import { LoginResponseDto } from '~/app/auth/dto/login-response.dto';
import { RefreshRequestDto } from '~/app/auth/dto/refresh-request.dto';
import { RefreshResponseDto } from '~/app/auth/dto/refresh-response.dto';
import { RegisterDto } from '~/app/auth/dto/register.dto';
import { ActiveUserData } from '~/app/auth/models/active-user-data.model';
import { TokenPayload } from '~/app/auth/models/token-payload.model';
import { TokenSet } from '~/app/auth/models/token-set.model';
import { Token } from '~/app/auth/models/token.model';
import { HashingService } from '~/app/auth/services/hashing/hashing.service';
import { Config } from '~/app/config/services/config/config.service';
import { UserEntity } from '~/app/user/entities/user/user.entity';
import { UserRepository } from '~/app/user/repositories/user/user.repositories';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);
	constructor(
		private readonly config: Config,
		private readonly entityManager: EntityManager,
		private readonly hashingService: HashingService,
		private readonly jwtService: JwtService,
		private readonly userRepository: UserRepository,
	) {}

	public async register(dto: RegisterDto) {
		try {
			const user = new UserEntity();
			user.email = dto.email;
			user.password = await this.hashingService.hash(dto.password);
			await this.entityManager.persistAndFlush(user);
		} catch (err) {
			if (err instanceof UniqueConstraintViolationException) {
				throw new ConflictException('Account already created');
			}

			throw err;
		}
	}

	public async login(dto: LoginRequestDto) {
		const user = await this.userRepository.findOne({
			email: dto.email,
		});

		if (!user) {
			throw new UnauthorizedException('User does not exist');
		}

		this.logger.debug('Got user:', user);

		const arePasswordEqual = await this.hashingService.compare(
			dto.password,
			user.password,
		);

		if (!arePasswordEqual) {
			throw new UnauthorizedException('Password does not match');
		}

		const [accessToken, refreshToken] = await this.generateTokens(user.id);
		return { accessToken, refreshToken } satisfies LoginResponseDto;
	}

	public async refresh(dto: RefreshRequestDto) {
		this.logger.debug('Refreshing tokens...');

		const options: JwtVerifyOptions = {
			audience: this.config.jwt.audience,
			issuer: this.config.jwt.issuer,
			secret: this.config.jwt.secret,
		};

		const tokenUser = await this.jwtService.verifyAsync<ActiveUserData>(
			dto.refreshToken,
			options,
		);

		const tokensSet = await this.generateTokens(tokenUser.sub);

		const res = RefreshResponseDto.fromTokenSet(tokensSet);
		this.logger.debug('Generated new tokens:', res);
		return res;
	}

	private async generateTokens(userId: string): Promise<TokenSet> {
		const payload: TokenPayload = { sub: userId };

		const accessTokenOptions: JwtSignOptions = {
			audience: this.config.jwt.audience,
			issuer: this.config.jwt.issuer,
			secret: this.config.jwt.secret,
			expiresIn: this.config.jwt.accessTokenTtl,
		};

		const refreshTokenOptions: JwtSignOptions = {
			audience: this.config.jwt.audience,
			issuer: this.config.jwt.issuer,
			secret: this.config.jwt.secret,
			expiresIn: this.config.jwt.refreshTokenTtl,
		};

		const accessToken = (await this.jwtService.signAsync(
			payload,
			accessTokenOptions,
		)) as Token;

		const refreshToken = (await this.jwtService.signAsync(
			payload,
			refreshTokenOptions,
		)) as Token;

		return [accessToken, refreshToken];
	}
}



