import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { RolesService } from 'src/roles/roles.service';
import { AddRoleDto } from './dto/add-role-dto';
import { BanUserDto } from './dto/ban-user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private rolesService: RolesService
  ) {}
  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto)
    const role = await this.rolesService.getRolesByValue('ADMIN')
    await user.$set('roles', [role.id])
    user.roles = [role]
    return user
  }

  async getUsers() {
    const users = await this.userRepository.findAll({ include: { all: true } })
    return users 
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email }, include: { all: true } })
    return user
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.findByPk(dto.userId)
    const role = await this.rolesService.getRolesByValue(dto.value)

    if (user && role) {
      await user.$add('role', role.id)
      return dto
    }

    throw new HttpException('User or role is not found', HttpStatus.NOT_FOUND)
  }

  async ban(dto: BanUserDto) {
    const user = await this.userRepository.findByPk(dto.userId)

    if (!user) {
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND)
    }

    user.banned = true
    user.banReason = dto.banReason
    await user.save()
    return user
  }
}
