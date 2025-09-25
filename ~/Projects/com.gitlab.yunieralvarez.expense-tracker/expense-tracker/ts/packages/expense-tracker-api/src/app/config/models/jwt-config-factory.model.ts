export interface JwtConfigFactory {
	readonly accessTokenTtl: string;
	readonly audience: string;
	readonly issuer: string;
	readonly refreshTokenTtl: string;
	readonly secret: string;
}
