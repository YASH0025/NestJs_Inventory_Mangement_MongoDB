/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Headers,
  Res,
  HttpStatus,
  UseGuards,
  Delete,
  NotFoundException,
  InternalServerErrorException,
  Query,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { CreateProductDto } from 'src/Dto/create-product.dto';
import { CategoryService } from './Services/Category-Service/category.service';
import { ProductService } from './Services/Product-Service/product.service';
import { FilteredProductsDto } from 'src/Dto/filtered-product.dto';
import { RemoveProductsDto } from 'src/Dto/remove-category.dto';
import { ProductsFilterDto } from 'src/Dto/serch-filter.dto';
import { StripeService } from './Services/Strive-Service/stripe.service';
import { User } from 'src/Models/User-Models/user.model';
import { Student, StudentDocument } from 'src/Models/User-Models/Student.model';
import { CsvServiceService } from './Services/Csv-Export-Service/csv-service.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
    private readonly stripeService: StripeService,
    @InjectModel(Student.name) private readonly studentModel: Model<StudentDocument>,
    private readonly csvService: CsvServiceService,

  ) {} // Inject your service

  @Post('category')
  @UseGuards(AuthGuard)
  async createCategory(
    @Body('name') name: string,
    @Headers('authorization') authorizationHeader: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const newCategory = await this.categoryService.createCategory(
        name,
        authorizationHeader,
      );
      res.status(HttpStatus.CREATED).json({
        message: 'Category created successfully',
        category: newCategory,
      });
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error' });
    }
  }

  @Post('product')
  @UseGuards(AuthGuard)
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Headers('authorization') authorizationHeader: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const newProduct = await this.productService.createProduct(
        createProductDto,
        authorizationHeader,
      );

      res.status(HttpStatus.CREATED).json({
        message: 'Product created successfully',
        product: newProduct,
      });
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error' });
    }
  }

  @Post('product/remove')
  removeProduct(@Body('productId') productId: string) {
    return this.productService.removeProduct(productId);
  }
  //
  @Post('filtered')
  async getFilteredProducts(
    @Body('categoryId') categoryId: string,
  ): Promise<User> {
    return this.productService.getFilteredProducts(categoryId);
    // const allProducts = await this.productService.getFilteredProducts(dto.categoryId);
    // res.status(HttpStatus.OK).json(allProducts);
  }

  @Delete('category/remove')
  async removeProducts(
    @Body() dto: RemoveProductsDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.categoryService.removeProducts(dto.category);
      res.json({
        message: 'Category and associated products deleted successfully',
      });
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error' });
    }
  }

  @Get('filters')
  async getProductsByFilters(@Query() filters: ProductsFilterDto) {
    try {
      const filteredProducts =
        await this.productService.getProductsByFilters(filters);

      return {
        success: true,
        data: filteredProducts,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          success: false,
          message: 'No products found with the given filters',
        };
      } else if (error instanceof InternalServerErrorException) {
        return {
          success: false,
          error: 'Internal Server Error',
        };
      } else {
        throw error;
      }
    }
  }

  @Post('create-payment')
  async createPaymentIntent(
    @Body() body: { amount: number; currency: string; customerId: string },
  ) {
    const { amount, currency, customerId } = body;
    const paymentIntent = await this.stripeService.createPaymentIntent(
      amount,
      currency,
      customerId,
    );

    return { clientSecret: paymentIntent.client_secret };
  }
  @Get('export')
  async exportStudentsCsv() {
    try {
      const students = await this.studentModel.find().exec();
      const filePath = './students-export.csv';

      await this.csvService
      .exportStudentsToCsv(students, filePath);

      return { message: 'Students exported to CSV successfully', filePath };
    } catch (error) {
      return { error: 'Failed to export students to CSV', details: error.message };
    }
  }
}
