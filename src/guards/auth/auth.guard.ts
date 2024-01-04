import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/Models/User-Models/user.model';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const newToken = req.headers.authorization;
    const [, token] = newToken.split(' ');

    try {
      const decodedToken: any = jwt.verify(token, 'secerate-key');

      const existingUser = await this.userModel
        .findOne({ email: decodedToken.email })
        .populate('roleId', 'roleName');

      if (!existingUser) {
        return false;
      }

      const isAdmin = existingUser.roleId['roleName'] === 'admin';

      if (!isAdmin) {
        res.status(403).json({ message: 'you are not admin' });
      }

      return isAdmin;
    } catch (error) {
      console.error('JWT verification error:', error);
      return false;
    }
  }
}
