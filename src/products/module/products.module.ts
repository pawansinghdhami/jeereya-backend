import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from '../entities/products.entity';
import { ProductCategories } from '../entities/product-categories.entity';
import { ProductVariants } from '../entities/product-variants.entity';
import { ProductController } from '../controller/products.controller';
import { ProductService } from '../service/products.service';
import { ProductImages } from '../entities/product-images.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Products,
      ProductCategories,
      ProductVariants,
      ProductImages,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductsModule {}
