import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiServicesModule } from './api-services/api-services.module';
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [ConfigModule.forRoot(), RecipesModule, ApiServicesModule],
})
export class AppModule {}
