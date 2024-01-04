/* eslint-disable prettier/prettier */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Category,
  CategoryDocument,
} from 'src/Models/Admin-Models/category.model';
import { User, UserDocument } from 'src/Models/User-Models/user.model';
import * as jwt from 'jsonwebtoken';
import {
  Inventory,
  InventoryDocument,
} from 'src/Models/Admin-Models/inventory.model';
import {
  Product,
  ProductDocument,
} from 'src/Models/Admin-Models/product.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Inventory.name)
    private readonly inventoryModel: Model<InventoryDocument>,
  ) {}

  async createCategory(
    name: string,
    authorizationHeader: string,
  ): Promise<CategoryDocument> {
    try {
      const { email, userId } =
        this.getTokenDataFromHeader(authorizationHeader);

      if (!name || !email || !userId) {
        throw new Error('Name, email, and userId are required fields');
      }

      const existingCategory = await this.categoryModel.findOne({ name });
      if (existingCategory) {
        throw new ConflictException(
          'Category with the same name already exists',
        );
      }

      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const newCategory = new this.categoryModel({ name, createdBy: user._id });
      await newCategory.save();

      return newCategory;
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
  }

  async removeProducts(category: string): Promise<void> {
    if (!category) {
      throw new NotFoundException('Category is required in the request body');
    }

    const products = await this.productModel.find({ category });

    for (const product of products) {
      await this.inventoryModel.deleteMany({ productId: product._id });
    }

    await this.productModel.deleteMany({ category });

    const deletedCategory =
      await this.categoryModel.findByIdAndDelete(category);

    if (!deletedCategory) {
      throw new NotFoundException('Category not found');
    }
  }
  private getTokenDataFromHeader(authorizationHeader: string): {
    email: string;
    userId: string;
  } {
    const token = authorizationHeader?.replace('Bearer ', '');

    if (!token) {
      throw new Error('Authorization token not provided');
    }

    try {
      const decodedToken: any = jwt.verify(token, 'secerate-key');
      return { email: decodedToken.email, userId: decodedToken.userId };
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error('Invalid token');
    }
  }
}
