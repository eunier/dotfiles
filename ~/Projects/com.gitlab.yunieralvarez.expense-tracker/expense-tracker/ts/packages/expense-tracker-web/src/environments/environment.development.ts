import { AppConfigData } from '../app/config/models/app-config-data.model';
import { LogLevel } from '../app/log/enums/log-level.enum';


export const environment: AppConfigData = {
	api: 'http://localhost:3000/api',
	logLevel: LogLevel.Info,
};
