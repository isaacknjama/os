import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

export class SendSTKPushDto {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  amount: number;

  @NormalizePhoneNumber()
  @IsString()
  @Length(12, 12)
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  api_ref: string;
}

function NormalizePhoneNumber() {
  return Transform((params) => {
    const { value } = params;
    if (typeof value !== 'string') {
      return value;
    }

    let normalized = value.replace(/\D/g, '');

    if (normalized.length === 9) {
      normalized = '254' + normalized;
    } else if (normalized.startsWith('0')) {
      normalized = '254' + normalized.slice(1);
    } else if (!normalized.startsWith('254')) {
      normalized = '254' + normalized;
    }

    if (normalized.length !== 12) {
      throw new Error('Invalid phone number format');
    }

    return normalized;
  });
}
