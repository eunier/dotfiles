import { Migration } from '@mikro-orm/migrations';

export class Migration2AddInstitutionSourceAccountTransaction extends Migration {
	override async up(): Promise<void> {
		this.addSql(
			`create table "institution" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz not null, "updated_at" timestamptz not null, "institution_plaid_id" varchar(255) not null, "name" varchar(255) not null, constraint "institution_pkey" primary key ("id"));`,
		);

		this.addSql(
			`create table "source" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz not null, "updated_at" timestamptz not null, "access_token" varchar(255) not null, "plaid_source_id" varchar(255) not null, "request_id" varchar(255) not null, "transaction_cursor" varchar(255) null, "institution_id" uuid not null, "user_id" uuid not null, constraint "source_pkey" primary key ("id"));`,
		);

		this.addSql(
			`create table "account" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz not null, "updated_at" timestamptz not null, "plaid_id" varchar(255) not null, "name" varchar(255) not null, "subtype" varchar(255) not null, "mask" varchar(255) not null, "source_id" uuid not null, constraint "account_pkey" primary key ("id"));`,
		);

		this.addSql(
			`create table "transaction" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz not null, "updated_at" timestamptz not null, "amount" int not null, "currency_code" varchar(255) null, "category" varchar(255) null, "merchant_name" varchar(255) not null, "date" timestamptz not null, "authorized_date" varchar(255) null, "transaction_id" varchar(255) not null, "plaid_account_id" varchar(255) not null, "pending_transaction_id" varchar(255) null, "account_id" uuid not null, constraint "transaction_pkey" primary key ("id"));`,
		);

		this.addSql(
			`alter table "source" add constraint "source_institution_id_foreign" foreign key ("institution_id") references "institution" ("id") on update cascade;`,
		);
		this.addSql(
			`alter table "source" add constraint "source_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`,
		);

		this.addSql(
			`alter table "account" add constraint "account_source_id_foreign" foreign key ("source_id") references "source" ("id") on update cascade;`,
		);

		this.addSql(
			`alter table "transaction" add constraint "transaction_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade;`,
		);
	}

	override async down(): Promise<void> {
		this.addSql(
			`alter table "source" drop constraint "source_institution_id_foreign";`,
		);

		this.addSql(
			`alter table "account" drop constraint "account_source_id_foreign";`,
		);

		this.addSql(
			`alter table "transaction" drop constraint "transaction_account_id_foreign";`,
		);

		this.addSql(`drop table if exists "institution" cascade;`);
		this.addSql(`drop table if exists "source" cascade;`);
		this.addSql(`drop table if exists "account" cascade;`);
		this.addSql(`drop table if exists "transaction" cascade;`);
	}
}
