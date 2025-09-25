import { Module } from '@nestjs/common';
import { SourceRepositoryProvider } from '~/app/source/providers/source-repository.provider';

@Module({
	providers: [SourceRepositoryProvider],
})
export class SourceModule {}
