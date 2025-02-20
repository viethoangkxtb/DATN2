import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateUserDto, RegisterUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {InjectModel} from '@nestjs/mongoose';
import {User, UserDocument} from './schemas/user.schema';
import mongoose from 'mongoose';
import {compareSync, genSaltSync, hashSync} from 'bcryptjs';
import {SoftDeleteModel} from 'soft-delete-plugin-mongoose';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.getHashPassword(createUserDto.password);

    let user = await this.userModel.create({
      email: createUserDto.email,
      password: hashPassword,
      name: createUserDto.name,
    });

    return user;
  }

  async register(user: RegisterUserDto) {
    const {name, email, password, age, gender, address} = user;

    const isExit = await this.userModel.findOne({email})

    if (isExit) {
      throw new BadRequestException(`Email: ${email} already exists. Please use another email`)
    }

    const hashPassword = this.getHashPassword(password);

    let newRegister = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role: 'USER',
    });

    return newRegister;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `User not found`;
    }

    return this.userModel.findOne({
      _id: id,
    });
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username,
    });
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      {_id: updateUserDto._id},
      {...updateUserDto},
    );
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `User not found`;
    }

    return this.userModel.softDelete({
      _id: id,
    });
  }
}
