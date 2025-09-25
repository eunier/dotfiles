import { v } from '../../utils/valid.util';
import { emailSchema } from './email.schema';
import { passwordSchema } from './password.schema';

export const loginSchema = v
	.object({
		email: emailSchema,
		password: passwordSchema,
	})
	.strict();

export type LoginSchema = v.infer<typeof loginSchema>;
