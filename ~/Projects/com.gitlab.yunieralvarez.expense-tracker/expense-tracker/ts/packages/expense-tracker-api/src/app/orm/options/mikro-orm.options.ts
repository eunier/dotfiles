import { Migrator, TSMigrationGenerator } from '@mikro-orm/migrations';
import { PostgreSqlDriver, defineConfig } from '@mikro-orm/postgresql';
import { PostgreSqlOptions } from '@mikro-orm/postgresql/PostgreSqlMikroORM';
import * as dotenv from 'dotenv';
import { AccountEntity } from '~/app/account/entities/account/account.entity';
import { AppEnv } from '~/app/config/enums/app-env.enum';
import { ConfigKey } from '~/app/config/enums/config-key.enum';
import { InstitutionEntity } from '~/app/institution/entities/institution/institution.entity';
import { SourceEntity } from '~/app/source/entities/source/source.entity';
import { TransactionEntity } from '~/app/transaction/entities/transaction/transaction.entity';
import { UserEntity } from '~/app/user/entities/user/user.entity';

dotenv.config();

class MigrationGenerator extends TSMigrationGenerator {
	generateMigrationFile(
		className: string,
		diff: { up: string[]; down: string[] },
	): string {
		const newClassName = className
			.split('_')
			.map((el) => `${el.at(0)?.toUpperCase()}${el.slice(1)}`)
			.join('_')
			.split('-')
			.map((el) => `${el.at(0)?.toUpperCase()}${el.slice(1)}`)
			.join('')
			.replaceAll('-', '');

		return super.generateMigrationFile(newClassName, diff);
	}
}

const options: PostgreSqlOptions = {
	dbName: process.env[ConfigKey.PostgresDatabase],
	driver: PostgreSqlDriver,
	entities: [
		AccountEntity,
		InstitutionEntity,
		SourceEntity,
		TransactionEntity,
		UserEntity,
	],
	host: process.env[ConfigKey.PostgresHost]!,
	password: process.env[ConfigKey.PostgresPassword],
	port: +process.env[ConfigKey.PostgresPort]!,
	user: process.env[ConfigKey.PostgresUsername],
	extensions: [Migrator],
	migrations: {
		fileName: (timestamp, name) =>
			`${timestamp}${name ? `.${name}` : ''}.migration`,
		generator: MigrationGenerator,
		pathTs: './src/app/orm/migrations',
		tableName: 'migration',
	},
	debug: process.env[ConfigKey.AppEnv] === AppEnv.Development,
};

export default defineConfig(options);

export const mikroOrmOptions = defineConfig(options);

export const mikroOrmTestOptions = defineConfig({
	...options,
	connect: false,
	dbName: 'test',
	allowGlobalContext: true,
	debug: false,
});
