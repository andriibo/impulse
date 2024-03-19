import { MigrationInterface, QueryRunner } from "typeorm";

export class RefreshTokenTable1710853902032 implements MigrationInterface {
    name = 'RefreshTokenTable1710853902032'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "access_token_id" uuid NOT NULL, "revoked" boolean NOT NULL DEFAULT false, "expires_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a32e27d3e974fd0b01c0552d73f" UNIQUE ("access_token_id"), CONSTRAINT "REL_a32e27d3e974fd0b01c0552d73" UNIQUE ("access_token_id"), CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_a32e27d3e974fd0b01c0552d73f" FOREIGN KEY ("access_token_id") REFERENCES "access_token"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_a32e27d3e974fd0b01c0552d73f"`);
        await queryRunner.query(`DROP TABLE "refresh_token"`);
    }

}
