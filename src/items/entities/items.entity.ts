import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Purchase } from '../../purchases/entities/purchase.entity';
import { Supplier } from '../../supplier/entities/supplier.entity';
import { Sale } from '../../sales/entities/sale.entity';
import { Category } from './category.entity';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id: string;

  @Column()
  brand: string;

  @Column()
  capital_price: number;

  @Column()
  wholescale_price: number;

  @Column()
  stock: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP()" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP()", onUpdate: "CURRENT_TIMESTAMP()" })
  public updated_at: Date;

  @Column({nullable: true})
  create_by: string;

  @Column({nullable: true})
  update_by: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.items, { lazy: true })
  supplier: Promise<Supplier>;

  @ManyToOne(() => Sale, (sale) => sale.items, { lazy: true })
  sale: Promise<Sale>;

  @ManyToMany(() => Category, (category) => category.items)
  @JoinTable({ name: 'items_categories' })
  categories: Promise<Category[]>;

  @ManyToMany(() => Purchase, (purchases) => purchases.items)
  @JoinTable({ name: 'purchase_items' })
  purchases: Promise<Purchase[]>;
}
