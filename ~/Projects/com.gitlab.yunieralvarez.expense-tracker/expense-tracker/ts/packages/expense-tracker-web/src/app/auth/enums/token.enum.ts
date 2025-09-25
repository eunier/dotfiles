import { LocalStorageKey } from '../../storage/enums/local-storage-key.enum';

export enum Token {
	AccessToken = LocalStorageKey.AccessToken,
	RefreshToken = LocalStorageKey.RefreshToken,
}
