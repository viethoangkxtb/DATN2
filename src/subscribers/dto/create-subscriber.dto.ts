import {IsArray, IsEmail, IsNotEmpty, IsString} from 'class-validator';

export class CreateSubscriberDto {
  @IsNotEmpty({message: 'Name is required'})
  name: string;

  @IsNotEmpty({message: 'Email is required'})
  @IsEmail()
  email: string;

  @IsNotEmpty({message: 'Skills are required'})
  @IsArray()
  @IsString({each: true, message: 'Each skill is a string'})
  skills: string[];
}
