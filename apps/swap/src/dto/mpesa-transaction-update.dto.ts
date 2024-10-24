import {
  IsEnum,
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import {
  MpesaTractactionState,
  type MpesaTransactionUpdate,
} from '../intasend/intasend.types';

export class MpesaTransactionUpdateDto implements MpesaTransactionUpdate {
  @IsNotEmpty()
  @IsString()
  invoice_id: string;

  @IsEnum(MpesaTractactionState)
  state: MpesaTractactionState;

  @IsString()
  charges: string;

  @IsNotEmpty()
  @IsString()
  net_amount: string;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsString()
  account: string;

  @IsNotEmpty()
  @IsString()
  api_ref: string;

  @IsNumber()
  retry_count: number;

  @IsDateString()
  created_at: string;

  @IsDateString()
  updated_at: string;

  @IsOptional()
  @IsString()
  failed_reason: string | null;

  @IsOptional()
  @IsString()
  failed_code: string | null;

  @IsNotEmpty()
  @IsString()
  challenge: string;
}
