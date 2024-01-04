import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { User, UserSchema } from 'src/Models/User-Models/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/Models/User-Models/role.model';
import { EmailService } from './email.service';
import { Order, OrderSchema } from 'src/Models/User-Models/order.model';
import { OrderService } from './Services/Order-Service/order.service';
import {
  Inventory,
  InventorySchema,
} from 'src/Models/Admin-Models/inventory.model';
import { StripeService } from 'src/admin/Services/Strive-Service/stripe.service';
import { Student, StudentSchema } from 'src/Models/User-Models/Student.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Inventory.name, schema: InventorySchema },
      { name: Student.name, schema: StudentSchema },

      
    ]),
  ],

  controllers: [UserController],
  providers: [UserService, EmailService, OrderService, StripeService],
  exports: [UserService],
})
export class UserModule {}
