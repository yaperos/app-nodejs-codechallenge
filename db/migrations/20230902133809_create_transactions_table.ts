exports.up = function (knex) {
  return knex.schema.createTable("transactions", (table) => {
    table.text("id").primary();
    table.text("account_external_id_credit");
    table.text("account_external_id_debit");
    table.integer("transfer_type_id");
    table.float("value");
    table.text("status");
    table.date("created_at");
    table.date("updated_at");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("transactions");
};
