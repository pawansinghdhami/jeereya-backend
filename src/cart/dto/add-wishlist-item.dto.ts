import { IsInt, IsPositive } from "class-validator";

export class AddWishlistItemDto {
    @IsInt()
    @IsPositive()
    product_id_num!: number;
}