import { IsString, IsOptional, IsNotEmpty, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import {
  type Quote,
  type OnrampSwapRequest,
  IsStringifiedNumberConstraint,
} from '@bitsacco/common';

export class CreateOnrampSwapDto implements OnrampSwapRequest {
  @IsOptional()
  quote: Quote;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  ref: string;

  @IsNotEmpty()
  @IsString()
  @Validate(IsStringifiedNumberConstraint)
  @Type(() => String)
  amount: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  lightning: string;
}
