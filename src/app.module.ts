import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { UserModule } from './controllers/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { StripeService } from './admin/Services/Strive-Service/stripe.service';
import { StudentModule } from './student/student.module';
import { FileUploadController } from './file-upload/file-upload.controller';
import { FileUploadService } from './file-upload/file-upload.service';
import { FileUploadModule } from './file-upload/file-upload.module';
import { CsvServiceService } from './admin/Services/Csv-Export-Service/csv-service.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/Users'),
    UserModule,
    AdminModule,
    StudentModule,
    FileUploadModule,
  ],
  controllers: [AppController, FileUploadController],
  providers: [AppService, FileUploadService,],
})
export class AppModule {}
