import { RecursivePartial } from '~/app/utils/types/recursive-partial.type';

export type PartialExcept<T, K extends keyof T> = RecursivePartial<T> &
	Pick<T, K>;
