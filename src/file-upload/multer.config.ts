// multer.config.ts
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const originalname = file.originalname.replace(/\s/g, '_'); 
      const userProvidedName = req.body.filename || originalname; 
      
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
        
      const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}-${currentDate
        .getMinutes()
        .toString()
        .padStart(2, '0')}-${currentDate.getSeconds().toString().padStart(2, '0')}`;

      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      
      const finalFilename = `${userProvidedName}_${formattedDate}_${formattedTime}_${randomName}${extname(originalname)}`;
      callback(null, finalFilename);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error('Only JPG, JPEG, and PNG files are allowed!'), false);
    }
    if (file.size > 5 * 1024 * 1024) {
      return callback(new Error('File size should be less than 5 MB!'), false);
    }
    callback(null, true);
  },
};
