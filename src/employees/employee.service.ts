import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { EmployeeRepository } from './employee.repository';

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger(EmployeeService.name);

  constructor(
    @Inject(EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async findAllEmployees(): Promise<Employee[]> {
    const employee = await this.employeeRepository.findAllEmployees();

    if (!employee.length) {
      throw new NotFoundException(`ups Employees not found`);
      this.logger.warn(`employees not found`);
    }
    return employee;
  }

  async findById(id: string): Promise<Employee> {
    const Employees = await this.employeeRepository.findById(id);

    if (!Employees) {
      throw new NotFoundException(`ups Employees not found`);
      this.logger.warn(`employees not found`);
    }
    return Employees;
  }

  createEmployees(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    return this.employeeRepository.createEmployees(createEmployeeDto);
  }

  async updateEmployees(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const Employees = await this.employeeRepository.findById(id);

    if (!Employees) {
      throw new NotFoundException(`ups Employees not found`);
      this.logger.warn(`employees not found`);
    }
    return this.employeeRepository.updateEmployees(id, updateEmployeeDto);
  }

  async removeEmployees(id: string) {
    const Employees = await this.employeeRepository.findById(id);

    if (!Employees) {
      throw new NotFoundException(`ups Employees not found`);
      this.logger.warn(`employees not found`);
    }
    return this.employeeRepository.removeEmployees(id);
  }
}
