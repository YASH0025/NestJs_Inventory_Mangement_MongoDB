import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from 'src/Dto/create-product.dto';
import {
  Category,
  CategoryDocument,
} from 'src/Models/Admin-Models/category.model';
import {
  Inventory,
  InventoryDocument,
} from 'src/Models/Admin-Models/inventory.model';
import {
  Product,
  ProductDocument,
} from 'src/Models/Admin-Models/product.model';
import * as jwt from 'jsonwebtoken';
import { ProductsFilterDto } from 'src/Dto/serch-filter.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Inventory.name)
    private readonly inventoryModel: Model<InventoryDocument>,
  ) {}
  async createProduct(
    createProductDto: CreateProductDto,
    authorizationHeader: string,
  ): Promise<ProductDocument> {
    try {
      const { email, userId } =
        this.getTokenDataFromHeader(authorizationHeader);

      if (!email || !userId) {
        throw new Error('Invalid authorization data');
      }

      const { name, price, categoryId, quantity } = createProductDto;

      if (!name || !price || !categoryId || !quantity) {
        throw new Error('Invalid input data');
      }

      const existingCategory = await this.categoryModel.findById(categoryId);
      if (!existingCategory) {
        throw new NotFoundException('Category not found');
      }

      const newProduct = new this.productModel({
        name,
        price,
        category: categoryId,
      });
      const savedProduct = await newProduct.save();

      const newInventory = new this.inventoryModel({
        quantity,
        productId: savedProduct._id,
      });
      await newInventory.save();

      return savedProduct;
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
  }
  async removeProduct(productId: string): Promise<any> {
    try {
      const existingProduct = await this.productModel.findOne({
        _id: productId,
      });

      if (!existingProduct) {
        throw new NotFoundException(
          `Product with id "${productId}" does not exist`,
        );
      }

      const productsToDelete = await this.productModel.find({ _id: productId });

      for (const product of productsToDelete) {
        await this.inventoryModel.deleteOne({ productId: product._id });
      }

      await this.productModel.deleteMany({ _id: productId });

      return { message: `Products with associated inventory deleted` };
    } catch (error) {
      throw new ConflictException(`Error creating user: ${error.message}`);
    }
  }

  async getFilteredProducts(categoryId: string): Promise<any> {
    try {
      const products = await this.inventoryModel.aggregate([
        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: '_id',
            as: 'product',
          },
        },
        {
          $unwind: '$product',
        },
      ]);

      const filteredProducts = products.filter(
        (product) => product.product['category'] == categoryId,
      );

      return filteredProducts;
    } catch (error) {
      throw new ConflictException(`Error creating user: ${error.message}`);
    }
  }

  async getProductsByFilters(filters: ProductsFilterDto): Promise<Product[]> {
    try {
      const filterConditions: any[] = [];

      if (filters.name) {
        filterConditions.push({
          name: { $regex: new RegExp(filters.name, 'i') },
        });
      }

      if (!isNaN(filters.price) && filters.price > 0) {
        filterConditions.push({ price: { $lte: filters.price } });
      }

      if (filters.quantity) {
        filterConditions.push({ 'inventory.quantity': filters.quantity });
      }

      if (filters.category) {
        filterConditions.push({ 'category.name': filters.category });
      }

      let query: any = {};

      if (filterConditions.length > 0) {
        query = { $and: filterConditions };
      }

      const filteredProducts = await this.productModel
        .find(query)
        .populate('inventory')
        .populate('category')
        .exec();

      console.log('Generated Query:', query);

      if (filteredProducts.length === 0) {
        throw new NotFoundException('No products found with the given filters');
      }

      return filteredProducts;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Internal Server Error');
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
