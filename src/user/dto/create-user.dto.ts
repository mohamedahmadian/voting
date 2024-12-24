import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    description: 'The username of user',
    example: 'a sample username',
    type: String,
  })
  username: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    description: 'The password of user',
    example: 'password',
    type: String,
  })
  password: string;

  @IsString()
  @ApiProperty({
    description: 'The name of user',
    example: 'a sample name',
    type: String,
  })
  name: string;
}
