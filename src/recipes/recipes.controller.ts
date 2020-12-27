import { Controller, Get, Query } from '@nestjs/common';
import { RequestRecipeDto } from './models/request-recipe.dto';
import { RecipesService } from './recipes.service';
import { IRecipeResponse } from './models/recipe-response.interface';
import { ApiBadRequestResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @ApiTags('recipes')
  @ApiResponse({
    status: 200,
    description: 'Succes. You will receive a list of recipes.',
  })
  @ApiBadRequestResponse({
    description: `BadRequestResponse. You should send 1 to 3 ingredients separated by comma.`,
  })
  @Get()
  async findRecipes(
    @Query() requestRecipeDto: RequestRecipeDto,
  ): Promise<IRecipeResponse> {
    return this.recipesService.findRecipes(requestRecipeDto);
  }
}
