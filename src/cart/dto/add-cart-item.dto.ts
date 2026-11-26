import { IsInt, IsPositive, Min } from 'class-validator';

export class AddCartItemDto {
  @IsInt()
  @IsPositive()
  product_variant_id_num!: number;

  @IsInt()
  @Min(1)
  quantity!: number;
}
