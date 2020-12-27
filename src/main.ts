import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PORT || '3333', 10);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Delivery Much API Challenge')
    .setDescription('Repository created for Delivery Much Challenge')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  if (process.env.NODE_ENV === 'development') {
    console.log(`Server running at: http://localhost:${port}`);
    console.log(`Swagger documentation at: http://localhost:${port}/api`);
  }
}
bootstrap();
