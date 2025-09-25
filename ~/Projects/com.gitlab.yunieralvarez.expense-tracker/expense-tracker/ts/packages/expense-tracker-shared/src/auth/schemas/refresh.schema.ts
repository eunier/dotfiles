import { v } from '../../utils/valid.util';

export const refreshSchema = v.string();

export type RefreshSchema = v.infer<typeof refreshSchema>;
