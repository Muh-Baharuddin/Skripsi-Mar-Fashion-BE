import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { EmployeeResponse } from './types/employee-response.type';
import { PaginationEmployeeDto } from './dto/pagination-employee.dto';

@Controller('employee')
@UseGuards(JwtAuthGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  findAll(
    @Query(new ValidationPipe({
      transformOptions: {enableImplicitConversion: true},
    })) paginationDto: PaginationEmployeeDto,
  ): Promise<EmployeeResponse>{
    return this.employeeService.findAllEmployees(paginationDto);
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string): Promise<Employee> {
    return this.employeeService.findById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.createEmployees(createEmployeeDto);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.updateEmployees(id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeeService.removeEmployees(id);
  }
}
