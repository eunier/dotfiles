import { Reflector } from '@nestjs/core';
import { AuthType } from '~/app/auth/enums/auth-type.enum';

export const Auth = Reflector.createDecorator<AuthType | AuthType[]>();
