import { IsString } from 'class-validator';

export class ExchangePublicTokenRequestAccount {
	@IsString()
	public readonly plaidId: string;

	@IsString()
	public readonly name: string;

	@IsString()
	public readonly subtype: string;

	@IsString()
	public readonly mask: string;
}
