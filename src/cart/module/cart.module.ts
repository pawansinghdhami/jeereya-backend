import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItems } from '../entities/cart-items.entity';
import { CartService } from '../service/cart.service';
import { WishListItems } from '../entities/wishlist-items.entity';
import { CartController } from '../controller/cart.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CartItems, WishListItems])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
