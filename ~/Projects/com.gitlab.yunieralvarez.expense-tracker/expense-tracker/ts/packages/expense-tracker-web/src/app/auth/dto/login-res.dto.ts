import { AccessToken } from '../models/access-token.mode';
import { RefreshToken } from '../models/refresh-token.model';

export interface LoginResDto {
	readonly accessToken: AccessToken;
	readonly refreshToken: RefreshToken;
}
