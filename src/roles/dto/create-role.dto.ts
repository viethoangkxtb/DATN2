import {IsArray, IsBoolean, IsMongoId, IsNotEmpty} from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty({message: 'Name is required'})
  name: string;

  @IsNotEmpty({message: 'Description is required'})
  description: string;

  @IsNotEmpty({message: 'IsActive is required'})
  @IsBoolean()
  isActive: boolean;

  @IsNotEmpty({message: 'Permissions is required'})
  @IsMongoId({each: true, message: 'Each permissions is a mongo object id'})
  @IsArray({message: 'Permissions is a array'})
  permissions: mongoose.Schema.Types.ObjectId[];
}
