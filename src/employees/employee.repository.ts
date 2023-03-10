import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { PaginationEmployeeDto } from './dto/pagination-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { EmployeeResponse } from './types/employee-response.type';

@Injectable()
export class EmployeeRepository {
  private repository: Repository<Employee>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Employee);
  }

  async findAllEmployees(
    paginationDto: PaginationEmployeeDto,
  ): Promise<EmployeeResponse> {
    const queryBuilder = this.repository.createQueryBuilder('employee');
    if (paginationDto.keywords) {
      queryBuilder.andWhere(new Brackets(qb => {
        qb.where('employee.name ILIKE :keyword', { keyword: `%${paginationDto.keywords}%` })
          .orWhere('employee.address ILIKE :keyword', { keyword: `%${paginationDto.keywords}%` })
          .orWhere('employee.phone_number ILIKE :keyword', { keyword: `%${paginationDto.keywords}%` })
          .orWhere('employee.entry_date::text ILIKE :keyword', { keyword: `%${paginationDto.keywords}%` })
          .orWhere('employee.exit_date::text ILIKE :keyword', { keyword: `%${paginationDto.keywords}%` })
          .orWhere('employee.total_saving::text ILIKE :keyword', { keyword: `%${paginationDto.keywords}%` });
      }));
    }
    queryBuilder.orderBy(`employee.${paginationDto.orderBy}`, paginationDto.orderType)
    .skip((paginationDto.page - 1) * paginationDto.limit)
    .take(paginationDto.limit);
    const [data, total] = await queryBuilder.getManyAndCount();
    return {
      data,
      total,
    };
  }

  findById(id: string): Promise<Employee> {
    return this.repository.findOne({
      where: { id },
    });
  }

  createEmployees(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    return this.repository.save(createEmployeeDto);
  }

  async updateEmployees(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    await this.repository.update(id, updateEmployeeDto);
    return {
      message: 'Update Empolyee Success',
    };
  }

  async removeEmployees(id: string) {
    await this.repository.delete(id);
    return {
      message: 'Delete Employee Success',
    };
  }
}
