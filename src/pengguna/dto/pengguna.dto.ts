import { IsString, IsNotEmpty, IsEnum, IsOptional, IsEmail } from 'class-validator';
import { Role } from '@prisma/client';

export class CreatePenggunaDto {
  @IsString({ message: 'Nama harus berupa teks' })
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  nama: string;

  @IsString({ message: 'Username harus berupa teks' })
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  username: string;

  @IsString({ message: 'Kata sandi harus berupa teks' })
  @IsNotEmpty({ message: 'Kata sandi tidak boleh kosong' })
  kataSandi: string;

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
  @IsOptional()
  aktif?: boolean;
}
