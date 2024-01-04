// order.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Inventory,
  InventoryDocument,
} from 'src/Models/Admin-Models/inventory.model';
import { Order } from 'src/Models/User-Models/order.model';
import * as jwt from 'jsonwebtoken';

class OrderProductDto {
  productId: string;
  quantity: number;
}

// Assuming your Order model looks something like this:
// class Order {
//   productId: string;
//   userId: string;
//   quantity: number;
// }

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Inventory.name)
    private readonly inventoryModel: Model<InventoryDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}
  private getTokenDataFromHeader(authorizationHeader: string): {
    email: string;
    userId: string;
  } {
    const token = authorizationHeader?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Authorization token not provided');
    }

    try {
      const decodedToken: any = jwt.verify(token, 'secerate-key');
      return { email: decodedToken.email, userId: decodedToken.userId };
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  async orderProduct(
    orderDto: OrderProductDto,
    authorizationHeader: string,
  ): Promise<Order> {
    const { productId, quantity } = orderDto;

    try {
      const { userId } = this.getTokenDataFromHeader(authorizationHeader);
      const inventory = await this.inventoryModel.findOne({ productId });

      if (!inventory) {
        throw new NotFoundException(
          'Inventory not found for the specified product',
        );
      }

      if (inventory.quantity < quantity) {
        throw new BadRequestException(
          'Insufficient quantity in the inventory.',
        );
      }

      inventory.quantity -= quantity;
      await inventory.save();

      const newOrder = new this.orderModel({
        productId,
        userId,
        quantity,
      });

      return await newOrder.save();
    } catch (error) {
      console.log('Error at ordering a Product', error);
      throw new BadRequestException('Server Error');
    }
  }
}
