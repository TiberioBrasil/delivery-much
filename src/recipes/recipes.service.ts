import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiServicesService } from '../api-services/api-services.service';
import { IRecipeResponse } from './models/recipe-response.interface';
import { IRecipeResultsResponse } from './models/recipe-results-response.interface';
import { IRecipe } from './models/recipe.interface';
import { RequestRecipeDto } from './models/request-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(private apiServicesService: ApiServicesService) {}

  async findRecipes(
    requestRecipeDto: RequestRecipeDto,
  ): Promise<IRecipeResponse> {
    // Creates an ingredient var
    const ingredients = requestRecipeDto.i;

    // Check if any ingredient was sent
    if (!ingredients.trim()) {
      throw new BadRequestException(
        'Você deve informar de 1 a 3 ingredientes!',
      );
    }

    // Sets the ingredients array
    const ingredientsArray = ingredients.split(',');

    // Check if the user sent more than 3 ingredients
    if (ingredientsArray.length > 3) {
      throw new BadRequestException(
        'Você deve informar de 1 a 3 ingredientes!',
      );
    }

    // Creates an array to store valid ingredients sent by the user
    const validIngredientsArray = [];

    // Populates the validIngredients array
    if (ingredientsArray.length === 1) {
      validIngredientsArray.push(ingredients);
    } else {
      ingredientsArray.map((ingredient) => {
        // Remove duplicate ingredients
        !validIngredientsArray.includes(ingredient.trim()) &&
          validIngredientsArray.push(ingredient);
      });
    }

    // Sets the final validIngredients const
    const validIngredients = validIngredientsArray.join(',');

    // Receives the recipes result list
    const recipesList = await this.getRecipes(
      `http://www.recipepuppy.com/api/?i=${validIngredients}`,
    );

    // For any recipes call the getGiphy function to retrieve a gif based on recipe title
    const returnData = await Promise.all(
      recipesList.map(async (recipe: IRecipeResultsResponse) => {
        return this.getGiphy(recipe);
      }),
    );

    // Return the object
    return {
      keywords: validIngredientsArray,
      recipes: returnData,
    };
  }

  async getRecipes(url: string): Promise<IRecipeResultsResponse[]> {
    // Use axios to fetch data from a specific URL usibg built-in HttpModule
    const recipesResponse = await this.apiServicesService.getHttpResponse(url);

    if (!recipesResponse) {
      throw new BadRequestException(
        `Erro ao tentar selecionar dados da API externa: recipepuppy`,
      );
    }

    const returnData = [];
    recipesResponse.results.map((recipe: IRecipeResultsResponse) => {
      returnData.push(recipe);
    });

    return returnData;
  }

  async getGiphy(recipe: IRecipeResultsResponse): Promise<IRecipe> {
    const returnElement = {
      title: unescape(recipe.title),
      ingredients: recipe.ingredients.split(',').map((item) => {
        return item.trim();
      }),
      link: recipe.href,
    };

    try {
      const giphy = await this.apiServicesService.getHttpResponse(
        `${process.env.GIPHY_URL}` +
          `?api_key=${process.env.GIPHY_API_KEY}` +
          `&q=${recipe.title}&limit=1&offset=0&rating=g&lang=en`,
      );

      let giphyImage: string;

      if (!giphy) {
        giphyImage = 'Erro ao seconectar à API do Giphy!';
      } else {
        giphyImage = giphy.data[0].images.original.url;
        if (!giphyImage) {
          giphyImage = 'Giphy não encontrado!';
        }
      }

      return {
        ...returnElement,
        gif: giphyImage,
      } as IRecipe;
    } catch (error) {
      return {
        ...returnElement,
        gif: 'Erro ao seconectar à API do Giphy!',
      } as IRecipe;
    }
  }
}
