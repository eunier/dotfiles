export interface JwtStandardFields {
	/**
	 * Audience
	 *
	 * Identifies the recipients that the JWT is intended for. Each principal
	 * intended to process the JWT must identify itself with a value in the
	 * audience claim. If the principal processing the claim does not identify
	 * itself with a value in the aud claim when this claim is present, then
	 * the JWT must be rejected.
	 */
	readonly aud: string;

	/**
	 * 	Expiration Time
	 *
	 * Identifies the expiration time on and after which the JWT must not be
	 * accepted for processing. The value must be a NumericDate either an
	 * integer or decimal, representing seconds past 1970-01-01 00:00:00Z.
	 */
	readonly exp: number;

	/**
	 * Issued at
	 *
	 * Identifies the time at which the JWT was issued. The value must be a NumericDate.
	 */
	readonly iat: number;

	/**
	 * Issuer
	 *
	 * Identifies principal that issued the JWT.
	 */
	readonly iss: string;

	/**
	 * Subject
	 *
	 * Identifies the subject of the JWT.
	 */
	readonly sub: string;
}
