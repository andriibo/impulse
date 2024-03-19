import { MigrationInterface, QueryRunner } from "typeorm";

export class AccessTokenTable1710853809204 implements MigrationInterface {
    name = 'AccessTokenTable1710853809204'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "access_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "client_id" uuid NOT NULL, "user_id" uuid, "scopes" text, "revoked" boolean NOT NULL DEFAULT false, "expires_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f20f028607b2603deabd8182d12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "access_token" ADD CONSTRAINT "FK_4549266652ed0c13cef6c419cff" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "access_token" DROP CONSTRAINT "FK_4549266652ed0c13cef6c419cff"`);
        await queryRunner.query(`DROP TABLE "access_token"`);
    }

}
