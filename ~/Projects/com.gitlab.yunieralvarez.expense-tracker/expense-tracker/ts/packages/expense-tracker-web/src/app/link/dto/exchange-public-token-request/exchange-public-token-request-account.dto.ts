import { PlaidAccount } from 'react-plaid-link';

export class ExchangePublicTokenRequestAccount {
	public constructor(
		public readonly plaidId: string,
		public readonly name: string,
		public readonly subtype: string,
		public readonly mask: string,
	) {}

	public static fromPlaidLinkOnSuccessCallbackAccount(account: PlaidAccount) {
		return new ExchangePublicTokenRequestAccount(
			account.id,
			account.name,
			account.subtype,
			account.mask,
		);
	}
}
