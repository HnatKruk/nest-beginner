import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: 'email@gmail.com', description: 'Email' })
  @IsString({ message: 'Should be string' })
  @IsEmail({}, { message: 'Invalid email' })
  readonly email: string;

  @ApiProperty({ example: '123456', description: 'Password' })
  @IsString({ message: 'Should be string' })
  @Length(4, 16, { message: 'Should be more than 4 and less than 16' })
  readonly password: string;
}