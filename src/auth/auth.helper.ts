import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersRepository } from 'src/users/users.repository';
import { LoginResponse } from './types/login-response.type';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthHelper {
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  // Encode User's password
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  // Validate User's password
  public isPasswordValid(password: string, hashPassword: string): boolean {
    const validatePass = bcrypt.compareSync(password, hashPassword);
    return validatePass;
  }

  public generateToken({ id, userName, role }: User): LoginResponse {
    const user = { id, userName, role };
    const accessToken = this.jwtService.sign(user);
    return {
      accessToken,
    };
  }

  // Decoding the JWT Token
  public async decode(token: string): Promise<unknown> {
    return this.jwtService.decode(token, null);
  }

  // Get User by User ID we get from decode()
  public async validateUser(decoded: any): Promise<User> {
    return await this.usersRepository.getUserById(decoded.id);
  }

  // Validate JWT Token, throw forbidden error if JWT Token is invalid
  public async validate(token: string): Promise<boolean> {
    const decoded = this.jwtService.verify(token);

    if (!decoded) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const user: User = await this.validateUser(decoded);

    if (!user) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
