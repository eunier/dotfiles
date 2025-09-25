import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';
import { USER_MIN_LENGTH } from '~/app/auth/constants/auth.constants';

export class RegisterDto {
	@ApiProperty({ example: 'name@mail.com' })
	@IsEmail()
	public readonly email: string;

	@ApiProperty({ example: 'password' })
	@MinLength(USER_MIN_LENGTH)
	public readonly password: string;

	constructor(email: string, password: string) {
		this.email = email;
		this.password = password;
	}
}
