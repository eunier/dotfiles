import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { ExchangePublicTokenRequestAccount } from '~/app/link/dto/exchange-public-token-request-account.dto';

export class ExchangePublicTokenRequestDto {
	@ApiProperty({
		description:
			'This is the public token returned by the Plaid Link on the UI.',
	})
	@IsString()
	public readonly publicToken: string;

	@ApiProperty({
		description: 'The institution for which the user selected the account.',
	})
	@IsString()
	public readonly institutionId: string;

	@IsArray()
	public readonly accounts: ExchangePublicTokenRequestAccount[];
}
