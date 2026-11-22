import { Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from '../service/products.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':slug')
  findBySlug(@Param('slug') productSlug: string) {
    return this.productService.findBySlug(productSlug);
  }
}
