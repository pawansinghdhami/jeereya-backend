import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from '../entities/products.entity';
import { ProductVariants } from '../entities/product-variants.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
    @InjectRepository(ProductVariants)
    private readonly variantRepository: Repository<ProductVariants>,
  ) {}

  async findAll() {
    const products = await this.productRepository.find({
      where: { is_product_active: true },
      relations: {
        category: true,
        images: true,
      },
      order: {
        row_created_dtm: 'DESC',
      },
    });

    return products.map((product) => this.toListResponse(product));
  }

  async findBySlug(productSlug: string) {
    const product = await this.productRepository.findOne({
      where: {
        product_slug: productSlug,
        is_product_active: true,
      },
      relations: {
        category: true,
        images: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const variants = await this.variantRepository.find({
      where: {
        product: { product_id_num: product.product_id_num },
        product_variant_is_active: true,
      },
      order: {
        product_variant_stock_quantity: 'DESC',
      },
    });

    return {
      ...this.toListResponse(product),
      product_description: product.product_description,
      product_brand_name: product.product_brand_name,
      images: product.images
        .sort(
          (first, second) =>
            first.product_image_display_order -
            second.product_image_display_order,
        )
        .map((image) => ({
          product_image_id_num: image.product_image_id_num,
          product_image_url: image.product_image_url,
          product_image_alt_text: image.product_image_alt_text,
          product_image_display_order: image.product_image_display_order,
          is_primary_product_image: image.is_primary_product_image,
        })),
      variants: variants.map((variant) => ({
        product_variant_id_num: variant.product_variant_id_num,
        product_variant_sku: variant.product_variant_sku,
        product_variant_size_label: variant.product_variant_size_label,
        product_variant_color_name: variant.product_variant_color_name,
        product_variant_stock_quantity: variant.product_variant_stock_quantity,
        product_variant_is_active: variant.product_variant_is_active,
      })),
    };
  }

  private toListResponse(product: Products) {
    const primaryImage =
      product.images.find((image) => image.is_primary_product_image) ??
      product.images
        .slice()
        .sort(
          (first, second) =>
            first.product_image_display_order -
            second.product_image_display_order,
        )[0];

    return {
      product_id_num: product.product_id_num,
      product_name: product.product_name,
      product_slug: product.product_slug,
      product_mrp_price: product.product_mrp_price,
      product_selling_price: product.product_selling_price,
      category: {
        product_category_id_num: product.category.product_category_id_num,
        product_category_name: product.category.product_category_name,
        product_category_slug: product.category.product_category_slug,
      },
      primary_image: primaryImage
        ? {
            product_image_url: primaryImage.product_image_url,
            product_image_alt_text: primaryImage.product_image_alt_text,
          }
        : null,
    };
  }
}
