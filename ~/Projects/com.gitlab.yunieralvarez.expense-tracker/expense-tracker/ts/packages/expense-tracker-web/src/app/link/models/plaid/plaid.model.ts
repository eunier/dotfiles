import type { PlaidLinkOptions } from 'react-plaid-link';

export interface Plaid {
	readonly create: (options: PlaidLinkOptions) => {
		readonly open: () => unknown;
		readonly exit: () => unknown;
		readonly destroy: () => unknown;
	};
}
