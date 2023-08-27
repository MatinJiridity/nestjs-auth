import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ATGuard } from './common/guards';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // const reflector = new Reflector() tow way to guard this way or in module providers
  // app.useGlobalGuards(new ATGuard(reflector)) // every route has at guard except @Public()
  await app.listen(3000);
}
bootstrap();
