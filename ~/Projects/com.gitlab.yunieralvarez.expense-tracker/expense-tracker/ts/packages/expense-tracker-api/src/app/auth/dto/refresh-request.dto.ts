import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Token } from '~/app/auth/models/token.model';

export class RefreshRequestDto {
	@ApiProperty()
	@IsNotEmpty()
	public readonly refreshToken: Token;

	constructor(refreshToken: Token) {
		this.refreshToken = refreshToken;
	}
}
