import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItems } from '../entities/cart-items.entity';
import { WishListItems } from '../entities/wishlist-items.entity';
import { Products } from '../../products/entities/products.entity';
import { ProductVariants } from '../../products/entities/product-variants.entity';
import { Repository } from 'typeorm';
import { AddCartItemDto } from '../dto/add-cart-item.dto';
import { AddWishlistItemDto } from '../dto/add-wishlist-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItems)
    private readonly cartRepository: Repository<CartItems>,
    @InjectRepository(ProductVariants)
    private readonly variantRepository: Repository<ProductVariants>,
    @InjectRepository(WishListItems)
    private readonly wishlistRepository: Repository<WishListItems>,
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
  ) {}

  async addItem(userIdNum: number, dto: AddCartItemDto) {
    const variant = await this.variantRepository.findOne({
      where: {
        product_variant_id_num: dto.product_variant_id_num,
        product_variant_is_active: true,
      },
    });
    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }

    const existingItem = await this.cartRepository.findOne({
      where: {
        user: { user_id_num: userIdNum },
        productVariant: {
          product_variant_id_num: dto.product_variant_id_num,
        },
      },
    });

    const totalQuantity =
      (existingItem?.cart_items_quantity ?? 0) + dto.quantity;

    if (totalQuantity > variant.product_variant_stock_quantity) {
      throw new BadRequestException(
        `Only ${variant.product_variant_stock_quantity} item(s) available`,
      );
    }

    if (existingItem) {
      existingItem.cart_items_quantity = totalQuantity;
      return this.cartRepository.save(existingItem);
    }

    try {
      return await this.cartRepository.save(
        this.cartRepository.create({
          user: { user_id_num: userIdNum },
          productVariant: variant,
          cart_items_quantity: dto.quantity,
        }),
      );
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === '23505') {
        throw new ConflictException('This variant is already in your cart');
      }
      throw error;
    }
  }

  async getWishlist(userIdNum: number) {
    return this.wishlistRepository.find({
      where: { user: { user_id_num: userIdNum } },
      relations: {
        product: {
          category: true,
          images: true,
        },
      },
    });
  }

  async addWishlistItem(userIdNum: number, dto: AddWishlistItemDto) {
    const product = await this.productRepository.findOne({
        where: {
            product_id_num: dto.product_id_num,
            is_product_active: true,
        },
    });

    if(!product) {
        throw new NotFoundException('Product not found');
    }

    const existing = await this.wishlistRepository.findOne({
        where: {
            user: {user_id_num: userIdNum},
            product: {product_id_num: dto.product_id_num},
        },
    });

    if(existing) {
        return existing;
    }

    return this.wishlistRepository.save(
        this.wishlistRepository.create({
            user: {user_id_num: userIdNum},
            product,
        }),
    );
  }

  async removeWishlistItem(userIdNum: number, productIdNum: number) {
    const result = await this.wishlistRepository.delete({
        user: {user_id_num: userIdNum},
        product: {product_id_num: productIdNum},
    });

    if(!result.affected) {
        throw new NotFoundException('Wishlist item not found');
    }
  }
}
