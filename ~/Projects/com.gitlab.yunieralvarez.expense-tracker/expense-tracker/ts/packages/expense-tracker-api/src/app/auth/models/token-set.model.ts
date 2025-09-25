import { AccessToken } from '~/app/auth/models/access-token.model';
import { RefreshToken } from '~/app/auth/models/refresh-token.model';

/** Tuple of `[AccessToken, RefreshToken]` */
export type TokenSet = readonly [AccessToken, RefreshToken];
