import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  const allowedMethod = ["GET", "POST"];
  if (!allowedMethod.includes(request.method)) {
    return response.status(405).json({
      rerror: `Method "${request.method}" not allowed`,
    });
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const defaultMigrationsOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };
    if (request.method === "GET") {
      const PendingMigrations = await migrationRunner(defaultMigrationsOptions);
      return response.status(200).json(PendingMigrations);
    }

    if (request.method === "POST") {
      const migrateMigrations = await migrationRunner({
        ...defaultMigrationsOptions,
        dryRun: false,
      });

      if (migrateMigrations.length > 0) {
        return response.status(201).json(migrateMigrations);
      }

      return response.status(200).json(migrateMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
