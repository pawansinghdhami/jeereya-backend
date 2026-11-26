import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Post,
  Req,
  UseGuards,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { SessionAuthGuard } from '../../auth/guards/session-auth.guard';
import type { AuthenticatedRequest } from '../../auth/guards/session-auth.guard';
import { AddCartItemDto } from '../dto/add-cart-item.dto';
import { CartService } from '../service/cart.service';
import { request } from 'http';
import { AddWishlistItemDto } from '../dto/add-wishlist-item.dto';

@Controller('cart')
@UseGuards(SessionAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('items')
  @HttpCode(HttpStatus.OK)
  addItem(@Req() request: AuthenticatedRequest, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(request.authUser.user_id_num, dto);
  }

  @Get('wishlist')
  getWishlist(@Req() request: AuthenticatedRequest) {
    return this.cartService.getWishlist(request.authUser.user_id_num);
  }

  @Post('wishlist/items')
  addWishlistItem(
    @Req() request: AuthenticatedRequest,
    @Body() dto: AddWishlistItemDto,
  ) {
    return this.cartService.addWishlistItem(request.authUser.user_id_num, dto);
  }

  @Delete('wishlist/items/:productIdNum')
  removeWishlistItem(
    @Req() request: AuthenticatedRequest,
    @Param('productIdNum', ParseIntPipe) productIdNum: number,
  ) {
    return this.cartService.removeWishlistItem(
      request.authUser.user_id_num,
      productIdNum,
    );
  }
}
