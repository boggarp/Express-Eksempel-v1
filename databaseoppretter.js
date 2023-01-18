const db = require("better-sqlite3")()

const sql = `

-- Creator:       MySQL Workbench 8.0.31/ExportSQLite Plugin 0.1.0
-- Author:        bgarp
-- Caption:       New Model
-- Project:       Name of the project
-- Changed:       2023-01-18 12:45
-- Created:       2023-01-18 12:39
PRAGMA foreign_keys = OFF;

-- Schema: mydb
ATTACH "mydb.sdb" AS "mydb";
BEGIN;
CREATE TABLE "mydb"."poststed"(
  "postnummer" INTEGER PRIMARY KEY NOT NULL,
  "poststed" VARCHAR(45) NOT NULL
);
CREATE TABLE "mydb"."land"(
  "id" INTEGER PRIMARY KEY NOT NULL,
  "navn" VARCHAR(45) NOT NULL
);
CREATE TABLE "mydb"."personer"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "fornavn" VARCHAR(45),
  "etternavn" VARCHAR(45),
  "postnummer" INTEGER NOT NULL,
  CONSTRAINT "fk_personer_poststed"
    FOREIGN KEY("postnummer")
    REFERENCES "poststed"("postnummer")
);
CREATE INDEX "mydb"."personer.fk_personer_poststed_idx" ON "personer" ("postnummer");
CREATE TABLE "mydb"."besok"(
  "personer_id" INTEGER NOT NULL,
  "land_id" INTEGER NOT NULL,
  "antall_besok" VARCHAR(45) NOT NULL,
  PRIMARY KEY("personer_id","land_id"),
  CONSTRAINT "fk_personer_has_land_personer1"
    FOREIGN KEY("personer_id")
    REFERENCES "personer"("id"),
  CONSTRAINT "fk_personer_has_land_land1"
    FOREIGN KEY("land_id")
    REFERENCES "land"("id")
);
CREATE INDEX "mydb"."besok.fk_personer_has_land_land1_idx" ON "besok" ("land_id");
CREATE INDEX "mydb"."besok.fk_personer_has_land_personer1_idx" ON "besok" ("personer_id");
COMMIT;


`
db.exec(sql);