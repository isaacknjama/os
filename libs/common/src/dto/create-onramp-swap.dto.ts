import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNotEmpty, Validate } from 'class-validator';
import {
  OnrampSwapRequest,
  Quote,
  IsStringifiedNumberConstraint,
} from '../types';
import { ApiProperty } from '@nestjs/swagger';

class QuoteDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  refreshIfExpired: boolean;
}

export class CreateOnrampSwapDto implements OnrampSwapRequest {
  @IsOptional()
  @ApiProperty({ type: QuoteDto })
  quote: QuoteDto;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @ApiProperty()
  ref: string;

  @IsNotEmpty()
  @IsString()
  @Validate(IsStringifiedNumberConstraint)
  @Type(() => String)
  @ApiProperty()
  amount: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @ApiProperty()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @ApiProperty()
  lightning: string;
}
