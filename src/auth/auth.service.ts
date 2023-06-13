import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bycrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    // Hash password

    const salt = await bycrypt.genSalt();

    const hashedPassword = await bycrypt.hash(password, salt);

    //console.log('salt', salt);
    //console.log('hashedPassword', hashedPassword);

    const user = this.authRepository.create({
      username,
      password: hashedPassword,
    });
    try {
      await this.authRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        //duplicate record
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async login(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.authRepository.findOneBy({ username: username });
    if (user && (await bycrypt.compare(password, user.password))) {
      //Create an access token with jwt.
      const payload: JwtPayload = { username };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
