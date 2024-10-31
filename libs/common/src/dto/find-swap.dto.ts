import { Type } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';
import { type FindSwapRequest } from '@bitsacco/common';
import { ApiProperty } from '@nestjs/swagger';

export class FindSwapDto implements FindSwapRequest {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @ApiProperty()
  id: string;
}
