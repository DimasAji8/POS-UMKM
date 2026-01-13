-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'KASIR');

-- CreateEnum
CREATE TYPE "TipePenyesuaian" AS ENUM ('MASUK', 'KELUAR');

-- CreateTable
CREATE TABLE "pengguna" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "hash_kata_sandi" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengguna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produk" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kategori" TEXT,
    "satuan" TEXT,
    "harga" DECIMAL(10,2) NOT NULL,
    "stok" INTEGER NOT NULL DEFAULT 0,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penjualan" (
    "id" TEXT NOT NULL,
    "no_faktur" TEXT NOT NULL,
    "id_kasir" TEXT NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "jumlah_bayar" DECIMAL(10,2) NOT NULL,
    "jumlah_kembalian" DECIMAL(10,2) NOT NULL,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "penjualan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_penjualan" (
    "id" TEXT NOT NULL,
    "id_penjualan" TEXT NOT NULL,
    "id_produk" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama_produk" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "harga" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "item_penjualan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penyesuaian_stok" (
    "id" TEXT NOT NULL,
    "id_produk" TEXT NOT NULL,
    "id_pengguna" TEXT NOT NULL,
    "tipe" "TipePenyesuaian" NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "catatan" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "penyesuaian_stok_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_username_key" ON "pengguna"("username");

-- CreateIndex
CREATE UNIQUE INDEX "produk_kode_key" ON "produk"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "penjualan_no_faktur_key" ON "penjualan"("no_faktur");

-- AddForeignKey
ALTER TABLE "penjualan" ADD CONSTRAINT "penjualan_id_kasir_fkey" FOREIGN KEY ("id_kasir") REFERENCES "pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_penjualan" ADD CONSTRAINT "item_penjualan_id_penjualan_fkey" FOREIGN KEY ("id_penjualan") REFERENCES "penjualan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_penjualan" ADD CONSTRAINT "item_penjualan_id_produk_fkey" FOREIGN KEY ("id_produk") REFERENCES "produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penyesuaian_stok" ADD CONSTRAINT "penyesuaian_stok_id_produk_fkey" FOREIGN KEY ("id_produk") REFERENCES "produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penyesuaian_stok" ADD CONSTRAINT "penyesuaian_stok_id_pengguna_fkey" FOREIGN KEY ("id_pengguna") REFERENCES "pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
