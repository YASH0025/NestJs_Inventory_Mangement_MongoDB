/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Post,
  Headers,
  Res,
  UseGuards,
  ValidationPipe,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/Models/User-Models/user.model';
import { CreateUserDto } from 'src/Dto/create-user.dto';
import { UserProfileDto } from 'src/Dto/update-user.dto';

import { Response } from 'express'; // Import the Response type from express
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { OrderService } from './Services/Order-Service/order.service';
import { OrderProductDto } from 'src/Dto/order-product.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly orderService: OrderService,
  ) {}
  // @Get()
  // getAllUsers(): Promise<User[]> {
  //   return this.userService.findAllUser();
  // }
  // @Get('single')
  // getSingleUser(@Body()  body: { id: number }): Promise<User> {
  //   const { id } = body;
  //   return this.userService.findSingleUser(id)
  // }
  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.userService.login(email, password);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string): Promise<any> {
    return await this.userService.generateResetToken(email);
  }

  @Post('reset-password')
  @UseGuards(AuthGuard)
  async resetPassword(
    @Headers('authorization') token: string,
    @Body('newPassword') newPassword: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const result = await this.userService.resetPassword(token, newPassword);
      res.status(200).json({ message: 'Password reset successfully', result });
    } catch (error) {
      res
        .status(400)
        .json({ message: `Error resetting password: ${error.message}` });
    }
  }
  @Post('order-product')
  async orderProduct(
    @Body(ValidationPipe) orderDto: OrderProductDto,
    @Headers('authorization') authorizationHeader: string,
  ) {
    return this.orderService.orderProduct(orderDto, authorizationHeader);
  }
  @Patch('update-profile')
  async updateProfile(
    @Headers('authorization') authorizationHeader: string,
    @Body() userData: UserProfileDto,
  ) {
    try {
      const updateUser = await this.userService.updateUserProfile(
        authorizationHeader,
        userData,
      );

      return updateUser
        ? { message: 'Profile Updated Successfully' }
        : { message: 'Profile could not be updated' };
    } catch (error) {
      this.handleControllerError(
        error,
        'Error processing the update profile request',
      );
    }
  }

  private handleControllerError(
    error: any,
    message: string = 'Internal Server Error',
  ) {
    console.error('Error processing the request:', error);
    throw { error: message };
  }

  // @Post('login')
  // async login(@Body('email') email: string, @Body('password') password: string): Promise<{ accessToken: string }> {
  //   const accessToken = await this.userService.login(email, password);

  //   return { accessToken };
  // }
  // @Put()
  // updateUser(@Body() body: { id: number, updateUserDto: CreateUserDto }): Promise<[number, User[]]> {
  //   const { id, updateUserDto } = body;
  //   return this.userService.updateUser(id, updateUserDto);
  // }
  // @Delete()
  // deleteUser(@Body() body : {id : number}): Promise<void>{
  //   const {id}=body;
  //   return this.userService.deleteUser(id)

  // }
}
