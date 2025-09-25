import { Injectable } from '@angular/core';
import { appConfigData } from '../../data/app-config.data';

@Injectable({
	providedIn: 'root',
})
export class Config {
	public readonly api = appConfigData.api;
	public readonly logLevel = appConfigData.logLevel;
}
