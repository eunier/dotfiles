import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { mikroOrmOptions } from './options/mikro-orm.options';

@Module({
	imports: [MikroOrmModule.forRoot(mikroOrmOptions)],
})
export class OrmModule {
	public static forRoot = MikroOrmModule.forRoot;
	public static forFeature = MikroOrmModule.forFeature;
}
