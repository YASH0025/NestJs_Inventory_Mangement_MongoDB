import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import {
  Category,
  CategorySchema,
} from 'src/Models/Admin-Models/category.model';
import { Product, ProductSchema } from 'src/Models/Admin-Models/product.model';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { User, UserSchema } from 'src/Models/User-Models/user.model';
import {
  Inventory,
  InventorySchema,
} from 'src/Models/Admin-Models/inventory.model';
import { CategoryService } from './Services/Category-Service/category.service';
import { ProductService } from './Services/Product-Service/product.service';
import { StripeService } from './Services/Strive-Service/stripe.service';
import { CsvServiceService } from './Services/Csv-Export-Service/csv-service.service';
import { Student, StudentSchema } from 'src/Models/User-Models/Student.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },

      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
      { name: Inventory.name, schema: InventorySchema },
      { name: Student.name, schema: StudentSchema },

    ]),
    UserModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, CategoryService, ProductService, StripeService,CsvServiceService],
  exports: [CategoryService, StripeService, ],
})
export class AdminModule {}
