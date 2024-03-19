import { MigrationInterface, QueryRunner } from "typeorm";

export class ClientTable1710853628496 implements MigrationInterface {
    name = 'ClientTable1710853628496'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "client" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "secret" character varying(500) NOT NULL, "grants" text NOT NULL DEFAULT 'client_credentials,refresh_token', "scopes" text NOT NULL, "access_token_lifetime" integer NOT NULL DEFAULT '3600', "refresh_token_lifetime" integer NOT NULL DEFAULT '7200', "private_key" text NOT NULL, "public_key" text NOT NULL, "cert" text NOT NULL, "cert_expires_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_8318df9ecda039deac9868adf19" UNIQUE ("secret"), CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "client"`);
    }

}
