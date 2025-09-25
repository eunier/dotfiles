import { Provider } from '@nestjs/common';
import { PlaidApi } from 'plaid';

export const PLAID_API_CLASS_TOKEN = 'PLAID_API_CLASS_TOKEN';

export const PlaidApiClassProvider: Provider = {
	provide: PLAID_API_CLASS_TOKEN,
	useValue: PlaidApi,
};
