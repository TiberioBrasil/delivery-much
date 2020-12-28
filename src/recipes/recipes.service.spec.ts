import { Test, TestingModule } from '@nestjs/testing';
import createMockInstance from 'jest-create-mock-instance';
import { ApiServicesService } from '../api-services/api-services.service';
import { RequestRecipeDto } from './models/request-recipe.dto';
import { RecipesService } from './recipes.service';

const mockApiServicesService = {
  getHttpResponse: jest.fn(),
};

describe('RecipesService', () => {
  let service: RecipesService;
  let apiServicesService: jest.Mocked<ApiServicesService>;

  beforeEach(async () => {
    apiServicesService = createMockInstance(ApiServicesService);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        { provide: ApiServicesService, useValue: mockApiServicesService },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(apiServicesService).toBeDefined();
  });

  describe('findRecipes()', () => {
    it('should return a BadRequestException (error 400) if no ingredient is passed', async () => {
      try {
        const ingredients: RequestRecipeDto = { i: '' };
        await service.findRecipes(ingredients);
      } catch (e) {
        expect(e.status).toBe(400);
        expect(e.message).toBe('Você deve informar de 1 a 3 ingredientes!');
      }
    });

    it('should return a BadRequestException (error 400) if more than 3 ingredients is passed', async () => {
      try {
        const ingredients: RequestRecipeDto = { i: '1,2,3,4' };
        await service.findRecipes(ingredients);
      } catch (e) {
        expect(e.status).toBe(400);
        expect(e.message).toBe('Você deve informar de 1 a 3 ingredientes!');
      }
    });

    it('should return a list os recipes if 1 ingredient is passed', async () => {
      const recipePuppyAPI = [
        {
          title: 'Monterey Turkey Omelet',
          href:
            'http://allrecipes.com/Recipe/Monterey-Turkey-Omelet/Detail.aspx',
          ingredients: 'onions',
          thumbnail: 'http://img.recipepuppy.com/5506.jpg',
        },
      ];

      const giphAPI = {
        title: 'Monterey Turkey Omelet',
        ingredients: ['onions'],
        link: 'http://allrecipes.com/Recipe/Monterey-Turkey-Omelet/Detail.aspx',
        gif:
          'https://media0.giphy.com/media/Aj9EHGocwb4bu/giphy.gif?cid=f9bbde787fy08jf1dkkoh2m3d2svwcjfwtu3nem6ybb8p6c6&rid=giphy.gif',
      };

      const result = {
        keywords: ['onions'],
        recipes: [
          {
            title: 'Monterey Turkey Omelet',
            ingredients: ['onions'],
            link:
              'http://allrecipes.com/Recipe/Monterey-Turkey-Omelet/Detail.aspx',
            gif:
              'https://media0.giphy.com/media/Aj9EHGocwb4bu/giphy.gif?cid=f9bbde787fy08jf1dkkoh2m3d2svwcjfwtu3nem6ybb8p6c6&rid=giphy.gif',
          },
        ],
      };

      jest
        .spyOn(service, 'getRecipes')
        .mockImplementation(async () => recipePuppyAPI);

      jest.spyOn(service, 'getGiphy').mockImplementation(async () => giphAPI);

      const ingredients: RequestRecipeDto = { i: 'onions' };
      const recipes = await service.findRecipes(ingredients);

      expect(recipes).toEqual(result);
    });

    it('should return a list os recipes if 2 or 3 ingredients are passed', async () => {
      const recipePuppyAPI = [
        {
          title: 'Monterey Turkey Omelet',
          href:
            'http://allrecipes.com/Recipe/Monterey-Turkey-Omelet/Detail.aspx',
          ingredients: 'onions,tomato',
          thumbnail: 'http://img.recipepuppy.com/5506.jpg',
        },
      ];

      const giphAPI = {
        title: 'Monterey Turkey Omelet',
        ingredients: ['onions', 'tomato'],
        link: 'http://allrecipes.com/Recipe/Monterey-Turkey-Omelet/Detail.aspx',
        gif:
          'https://media0.giphy.com/media/Aj9EHGocwb4bu/giphy.gif?cid=f9bbde787fy08jf1dkkoh2m3d2svwcjfwtu3nem6ybb8p6c6&rid=giphy.gif',
      };

      const result = {
        keywords: ['onions', 'tomato'],
        recipes: [
          {
            title: 'Monterey Turkey Omelet',
            ingredients: ['onions', 'tomato'],
            link:
              'http://allrecipes.com/Recipe/Monterey-Turkey-Omelet/Detail.aspx',
            gif:
              'https://media0.giphy.com/media/Aj9EHGocwb4bu/giphy.gif?cid=f9bbde787fy08jf1dkkoh2m3d2svwcjfwtu3nem6ybb8p6c6&rid=giphy.gif',
          },
        ],
      };

      jest
        .spyOn(service, 'getRecipes')
        .mockImplementation(async () => recipePuppyAPI);

      jest.spyOn(service, 'getGiphy').mockImplementation(async () => giphAPI);

      const ingredients: RequestRecipeDto = { i: 'onions,tomato' };
      const recipes = await service.findRecipes(ingredients);

      expect(recipes).toEqual(result);
    });
  });

  describe('getRecipes()', () => {
    it('should return a list from Recipe Puppy API', async () => {
      const recipePuppyAPI = {
        title: 'Recipe Puppy',
        version: 0.1,
        href: 'http://www.recipepuppy.com/',
        results: [
          {
            title: 'Monterey Turkey Omelet',
            href:
              'http://allrecipes.com/Recipe/Monterey-Turkey-Omelet/Detail.aspx',
            ingredients:
              'butter, eggs, garlic, green pepper, monterey jack cheese, onions, turkey, water',
            thumbnail: 'http://img.recipepuppy.com/5506.jpg',
          },
        ],
      };

      mockApiServicesService.getHttpResponse.mockReturnValue(recipePuppyAPI);

      const recipesList = await service.getRecipes('http://');

      expect(recipesList).toEqual(recipePuppyAPI.results);
    });

    it('should return a BadRequestException if the Recipe Puppy API if offline', async () => {
      try {
        mockApiServicesService.getHttpResponse.mockReturnValue(null);

        await service.getRecipes('http://');
      } catch (e) {
        expect(e.status).toBe(400);
      }
    });
  });

  describe('getGiphy()', () => {
    it('should return a gif from Giphy API', async () => {
      const giphyAPI = {
        data: [
          {
            images: {
              original: {
                url:
                  'https://media4.giphy.com/media/1xpDEk9birm8jCZv1p/giphy.gif?cid=f9bbde782e90o3z8ove3ozbsbyidujfagvj4qduc8zez7tei&rid=giphy.gif',
              },
            },
          },
        ],
      };

      const recipe = {
        title: 'Creamy Scrambled Eggs Recipe Recipe',
        href:
          'http://www.grouprecipes.com/43522/creamy-scrambled-eggs-recipe.html',
        ingredients: 'onions',
        thumbnail: 'http://img.recipepuppy.com/373064.jpg',
      };

      const giphyResult = {
        title: 'Creamy Scrambled Eggs Recipe Recipe',
        ingredients: ['onions'],
        link:
          'http://www.grouprecipes.com/43522/creamy-scrambled-eggs-recipe.html',
        gif:
          'https://media4.giphy.com/media/1xpDEk9birm8jCZv1p/giphy.gif?cid=f9bbde782e90o3z8ove3ozbsbyidujfagvj4qduc8zez7tei&rid=giphy.gif',
      };

      mockApiServicesService.getHttpResponse.mockReturnValue(giphyAPI);

      const recipeGiphy = await service.getGiphy(recipe);

      expect(recipeGiphy).toEqual(giphyResult);
    });

    it('should return a BadRequestException if the Giphy API if offline', async () => {
      const giphyAPI = null;

      const recipe = {
        title: 'Creamy Scrambled Eggs Recipe Recipe',
        href:
          'http://www.grouprecipes.com/43522/creamy-scrambled-eggs-recipe.html',
        ingredients: 'onions',
        thumbnail: 'http://img.recipepuppy.com/373064.jpg',
      };

      const giphyResult = {
        title: 'Creamy Scrambled Eggs Recipe Recipe',
        ingredients: ['onions'],
        link:
          'http://www.grouprecipes.com/43522/creamy-scrambled-eggs-recipe.html',
        gif: 'Erro ao seconectar à API do Giphy!',
      };

      mockApiServicesService.getHttpResponse.mockReturnValue(giphyAPI);

      const recipeGiphy = await service.getGiphy(recipe);

      expect(recipeGiphy).toEqual(giphyResult);
    });

    it('should return a gif not found if the Giphy doenst return any gif', async () => {
      const giphyAPI = {
        data: [
          {
            images: {
              original: {
                url: '',
              },
            },
          },
        ],
      };

      const recipe = {
        title: 'Creamy Scrambled Eggs Recipe Recipe',
        href:
          'http://www.grouprecipes.com/43522/creamy-scrambled-eggs-recipe.html',
        ingredients: 'onions',
        thumbnail: 'http://img.recipepuppy.com/373064.jpg',
      };

      const giphyResult = {
        title: 'Creamy Scrambled Eggs Recipe Recipe',
        ingredients: ['onions'],
        link:
          'http://www.grouprecipes.com/43522/creamy-scrambled-eggs-recipe.html',
        gif: 'Giphy não encontrado!',
      };

      mockApiServicesService.getHttpResponse.mockReturnValue(giphyAPI);

      const recipeGiphy = await service.getGiphy(recipe);

      expect(recipeGiphy).toEqual(giphyResult);
    });
  });
});
