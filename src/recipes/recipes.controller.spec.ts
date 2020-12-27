import { Test, TestingModule } from '@nestjs/testing';
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

  // it('should return a recipe list', async () => {
  //   mockService.findRecipes.mockReturnValue(mockRecipesResponse);

  //   const recipes = await se

  // });
});
