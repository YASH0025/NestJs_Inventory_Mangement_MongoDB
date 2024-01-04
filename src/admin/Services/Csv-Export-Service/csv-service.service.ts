import { Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { Student } from 'src/Models/User-Models/Student.model';
import * as fastCsv from 'fast-csv';

@Injectable()
export class CsvServiceService {
  async exportStudentsToCsv(
    students: Student[],
    filePath: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const csvStream = fastCsv.format({ headers: true });

      const writableStream = createWriteStream(filePath);

      csvStream
        .pipe(writableStream)
        .on('finish', () => resolve())
        .on('error', (error) => reject(error));

      students.forEach((student) => {
        const csvRow = {
          'Student ID': student.student_id,
          Name: student.name,
          'Math Marks': student.marks.math,
          'Science Marks': student.marks.science,
          'History Marks': student.marks.history,
          Grade: student.grade,
          'Total Classes': student.attendance.total_classes,
          'Attended Classes': student.attendance.attended_classes,
        };
        csvStream.write(csvRow);
      });

      csvStream.end();
    });
  }
}
