import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/Models/User-Models/user.model';
import { Role, RoleDocument } from 'src/Models/User-Models/role.model';
import * as jwt from 'jsonwebtoken';
import { EmailService } from './email.service';
import { UserProfileDto } from 'src/Dto/update-user.dto';
import { StripeService } from 'src/admin/Services/Strive-Service/stripe.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Role.name) private readonly rolesModel: Model<RoleDocument>,
    private readonly emailService: EmailService,
    private readonly stripeService: StripeService,
  ) {}

  async createUser(userData: any): Promise<UserDocument> {
    try {
      const existingUser = await this.userModel.findOne({
        email: userData.email,
      });
      if (existingUser) {
        throw new ConflictException(
          `User with email ${userData.email} already exists`,
        );
      }

      const salt = 10;
      const hash = bcrypt.hashSync(userData.password, salt);
      const stripeCustomer = await this.stripeService.createCustomer(
        userData.email,
      );

      const roleName = userData.role || 'user';
      const userRole =
        (await this.rolesModel.findOne({ roleName })) ||
        (await this.rolesModel.create({ roleName }));

      const createdUser = new this.userModel({
        ...userData,
        password: hash,
        roleId: userRole._id,
        stripeCustomerId: stripeCustomer.id,
      });

      return createdUser.save();
    } catch (error) {
      throw new ConflictException(`Error creating user: ${error.message}`);
    }
  }
  async login(
    email: string,
    password: string,
  ): Promise<{ user: UserDocument; token: string }> {
    try {
      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = jwt.sign(
        { email: email, userId: user._id },
        'secerate-key',
      );

      return { user, token };
    } catch (error) {
      throw new UnauthorizedException(`Error during login: ${error.message}`);
    }
  }

  async generateResetToken(
    email: string,
  ): Promise<{ message: string; token: string }> {
    try {
      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const resetToken = jwt.sign(
        { userId: user._id, email: email },
        'secerate-key',
        {
          expiresIn: '1h',
        },
      );

      user.resetToken = resetToken;
      await user.save();

      await this.emailService.sendResetPasswordEmail(email, resetToken);

      return { message: 'Reset token sent successfully', token: resetToken };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      }

      console.error('Error generating reset token:', error);

      throw new InternalServerErrorException('Error generating reset token');
    }
  }
  async resetPassword(token: string, newPassword: string): Promise<any> {
    try {
      if (!newPassword) {
        throw new BadRequestException('New password is required');
      }

      const tokenParts = token.split(' ');

      if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        throw new BadRequestException('Invalid token format');
      }

      const decodedToken: any = jwt.verify(tokenParts[1], 'secerate-key');
      console.log(decodedToken);

      const user = await this.userModel.findById(decodedToken.userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const saltRounds = 10;
      const hash = await bcrypt.hash(newPassword, saltRounds);
      user.password = hash;

      user.resetToken = undefined;
      await user.save();
      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new BadRequestException(
        `Error resetting password: ${error.message}`,
      );
    }
  }
  async updateUserProfile(
    authorizationHeader: string,
    userData: UserProfileDto,
  ): Promise<User | null> {
    try {
      const { userId } = this.getTokenDataFromHeader(authorizationHeader);

      const updateUser = await this.userModel.findByIdAndUpdate(
        userId,
        { $set: userData },
        {
          new: true,
        },
      );
      return updateUser;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
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
