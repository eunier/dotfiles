import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { TokenSet } from '~/app/auth/models/token-set.model';

export class RefreshResponseDto {
	@ApiProperty()
	@IsNotEmpty()
	public readonly accessToken: string;

	@ApiProperty()
	@IsNotEmpty()
	public readonly refreshToken: string;

	public constructor(accessToken: string, refreshToken: string) {
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
	}

	public static fromTokenSet(tokens: TokenSet): RefreshResponseDto {
		return new RefreshResponseDto(tokens[0], tokens[1]);
	}
}
