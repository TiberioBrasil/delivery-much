import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import createMockInstance from 'jest-create-mock-instance';
import { ApiServicesService } from './api-services.service';
import { Observable } from 'rxjs';

describe('ApiServicesService', () => {
  let service: ApiServicesService;
  let httpService: jest.Mocked<HttpService>;

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

  const fakeDataBadException = {
    status: 400,
    message: 'Erro ao tentar selecionar dados da API.',
  };

  beforeEach(async () => {
    httpService = createMockInstance(HttpService);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiServicesService,
        {
          provide: HttpService,
          useValue: httpService,
        },
      ],
    }).compile();

    service = module.get<ApiServicesService>(ApiServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHttpResponse()', () => {
    it('should be defined', () => {
      expect(service.getHttpResponse).toBeDefined();
    });

    it('should return a valid result', async () => {
      httpService.get.mockImplementationOnce((url) => {
        return new Observable((subscribe) => {
          try {
            expect(url).toBe('http://');
          } catch (err) {
            subscribe.error(err);
          }
          subscribe.next({
            config: {},
            request: {},
            data: fakeDataReturn,
            headers: { 'Content-Type': 'application/json' },
            status: 200,
            statusText: 'OK',
          });
          subscribe.complete();
        });
      });

      const result = await service.getHttpResponse('http://');

      expect(result).toBeDefined();
    });

    it('should return a badrequest', async () => {
      httpService.get.mockImplementationOnce((url) => {
        return new Observable((subscribe) => {
          try {
            expect(url).toBe('http://');
          } catch (err) {
            subscribe.error(err);
          }
          subscribe.next({
            config: {},
            request: {},
            data: fakeDataBadException,
            headers: { 'Content-Type': 'application/json' },
            status: 400,
            statusText: 'BadRequestException',
          });
          subscribe.complete();
        });
      });

      const result = await service.getHttpResponse('http://');

      expect(result.status).toBe(400);
      expect(result.message).toBe('Erro ao tentar selecionar dados da API.');
    });
  });
});
