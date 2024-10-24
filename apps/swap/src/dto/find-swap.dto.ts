import { IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { type FindSwapRequest } from '@bitsacco/common';

export class FindSwapDto implements FindSwapRequest {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  id: string;
}
