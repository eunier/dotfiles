import { AccessToken } from '~/app/auth/models/access-token.model';
import { RefreshToken } from '~/app/auth/models/refresh-token.model';
import { TokenSet } from '~/app/auth/models/token-set.model';

export class LoginResponseDto {
	readonly accessToken: AccessToken;
	readonly refreshToken: RefreshToken;

	constructor(accessToken: AccessToken, refreshToken: RefreshToken) {
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
	}
}
