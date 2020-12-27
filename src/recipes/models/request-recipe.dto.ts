import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestRecipeDto {
  @ApiProperty({
    description:
      'String containing ingredients to search at RecipePuppy website. Ingredients should be separated by comma. Min 1 - Max 3.',
    format: 'ingredient1, ingretient2?,ingretient3?',
    minimum: 1,
    maximum: 3,
    example: 'onion,tomato',
  })
  @IsString()
  readonly i: string;
}
