import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { join } from "path"

export default () =>
  ({
    /*
  |--------------------------------------------------------------------------
  | Database Connection
  |--------------------------------------------------------------------------
  |
  | Here you may specify which of the database connections you wish
  | to use as your default connection for all database work.
  |
  */
    type: process.env.DB_DIALECT || "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_DATABASE || "ppp",
    logging: process.env.DB_LOGGING === "true",
    entities: [join(__dirname, "../", "**/*.entity{.ts,.js}")],
    migrations: [join(__dirname, "../", "database/migrations/**/*.ts")],
    synchronize: process.env.DB_SYNCHRONIZE === "true",
    dropSchema: process.env.DB_DROP_SCHEMA === "false",
    migrationsRun: process.env.DB_MIGRATIONS_RUN === "true",
  } as TypeOrmModuleOptions)
