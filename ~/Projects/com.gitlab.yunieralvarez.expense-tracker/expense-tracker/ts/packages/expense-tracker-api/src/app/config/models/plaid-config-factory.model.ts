export interface PlaidConfigFactory {
	readonly clientId: string;
	readonly countryCodes: string;
	readonly env: string;
	readonly products: string;
	readonly redirectUri: string;
	readonly secret: string;
	readonly version: string;
}
