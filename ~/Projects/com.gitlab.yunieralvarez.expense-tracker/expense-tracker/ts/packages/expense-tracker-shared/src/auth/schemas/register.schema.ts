import { v } from '../../utils/valid.util';
import { emailSchema } from './email.schema';
import { passwordSchema } from './password.schema';

export const registerSchema = v
	.object({
		email: emailSchema,
		password: passwordSchema,
	})
	.strict();

export type RegisterSchema = v.infer<typeof registerSchema>;
