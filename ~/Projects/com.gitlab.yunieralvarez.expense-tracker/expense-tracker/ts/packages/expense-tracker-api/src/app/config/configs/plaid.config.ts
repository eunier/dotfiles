import { registerAs } from '@nestjs/config';
import { ConfigKey } from '~/app/config/enums/config-key.enum';
import { PlaidConfigFactory } from '~/app/config/models/plaid-config-factory.model';

export const plaidConfig = registerAs(
	'plaid',
	() =>
		({
			clientId: process.env[ConfigKey.PlaidClientId]!,
			countryCodes: process.env[ConfigKey.PlaidCountryCodes]!,
			env: process.env[ConfigKey.PlaidEnv]!,
			products: process.env[ConfigKey.PlaidProducts]!,
			redirectUri: process.env[ConfigKey.PlaidRedirectUri]!,
			secret: process.env[ConfigKey.PlaidSecret]!,
			version: process.env[ConfigKey.PlaidVersion]!,
		}) satisfies PlaidConfigFactory,
);

export const PLAID_CONFIG_TOKEN = plaidConfig.KEY;
