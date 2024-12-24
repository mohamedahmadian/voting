import { MigrationInterface, QueryRunner } from 'typeorm';

export class $FOR1735056192810 implements MigrationInterface {
  name = ' $FOR1735056192810';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "vote" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "pollId" integer, "optionId" integer, CONSTRAINT "PK_2d5932d46afe39c8176f9d4be72" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "poll" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "creatorId" integer, CONSTRAINT "PK_03b5cf19a7f562b231c3458527e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "option" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "pollId" integer, CONSTRAINT "PK_e6090c1c6ad8962eea97abdbe63" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "vote" ADD CONSTRAINT "FK_f5de237a438d298031d11a57c3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vote" ADD CONSTRAINT "FK_3827d62f3c37dc8a63a13c4d0da" FOREIGN KEY ("pollId") REFERENCES "poll"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vote" ADD CONSTRAINT "FK_4ae2eb8e398ff87416da92ea286" FOREIGN KEY ("optionId") REFERENCES "option"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "poll" ADD CONSTRAINT "FK_e02de455e2a350b108cb922d3eb" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "option" ADD CONSTRAINT "FK_d710400e48b60236cd8be3e2502" FOREIGN KEY ("pollId") REFERENCES "poll"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "option" DROP CONSTRAINT "FK_d710400e48b60236cd8be3e2502"`,
    );
    await queryRunner.query(
      `ALTER TABLE "poll" DROP CONSTRAINT "FK_e02de455e2a350b108cb922d3eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vote" DROP CONSTRAINT "FK_4ae2eb8e398ff87416da92ea286"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vote" DROP CONSTRAINT "FK_3827d62f3c37dc8a63a13c4d0da"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vote" DROP CONSTRAINT "FK_f5de237a438d298031d11a57c3b"`,
    );
    await queryRunner.query(`DROP TABLE "option"`);
    await queryRunner.query(`DROP TABLE "poll"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "vote"`);
  }
}
