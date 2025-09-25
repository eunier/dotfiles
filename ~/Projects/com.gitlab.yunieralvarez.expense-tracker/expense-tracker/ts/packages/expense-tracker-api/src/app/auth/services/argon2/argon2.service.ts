import { Injectable } from '@nestjs/common';
import * as lib from 'argon2';
import { HashingService } from '~/app/auth/services/hashing/hashing.service';

@Injectable()
export class Argon2Service implements HashingService {
	public async hash(data: string | Buffer) {
		return await lib.hash(data);
	}

	public async compare(data: string | Buffer, encrypted: string) {
		return await lib.verify(encrypted, data);
	}
}
