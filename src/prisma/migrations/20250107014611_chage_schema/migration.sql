-- CreateEnum
CREATE TYPE "estado_orden" AS ENUM ('PENDIENTE', 'PAGADO', 'CANCELADO', 'ENVIADO');

-- CreateEnum
CREATE TYPE "estado_producto" AS ENUM ('ACTIVO', 'INACTIVO', 'DESCONTINUADO');

-- CreateEnum
CREATE TYPE "tipo_descuento" AS ENUM ('PORCENTAJE', 'MONTO_FIJO');

-- CreateTable
CREATE TABLE "ROLES" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ROLES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USUARIOS" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "hashed_password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "activo" BOOLEAN DEFAULT true,
    "rol_id" INTEGER,
    "direccion" TEXT,
    "telefono" VARCHAR(20),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "USUARIOS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CATEGORIAS" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CATEGORIAS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PRODUCTOS" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL,
    "estado" "estado_producto" DEFAULT 'ACTIVO',
    "foto_url" VARCHAR(255),
    "sku" VARCHAR(50),
    "categoria_id" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PRODUCTOS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PAQUETES" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "duracion_horas" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PAQUETES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DETALLE_PAQUETES" (
    "id" SERIAL NOT NULL,
    "paquete_id" INTEGER,
    "producto_id" INTEGER,
    "cantidad" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DETALLE_PAQUETES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ORDENES" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "paquete_id" INTEGER NOT NULL,
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "descuento_total" DECIMAL(10,2) DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "estado" VARCHAR(20) DEFAULT 'PENDIENTE',
    "direccion_envio" TEXT NOT NULL,
    "metodo_pago" VARCHAR(50) DEFAULT 'WEBPAY',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ORDENES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DETALLE_ORDEN" (
    "id" SERIAL NOT NULL,
    "orden_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "descuento" DECIMAL(10,2) DEFAULT 0,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DETALLE_ORDEN_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DESCUENTOS" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "monto_minimo" DECIMAL(10,2),
    "uso_maximo" INTEGER,
    "usos_actuales" INTEGER DEFAULT 0,
    "fecha_inicio" TIMESTAMP(6),
    "fecha_fin" TIMESTAMP(6),
    "activo" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DESCUENTOS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ORDEN_DESCUENTOS" (
    "id" SERIAL NOT NULL,
    "orden_id" INTEGER NOT NULL,
    "descuento_id" INTEGER NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "monto_aplicado" DECIMAL(10,2),
    "fecha_aplicacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ORDEN_DESCUENTOS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TRANSBANK" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "session_id" VARCHAR(100) NOT NULL,
    "token" VARCHAR(100) NOT NULL,
    "id_compras" INTEGER NOT NULL,
    "response_code" VARCHAR(5),
    "authorization_code" VARCHAR(10),
    "payment_type_code" VARCHAR(5),
    "installments_number" INTEGER,
    "installments_amount" DECIMAL(10,2),
    "card_number" VARCHAR(20),
    "total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "TRANSBANK_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ROLES_nombre_key" ON "ROLES"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "USUARIOS_username_key" ON "USUARIOS"("username");

-- CreateIndex
CREATE UNIQUE INDEX "USUARIOS_email_key" ON "USUARIOS"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CATEGORIAS_nombre_key" ON "CATEGORIAS"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "PRODUCTOS_sku_key" ON "PRODUCTOS"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "PAQUETES_nombre_key" ON "PAQUETES"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "DESCUENTOS_codigo_key" ON "DESCUENTOS"("codigo");

-- AddForeignKey
ALTER TABLE "USUARIOS" ADD CONSTRAINT "USUARIOS_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "ROLES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PRODUCTOS" ADD CONSTRAINT "PRODUCTOS_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "CATEGORIAS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DETALLE_PAQUETES" ADD CONSTRAINT "DETALLE_PAQUETES_paquete_id_fkey" FOREIGN KEY ("paquete_id") REFERENCES "PAQUETES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DETALLE_PAQUETES" ADD CONSTRAINT "DETALLE_PAQUETES_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "PRODUCTOS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ORDENES" ADD CONSTRAINT "ORDENES_paquete_id_fkey" FOREIGN KEY ("paquete_id") REFERENCES "PAQUETES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ORDENES" ADD CONSTRAINT "ORDENES_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "USUARIOS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DETALLE_ORDEN" ADD CONSTRAINT "DETALLE_ORDEN_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "ORDENES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DETALLE_ORDEN" ADD CONSTRAINT "DETALLE_ORDEN_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "PRODUCTOS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ORDEN_DESCUENTOS" ADD CONSTRAINT "ORDEN_DESCUENTOS_descuento_id_fkey" FOREIGN KEY ("descuento_id") REFERENCES "DESCUENTOS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ORDEN_DESCUENTOS" ADD CONSTRAINT "ORDEN_DESCUENTOS_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "ORDENES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TRANSBANK" ADD CONSTRAINT "TRANSBANK_id_compras_fkey" FOREIGN KEY ("id_compras") REFERENCES "ORDENES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
