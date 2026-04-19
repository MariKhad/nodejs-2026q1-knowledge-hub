import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,           
      forbidNonWhitelisted: false,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Knowledge Hub API')
    .setDescription('REST API for Knowledge Hub platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Users', 'User management endpoints')
    .addTag('Articles', 'Article management endpoints')
    .addTag('Categories', 'Category management endpoints')
    .addTag('Comments', 'Comment management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document); // документация доступна на /doc

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/doc`);
}

bootstrap();