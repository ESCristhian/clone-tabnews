exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: "true",
      default: pgm.func("gen_random_uuid()"),
    },

    // Para referência, o GitHub tem um limite de username de 39 caracteres.
    username: {
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },

    // Por que um tamanho de 254? https://stackoverflow.com/a/1199238
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },

    // Por que 60 caracteres? https://www.npmjs.com/package/bcrypt#hash-info
    password: {
      type: "varchar(60)",
      notNull: true,
    },

    created_at: {
      type: "timestamptz",
      default: "now()",
    },

    updated_at: {
      type: "timestamptz",
      default: "now()",
    },
  });
};

exports.down = false;
