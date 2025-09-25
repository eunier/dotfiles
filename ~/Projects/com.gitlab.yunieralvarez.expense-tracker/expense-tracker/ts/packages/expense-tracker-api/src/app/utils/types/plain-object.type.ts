type PlainObject<T> = {
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	[K in keyof T as T[K] extends Function ? never : K]: T[K];
};
