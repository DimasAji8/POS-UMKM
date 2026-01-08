import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin' })
  @IsString({ message: 'Username harus berupa teks' })
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  username: string;

  @ApiProperty({ example: 'admin123' })
  @IsString({ message: 'Kata sandi harus berupa teks' })
  @IsNotEmpty({ message: 'Kata sandi tidak boleh kosong' })
  kataSandi: string;
}

export class UbahKataSandiDto {
  @ApiProperty()
  @IsString({ message: 'Kata sandi saat ini harus berupa teks' })
  @IsNotEmpty({ message: 'Kata sandi saat ini tidak boleh kosong' })
  kataSandiSaatIni: string;

  @ApiProperty()
  @IsString({ message: 'Kata sandi baru harus berupa teks' })
  @IsNotEmpty({ message: 'Kata sandi baru tidak boleh kosong' })
  kataSandiBaru: string;
}
