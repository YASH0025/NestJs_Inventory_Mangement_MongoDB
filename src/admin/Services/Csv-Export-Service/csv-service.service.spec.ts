import { Test, TestingModule } from '@nestjs/testing';
import { CsvServiceService } from './csv-service.service';

describe('CsvServiceService', () => {
  let service: CsvServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsvServiceService],
    }).compile();

    service = module.get<CsvServiceService>(CsvServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
