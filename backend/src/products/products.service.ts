import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
 
import { Product } from './product.model';
import  {Model}  from 'mongoose';


@Injectable()
export class ProductsService {
  private products: Product[] = [];

 constructor(@InjectModel('Product') private readonly productSchema:Model<Product>) {
this.products = []; 

 }

 async insertProduct(title: string, desc: string, price: number) {
    
    const newProduct = new this.productSchema({
      title:title,
      description:desc,
      price:price,
    })
   const result = await newProduct.save();
   console.log(result); 
   return result;
  }

  async getProducts() {
    const products = await this.productSchema.find().exec();
    console.log('Fetched products:', products);  // Log the fetched products
    return products;
  }

  async getSingleProduct(productId: string) {
    const product = await this.productSchema.findById(productId).exec();
    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    return { ...product.toObject() };  // Return a copy of the product
  }

  async updateProduct(productId: string, title: string, desc: string, price: number) {
    const updatedProduct = await this.productSchema.findByIdAndUpdate(
      productId,
      { title, description: desc, price },
      { new: true },  // Return the updated product
    ).exec();

    if (!updatedProduct) {
      throw new NotFoundException('Could not find product.');
    }
    return updatedProduct;
  }

  // Delete a product by ID
  async deleteProduct(prodId: string) {
    const deletedProduct = await this.productSchema.findByIdAndRemove(prodId).exec();
    if (!deletedProduct) {
      throw new NotFoundException('Could not find product.');
    }
    return deletedProduct;
  }
  private findProduct(id: string): [Product, number] {
    const productIndex = this.products.findIndex(prod => prod.id === id);
    const product = this.products[productIndex];
    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    return [product, productIndex];
  }
}
