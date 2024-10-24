import {
  IsDefined,
  IsString,
  IsOptional,
  IsNotEmpty,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Type } from 'class-transformer';
import { type Quote, type OnrampSwapRequest } from '@bitsacco/common';

@ValidatorConstraint({ name: 'isStringifiedNumber', async: false })
class IsStringifiedNumberConstraint implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const num = Number(text);
    return !isNaN(num) && num >= 0;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Amount must be a valid non-negative number encoded as a string';
  }
}

export class CreateOnrampSwapDto implements OnrampSwapRequest {
  @IsOptional()
  quote: Quote;

  @IsDefined()
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
