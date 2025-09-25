export interface PostgresConfigFactory {
	readonly database: string;
	readonly host: string;
	readonly password: string;
	readonly port: string;
	readonly username: string;
}
