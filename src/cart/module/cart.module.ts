import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItems } from '../entities/cart-items.entity';
import { WishListItems } from '../entities/wishlist-items.entity';
import { CartService } from '../service/cart.service';
import { CartController } from '../controller/cart.controller';
import { ProductVariants } from '../../products/entities/product-variants.entity';
import { UserSession } from '../../users/entities/user-session.entity';
import { SessionAuthGuard } from '../../auth/guards/session-auth.guard';
import { Products } from '../../products/entities/products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CartItems,
      WishListItems,
      ProductVariants,
      UserSession,
      Products,
    ]),
  ],
  controllers: [CartController],
  providers: [CartService, SessionAuthGuard],
})
export class CartModule {}
