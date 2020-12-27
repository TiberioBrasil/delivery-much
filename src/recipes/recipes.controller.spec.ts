import { Test, TestingModule } from '@nestjs/testing';
import { RequestRecipeDto } from './models/request-recipe.dto';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

describe('RecipesController', () => {
  let controller: RecipesController;
  let recipesService: jest.Mocked<RecipesService>;

  const mockService = {
    findRecipes: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: RecipesService,
          useValue: mockService,
        },
      ],
      controllers: [RecipesController],
    }).compile();

    controller = module.get<RecipesController>(RecipesController);
    recipesService = module.get(RecipesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(recipesService).toBeDefined();
  });

  it('should return a recipe list', async () => {
    const result = {
      keywords: ['onions'],
      recipes: [
        {
          title: 'Creamy Scrambled Eggs Recipe Recipe',
          ingredients: ['onions'],
          link:
            'http://www.grouprecipes.com/43522/creamy-scrambled-eggs-recipe.html',
          gif:
            'https://media0.giphy.com/media/Aj9EHGocwb4bu/giphy.gif?cid=f9bbde787fy08jf1dkkoh2m3d2svwcjfwtu3nem6ybb8p6c6&rid=giphy.gif',
        },
      ],
    };

    jest
      .spyOn(recipesService, 'findRecipes')
      .mockImplementation(async () => result);

    const ingredients: RequestRecipeDto = { i: 'onions,tomato' };
    const recipes = await controller.findRecipes(ingredients);

    expect(recipes).toBe(result);
  });
});
