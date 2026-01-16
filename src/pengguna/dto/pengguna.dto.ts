import { IsString, IsNotEmpty, IsEnum, IsOptional, IsEmail, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreatePenggunaDto {
  @ApiProperty({ example: 'John Doe', description: 'Nama lengkap pengguna' })
  @IsString({ message: 'Nama harus berupa teks' })
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  nama: string;

  @ApiProperty({ example: 'johndoe', description: 'Username untuk login (harus unik)' })
  @IsString({ message: 'Username harus berupa teks' })
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  username: string;

  @ApiProperty({ example: 'password123', description: 'Kata sandi pengguna' })
  @IsString({ message: 'Kata sandi harus berupa teks' })
  @IsNotEmpty({ message: 'Kata sandi tidak boleh kosong' })
  kataSandi: string;

  @ApiProperty({ enum: Role, example: 'KASIR', description: 'Role pengguna: ADMIN atau KASIR' })
  @IsEnum(Role, { message: 'Role harus ADMIN atau KASIR' })
  role: Role;

  @IsEmail()
  @IsOptional()
  email?: string;
}

export class UpdatePenggunaDto {
  @IsString()
  @IsOptional()
  nama?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  kataSandi?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsEmail()
  @IsOptional()
  email?: string;
}

export class UpdateStatusPenggunaDto {
  @ApiProperty({ example: false, description: 'Status aktif pengguna' })
  @IsOptional()
  @IsBoolean({ message: 'Aktif harus berupa boolean' })
  aktif?: boolean;
}
