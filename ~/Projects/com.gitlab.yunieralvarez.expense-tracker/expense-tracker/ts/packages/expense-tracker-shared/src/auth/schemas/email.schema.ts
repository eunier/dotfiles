import { v } from '../../utils/valid.util';

export const emailSchema = v.string().email();

export type EmailSchema = v.infer<typeof emailSchema>;
