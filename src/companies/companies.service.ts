import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateCompanyDto} from './dto/create-company.dto';
import {UpdateCompanyDto} from './dto/update-company.dto';
import {Company, CompanyDocument} from './schemas/company.schema';
import {InjectModel} from '@nestjs/mongoose';
import {SoftDeleteModel} from 'soft-delete-plugin-mongoose';
import {IUser} from 'src/users/user.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    const {name} = createCompanyDto;

    const isExit = await this.companyModel.findOne({name});

    if (isExit) {
      throw new BadRequestException(
        `Company with name=${name} already exists. Please use another name`,
      );
    }

    let company = await this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return company;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const {filter, sort, projection, population} = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.companyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.companyModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new BadRequestException(`Not found Company with id = ${id}`);
    }

    return await this.companyModel.findById(id);
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new BadRequestException(`Not found Company with id = ${id}`);
    }

    const {name} = updateCompanyDto;

    const isExit = await this.companyModel.findOne({name});

    if (isExit) {
      throw new BadRequestException(
        `Company with name=${name} already exists. Please use another name`,
      );
    }

    return await this.companyModel.updateOne(
      {_id: id},
      {
        ...updateCompanyDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new BadRequestException(`Not found Company with id = ${id}`);
    }

    await this.companyModel.updateOne(
      {_id: id},
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return this.companyModel.softDelete({_id: id});
  }
}
