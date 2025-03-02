import {BadRequestException, Injectable} from '@nestjs/common';
import {CreatePermissionDto} from './dto/create-permission.dto';
import {UpdatePermissionDto} from './dto/update-permission.dto';
import {IUser} from 'src/users/user.interface';
import {InjectModel} from '@nestjs/mongoose';
import {Permission, PermissionDocument} from './schemas/permission.schema';
import {SoftDeleteModel} from 'soft-delete-plugin-mongoose';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const {name, apiPath, method, module} = createPermissionDto;

    const isExit = await this.permissionModel.findOne({apiPath, method});

    if (isExit) {
      throw new BadRequestException(
        `Permission with ApiPath=${apiPath} and Method=${method} already exists. Please use another Permission`,
      );
    }

    let newPermission = await this.permissionModel.create({
      name,
      apiPath,
      method,
      module,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: newPermission?._id,
      createdAt: newPermission?.createdAt,
    };
  }

  findAll() {
    return `This action returns all permissions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
