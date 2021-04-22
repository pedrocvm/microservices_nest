import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    try {
      const allUsers = await this.userRepository.find();
      allUsers.forEach((user) => delete user.password);

      return allUsers;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      delete user.password;
      
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(data: CreateUserDto): Promise<UserEntity> {
    try {
      const user = this.userRepository.create(data);
      return this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(data: UpdateUserDto): Promise<UserEntity> {
    try {
      const user = await this.findById(data.id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return this.userRepository.save({ ...user, ...data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const user = await this.findById(id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userRepository.delete(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
