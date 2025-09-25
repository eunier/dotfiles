import { Module } from '@nestjs/common';
import { Utils } from '~/app/utils/services/utils/utils.service';

@Module({
	providers: [Utils],
	exports: [Utils],
})
export class UtilsModule {}
