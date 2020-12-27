import { HttpModule, Module } from '@nestjs/common';
import { ApiServicesService } from '../api-services/api-services.service';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

@Module({
  imports: [HttpModule],
  providers: [RecipesService, ApiServicesService],
  controllers: [RecipesController],
})
export class RecipesModule {}
