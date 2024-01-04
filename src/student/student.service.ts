import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from 'src/Models/User-Models/Student.model';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async calculateAverageMarks(): Promise<any[]> {
    return this.studentModel.aggregate([
      {
        $project: {
          name: 1,
          averageMarks: {
            $avg: ['$marks.math', '$marks.science', '$marks.history'],
          },
        },
      },
    ]);
  }

  async calculateTotalAndPercentage(): Promise<any[]> {
    return this.studentModel.aggregate([
      {
        $project: {
          name: 1,
          totalMarks: {
            $sum: ['$marks.math', '$marks.science', '$marks.history'],
          },
          percentage: {
            $avg: ['$marks.math', '$marks.science', '$marks.history'],
          },
        },
      },
    ]);
  }

  async findStudentsWithHighestTotalMarks(limit: number): Promise<any[]> {
    return this.studentModel.aggregate([
      {
        $project: {
          name: 1,
          totalMarks: {
            $sum: ['$marks.math', '$marks.science', '$marks.history'],
          },
        },
      },
      {
        $sort: { totalMarks: -1 },
      },
      {
        $limit: limit,
      },
    ]);
  }

  async findStudentsWithLowAttendance(threshold: number): Promise<any[]> {
    try {
      console.log('Threshold:', threshold);

      const result = await this.studentModel.aggregate([
        {
          $match: {
            'attendance.attended_classes': { $lt: threshold },
          },
        },
        {
          $project: {
            name: 1,
            attendance: '$attendance.attended_classes',
          },
        },
      ]);

      console.log('Result:', result);
      return result;
    } catch (error) {
      console.error('Error in findStudentsWithLowAttendance:', error);
      throw error;
    }
  }
}
