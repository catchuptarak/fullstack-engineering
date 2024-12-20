import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async addProduct(
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number,
  ) {
    const product = await this.productsService.insertProduct(
      prodTitle,
      prodDesc,
      prodPrice,
    );
    return { product };
  }

  @Get()
  async getAllProducts() {
    const products =  await this.productsService.getProducts();
    return { products };
  }

  @Get(':id')
  async getProduct(@Param('id') prodId: string) {
    const product = await this.productsService.getSingleProduct(prodId);
    return {product}
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') prodId: string,
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number,
  ) {
    const product =  await this.productsService.updateProduct(prodId, prodTitle, prodDesc, prodPrice);
    return {product};
  }

  @Delete(':id')
  async removeProduct(@Param('id') prodId: string) {
      const product = await this.productsService.deleteProduct(prodId);
      return {product};
  }
}
