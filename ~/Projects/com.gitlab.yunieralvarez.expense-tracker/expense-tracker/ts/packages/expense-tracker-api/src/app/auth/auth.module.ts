import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '~/app/auth/controllers/auth/auth.controller';
import { AccessTokenGuard } from '~/app/auth/guards/access-token/access-token.guard';
import { Argon2Provider } from '~/app/auth/providers/argon2.provider';
import { AuthGuardProvider } from '~/app/auth/providers/auth-guard.provider';
import { AuthService } from '~/app/auth/services/auth/auth.service';
import { ConfigModule } from '~/app/config/config.module';
import { OrmModule } from '~/app/orm/orm.module';
import { UserEntity } from '~/app/user/entities/user/user.entity';
import { UserModule } from '~/app/user/user.module';

@Module({
	imports: [
		ConfigModule,
		JwtModule,
		OrmModule.forFeature([UserEntity]),
		UserModule,
	],
	controllers: [AuthController],
	providers: [AuthService, Argon2Provider, AuthGuardProvider, AccessTokenGuard],
})
export class AuthModule {}
