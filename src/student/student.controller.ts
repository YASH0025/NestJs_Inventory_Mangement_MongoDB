// student.controller.ts
import { Controller, Get, Post, Query } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('average-marks')
  async getAverageMarks(): Promise<any[]> {
    return this.studentService.calculateAverageMarks();
  }

  @Get('percentage')
  async getPercentage(): Promise<any[]> {
    return this.studentService.calculateTotalAndPercentage();
  }

  @Get('highest-total')
  async getStudentsWithHighestTotalMarks(
    @Query('limit') limit: number,
  ): Promise<any[]> {
    return this.studentService.findStudentsWithHighestTotalMarks(
      Number(limit) || 5,
    );
  }

  @Get('low-attendance')
  async getStudentsWithLowAttendance(
    @Query('threshold') threshold: number,
  ): Promise<any[]> {
    return this.studentService.findStudentsWithLowAttendance(
      Number(threshold) || 5,
    );
  }
}
