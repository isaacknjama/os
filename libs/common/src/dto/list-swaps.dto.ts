import { IsNumber, Min } from 'class-validator';
import { PaginatedRequest } from '@bitsacco/common';
import { ApiProperty } from '@nestjs/swagger';

export class ListSwapsDto implements PaginatedRequest {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  page: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  size: number;
}
