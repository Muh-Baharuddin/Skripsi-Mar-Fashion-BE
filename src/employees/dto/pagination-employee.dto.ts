import { OmitType } from '@nestjs/mapped-types';
import { IsIn, IsOptional } from 'class-validator';
import { PaginationSupplierDto } from '../../supplier/dto/pagination-supplier.dto';

export class PaginationEmployeeDto extends OmitType(PaginationSupplierDto, [
    'orderBy'
  ] as const) {
  @IsOptional()
  @IsIn(['name', 'address', 'phone_number', 'entry_date', 'exit_date', 'total_saving'])
  readonly orderBy?: 'name' | 'address' | 'phone_number' | 'entry_date' | 'exit_date' | 'total_saving' = 'name';
}
