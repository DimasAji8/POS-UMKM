import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
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
}

export class UpdateStatusPenggunaDto {
  @IsOptional()
  aktif?: boolean;
}
