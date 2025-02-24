import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateUserDto, RegisterUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {InjectModel} from '@nestjs/mongoose';
import {User as UserM, UserDocument} from './schemas/user.schema';
import mongoose from 'mongoose';
import {compareSync, genSaltSync, hashSync} from 'bcryptjs';
import {SoftDeleteModel} from 'soft-delete-plugin-mongoose';
import {IUser} from './user.interface';
import {User} from 'src/decorator/customize';
import aqp from 'api-query-params';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name)
    private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  async create(createUserDto: CreateUserDto, @User() user: IUser) {
    const {name, email, password, age, gender, address, role, company} =
      createUserDto;

    const isExit = await this.userModel.findOne({email});

    if (isExit) {
      throw new BadRequestException(
        `Email: ${email} already exists. Please use another email`,
      );
    }
    const hashPassword = this.getHashPassword(password);

    let newCreateUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role,
      company,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return newCreateUser;
  }

  async register(registerUserDto: RegisterUserDto) {
    const {name, email, password, age, gender, address} = registerUserDto;

    const isExit = await this.userModel.findOne({email});

    if (isExit) {
      throw new BadRequestException(
        `Email: ${email} already exists. Please use another email`,
      );
    }

    const hashPassword = this.getHashPassword(password);

    let newRegisterUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role: 'USER',
    });

    return newRegisterUser;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const {filter, sort, population} = aqp(qs);
    delete filter.page;
    delete filter.limit;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('-password')
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return `User not found`;

    return await this.userModel
      .findOne({
        _id: id,
      })
      .select('-password'); //exclude >< include
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username,
    });
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    const updated = await this.userModel.updateOne(
      {_id: updateUserDto._id},
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return updated;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return `User not found`;

    await this.userModel.updateOne(
      {_id: id},
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.userModel.softDelete({
      _id: id,
    });
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({_id}, {refreshToken});
  };
}
