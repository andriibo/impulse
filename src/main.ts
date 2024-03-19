import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'fatal', 'error'],
  });

  const config = new DocumentBuilder()
      .setTitle('Impulse API')
      .setDescription('Impulse API description')
      .addServer(process.env.APP_URL)
      .setVersion('1.0')
      .addOAuth2({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      })
      .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Impulse API',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.enableCors();
  app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
  );

  await app.listen(3000);

  process.on('unhandledRejection', (error) => {
    console.log(error);
  });
}
bootstrap();
