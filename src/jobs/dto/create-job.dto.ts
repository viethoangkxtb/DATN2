import {Transform, Type} from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty({message: 'Company _id is required'})
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({message: 'Company name is required'})
  name: string;

  @IsNotEmpty({message: 'Company logo is required'})
  logo: string;
}

export class CreateJobDto {
  @IsNotEmpty({message: 'Name is required'})
  name: string;

  @IsNotEmpty({message: 'Skills are required'})
  @IsArray({message: 'Skills are an array'})
  @IsString({each: true, message: 'Skill is a string'})
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
  @Transform(({value}) => new Date(value))
  @IsDate()
  startDate: Date;

  @IsNotEmpty({message: 'EndDate is required'})
  @Transform(({value}) => new Date(value))
  @IsDate()
  endDate: Date;

  @IsNotEmpty({message: 'IsActive is required'})
  isActive: boolean;
}
