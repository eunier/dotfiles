import * as util from 'node:util';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Utils {
	public delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	public static *range(length: number) {
		for (let i = 0; i < length; i++) {
			yield i;
		}
	}

	public static inspectObject(
		...args: Parameters<(typeof util)['inspect']>
	): string {
		return util.inspect(...args);
	}

	public static genSeedFromString(string: string) {
		let hash = 0;

		for (let i = 0; i < string.length; i++) {
			const char = string.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash; // Convert to 32bit integer
		}

		return hash;
	}
}
