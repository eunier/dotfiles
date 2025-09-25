import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '~/app/auth/decorators/auth.decorator';
import { LoginRequestDto } from '~/app/auth/dto/login-request.dto';
import { RefreshRequestDto } from '~/app/auth/dto/refresh-request.dto';
import { RegisterDto } from '~/app/auth/dto/register.dto';
import { AuthType } from '~/app/auth/enums/auth-type.enum';
import { AuthService } from '~/app/auth/services/auth/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly service: AuthService) {}

	@Auth(AuthType.None)
	@Post('register')
	public async register(@Body() dto: RegisterDto) {
		return this.service.register(dto);
	}

	@Auth(AuthType.None)
	@HttpCode(HttpStatus.OK)
	@Post('login')
	public async login(@Body() dto: LoginRequestDto) {
		return await this.service.login(dto);
	}

	@Auth(AuthType.None)
	@HttpCode(HttpStatus.OK)
	@Post('refresh')
	public async refresh(@Body() dto: RefreshRequestDto) {
		return await this.service.refresh(dto);
	}
}
