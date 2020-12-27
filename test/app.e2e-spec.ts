import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return a BadRequestException (error 400) if no ingredient is passed', () => {
    return request(app.getHttpServer()).get('/recipes?i=').expect(400);
  });

  it('should return a BadRequestException (error 400) if more than 3 ingredients is passed', () => {
    return request(app.getHttpServer()).get('/recipes?i=1,2,3,4').expect(400);
  });

  it('should return a list of recipes if 1, 2 or 3 ingredients are passed', () => {
    return request(app.getHttpServer())
      .get('/recipes?i=onion,tomato')
      .expect(200);
  });
});
