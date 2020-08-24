import { Order } from './order.model';

export interface Table {
    _id?: string;
    name: string;
    number: number;
    orders?: Array<Order>;
  }
  