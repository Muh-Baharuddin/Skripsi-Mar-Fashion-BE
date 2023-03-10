import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { PaginationItemDto } from './dto/pagination-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/items.entity';
import { ItemResponse } from './types/item.response.type';

@Injectable()
export class ItemRepository {
  private repository: Repository<Item>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Item);
  }

  async findAllItems(
    paginationDto: PaginationItemDto,
  ): Promise<ItemResponse> {
    const queryBuilder = this.repository.createQueryBuilder('item')
      .leftJoin('item.categories', 'category')
      .addSelect('category')
      .leftJoin('item.supplier', 'supplier')
      .addSelect('supplier.name')
    if (paginationDto.keywords) {
      queryBuilder.andWhere(new Brackets(qb => {
        qb.where('item.brand ILIKE :keyword', { keyword: `%${paginationDto.keywords}%` })
          .orWhere('item.capital_price::text ILIKE :keyword', { keyword: `%${paginationDto.keywords}%` })
          .orWhere('item.wholescale_price::text ILIKE :keyword', { keyword: `%${paginationDto.keywords}%` })
          .orWhere('item.stock::text ILIKE :keyword', { keyword: `%${paginationDto.keywords}%` });
      }));
    }
    queryBuilder.orderBy(`item.${paginationDto.orderBy}`, paginationDto.orderType)
    .skip((paginationDto.page - 1) * paginationDto.limit)
    .take(paginationDto.limit)
    const [data, total] = await queryBuilder.getManyAndCount();
    return {
      data,
      total,
    };
  }

  findById(id: string): Promise<Item> {
    return this.repository.findOne({
      where: { id },
    });
  }

  createItems(createItemDto: CreateItemDto): Promise<Item> {
    return this.repository.save(createItemDto);
  }

  async updateItems(id: string, updateItemDto: UpdateItemDto) {
    await this.repository.update(id, updateItemDto);
    return {
      message: 'Update Item Success',
    };
  }

  async removeItems(id: string) {
    await this.repository.delete(id);
    return {
      message: 'Delete Item Success',
    };
  }
}
