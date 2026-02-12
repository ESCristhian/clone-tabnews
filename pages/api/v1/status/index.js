import database from "infra/database.js";
import { InternalServerError } from "infra/errors";

async function status(request, response) {
  try {
    const updatedAt = new Date().toISOString();

    const versaoDb = await database.query("SHOW server_version;");
    const versaoDbValue = versaoDb.rows[0].server_version;

    const maxConect = await database.query("SHOW max_connections;");
    const maxConectValue = parseInt(maxConect.rows[0].max_connections);

    const databaseName = process.env.POSTGRES_DB;
    const openConect = await database.query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName],
    });
    const openConectValue = parseInt(openConect.rows[0].count);

    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: versaoDbValue,
          max_connections: maxConectValue,
          opened_connections: openConectValue,
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });

    console.log("\n Erro dentro do catch do controller:");
    console.error(publicErrorObject);

    response.status(500).json(publicErrorObject);
  }
}
export default status;
