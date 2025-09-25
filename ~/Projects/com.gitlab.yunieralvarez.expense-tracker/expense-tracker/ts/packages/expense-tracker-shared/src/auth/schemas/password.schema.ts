import { v } from '../../utils/valid.util';

export const passwordSchema = v.string().min(8).max(32);

export type PasswordSchema = v.infer<typeof passwordSchema>;
