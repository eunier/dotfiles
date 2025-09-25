import { PlaidLinkOnSuccessMetadata } from 'react-plaid-link';
import { ExchangePublicTokenRequestAccount } from './exchange-public-token-request-account.dto';

export class ExchangePublicTokenRequestDto {
	public constructor(
		public readonly publicToken: string,
		public readonly accounts: ExchangePublicTokenRequestAccount[],
		public readonly institutionId?: string,
	) {}

	public static fromPlaidLinkOnSuccessCallback(
		publicToken: string,
		metadata: PlaidLinkOnSuccessMetadata,
	) {
		return new ExchangePublicTokenRequestDto(
			publicToken,
			metadata.accounts.map(
				ExchangePublicTokenRequestAccount.fromPlaidLinkOnSuccessCallbackAccount,
			),
			metadata.institution?.institution_id,
		);
	}
}
