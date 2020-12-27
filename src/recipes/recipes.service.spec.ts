import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import createMockInstance from 'jest-create-mock-instance';
import { Observable } from 'rxjs';
import { ApiServicesService } from '../api-services/api-services.service';
import { RequestRecipeDto } from './models/request-recipe.dto';
import { RecipesService } from './recipes.service';

const mockApiServicesService = () => ({
  getHttpResponse: jest.fn(),
});

describe('RecipesService', () => {
  let service: RecipesService;
  let apiServicesService: jest.Mocked<ApiServicesService>;

  const fakeDataReturn = {
    keywords: ['onion', 'tomato'],
    recipes: [
      {
        title: 'Dehydrating Tomatoes',
        ingredients: ['tomato'],
        link: 'http://www.recipezaar.com/Dehydrating-Tomatoes-325795',
        gif:
          'https://media4.giphy.com/media/75yk3rYrClLyM/giphy.gif?cid=f9bbde78a7gjxitx51u1da0u39rnftooa0pai06wcg5m82ph&rid=giphy.gif',
      },
    ],
  };

  beforeEach(async () => {
    apiServicesService = createMockInstance(ApiServicesService);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        { provide: ApiServicesService, useFactory: mockApiServicesService },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(apiServicesService).toBeDefined();
  });

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

  it('should return a value if one ingredient is passed', async () => {
    try {
      const mock = apiServicesService.getHttpResponse.mockImplementationOnce(
        async () => {
          return fakeDataReturn;
        },
      );
      console.log(mock);

      const ingredients: RequestRecipeDto = { i: 'onion,tomato' };
      await service.findRecipes(ingredients);
    } catch (e) {
      expect(e.status).toBe(400);
      expect(e.message).toBe('Você deve informar de 1 a 3 ingredientes!');
    }
  });

  // it('should return a value if 2 or 3 ingredients are passed', async () => {
  //   const ingredients: RequestRecipeDto = { i: 'onion,tomato' };
  //   const result = await service.findRecipes(ingredients);
  //   console.log(result);
  // });
});
