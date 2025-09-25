import { Provider } from '@nestjs/common';
import { Argon2Service } from '~/app/auth/services/argon2/argon2.service';
import { HashingService } from '~/app/auth/services/hashing/hashing.service';

export const Argon2Provider: Provider = {
	provide: HashingService,
	useClass: Argon2Service,
};
