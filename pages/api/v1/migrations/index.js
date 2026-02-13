import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import controller from "infra/controller.js";
const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlerss);

const defaultMigrationsOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const PendingMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient,
    });
    return response.status(200).json(PendingMigrations);
  } finally {
    await dbClient.end();
  }
}

async function postHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const migrateMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false,
      dbClient,
    });

    if (migrateMigrations.length > 0) {
      return response.status(201).json(migrateMigrations);
    }

    return response.status(200).json(migrateMigrations);
  } finally {
    await dbClient.end();
  }
}
