export type RecursivePartial<T> = {
	[TKey in keyof T]?: RecursivePartial<T[TKey]>;
};
