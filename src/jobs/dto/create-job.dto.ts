import {Type} from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}

export class CreateJobDto {
  @IsNotEmpty({message: 'Name is required'})
  name: string;

  @IsNotEmpty({message: 'Skills is required'})
  skills: string[];

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;

  @IsNotEmpty({message: 'Location is required'})
  location: string;

  @IsNotEmpty({message: 'Salary is required'})
  salary: number;

  @IsNotEmpty({message: 'Quantity is required'})
  quantity: number;

  @IsNotEmpty({message: 'Level is required'})
  level: string;

  @IsNotEmpty({message: 'Description is required'})
  description: string;

  @IsNotEmpty({message: 'StartDate is required'})
  startDate: Date;

  @IsNotEmpty({message: 'EndDate is required'})
  endDate: Date;

  @IsNotEmpty({message: 'IsActive is required'})
  isActive: boolean;
}
