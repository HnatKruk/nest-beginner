import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ValidationPipe } from "./pipes/validation.pipe"

async function start() {
  const PORT = process.env.PORT || 4000
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Advanced Backend')
    .setDescription('Documentation REST API')
    .setVersion('1.0.0')
    .addTag('Taras Hnatkiv')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api/docs', app, document)

  // @UsePipes(ValidationPipe)
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
}

start()