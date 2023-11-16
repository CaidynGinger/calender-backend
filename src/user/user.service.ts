import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser)
  }

  async findAll() {
    return await this.userRepository.find()
  }

  async findByUsername(username: string) {
    return await this.userRepository.find({ where: { username: username } });
  }

  async findByEmail(email: string) {
    return await this.userRepository.find({ where: { email: email } });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id: id },
      select: ['events'],
      relations: ['events'], });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return await this.userRepository.delete(id);
  }
}
