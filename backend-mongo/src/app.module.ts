import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
require('dotenv').config();

console.log('process.env.MONGODB_URL', process.env.MONGODB_URL);

@Module({
  imports: [ProductsModule,MongooseModule.forRoot(process.env.MONGODB_URL),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
