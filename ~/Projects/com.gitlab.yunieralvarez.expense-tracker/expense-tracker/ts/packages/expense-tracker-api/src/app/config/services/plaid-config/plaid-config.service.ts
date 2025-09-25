import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CountryCode, Products } from 'plaid';
import { PLAID_CONFIG_TOKEN } from '../../configs/plaid.config';
import { PlaidConfig } from '../../models/plaid-config.model';

@Injectable()
export class PlaidConfigService {
	public readonly clientId: string;
	public readonly countryCodes: CountryCode[];
	public readonly env: string;
	public readonly products: Products[];
	public readonly redirectUri: string;
	public readonly secret: string;
	public readonly version: string;

	public constructor(
		@Inject(PLAID_CONFIG_TOKEN)
		private readonly plaidConfig: ConfigType<PlaidConfig>,
	) {
		this.clientId = this.plaidConfig.clientId;

		this.countryCodes = this.plaidConfig.countryCodes.split(
			',',
		) as CountryCode[];

		this.env = this.plaidConfig.env;
		this.products = this.plaidConfig.products.split(',') as Products[];
		this.redirectUri = this.plaidConfig.redirectUri;
		this.secret = this.plaidConfig.secret;
		this.version = this.plaidConfig.version;
	}
}
