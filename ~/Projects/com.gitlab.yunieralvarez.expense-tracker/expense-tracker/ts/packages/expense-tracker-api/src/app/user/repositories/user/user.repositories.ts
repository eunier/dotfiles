import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../entities/user/user.entity';

@Injectable()
export class UserRepository extends EntityRepository<UserEntity> {}
