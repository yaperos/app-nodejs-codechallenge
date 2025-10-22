const { v4: uuidv4 } = require("uuid");

function generateTransactionData(userContext, events, done) {
  const accountPool = [
    "+51999888001",
    "+51999888002",
    "+51999888003",
    "+51999888004",
    "+51999888005",
    "+51999888006",
    "+51999888007",
    "+51999888008",
    "+51999888009",
    "+51999888010",
    "+51999777001",
    "+51999777002",
    "+51999777003",
    "+51999777004",
    "+51999777005",
    "+51999666001",
    "+51999666002",
    "+51999666003",
    "+51999666004",
    "+51999666005",
  ];

  const transactionTypes = ["P2P", "PAYMENT", "CASH_IN", "CASH_OUT"];

  const sourceIndex = Math.floor(Math.random() * accountPool.length);
  let targetIndex = Math.floor(Math.random() * accountPool.length);

  while (targetIndex === sourceIndex) {
    targetIndex = Math.floor(Math.random() * accountPool.length);
  }

  userContext.vars.sourceAccount = accountPool[sourceIndex];
  userContext.vars.targetAccount = accountPool[targetIndex];
  userContext.vars.amount = (Math.random() * 500 + 1).toFixed(2);
  userContext.vars.transactionType =
    transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
  userContext.vars.idempotencyKey = uuidv4();
  userContext.vars.timestamp = new Date().toISOString();
  userContext.vars.batchId = `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return done();
}

function generateBulkTransactionData(userContext, events, done) {
  const highVolumeAccounts = [
    "+51999000001",
    "+51999000002",
    "+51999000003",
    "+51999000004",
    "+51999000005",
  ];

  const sourceIndex = Math.floor(Math.random() * highVolumeAccounts.length);
  const targetIndex = (sourceIndex + 1) % highVolumeAccounts.length;

  userContext.vars.sourceAccount = highVolumeAccounts[sourceIndex];
  userContext.vars.targetAccount = highVolumeAccounts[targetIndex];
  userContext.vars.amount = (Math.random() * 100 + 1).toFixed(2);
  userContext.vars.transactionType = "P2P"; // Use single type for consistency
  userContext.vars.idempotencyKey = `bulk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  userContext.vars.batchId = userContext.vars.batchId || `batch-${Date.now()}`;
  userContext.vars.sequence = userContext.vars.sequence || 0;
  userContext.vars.sequence++;

  return done();
}

function generateAccountId(userContext, events, done) {
  const accounts = [
    "+51999888001",
    "+51999888002",
    "+51999888003",
    "+51999777001",
    "+51999777002",
    "+51999666001",
  ];

  userContext.vars.accountId =
    accounts[Math.floor(Math.random() * accounts.length)];
  return done();
}

function validateTransactionResponse(
  requestParams,
  response,
  context,
  ee,
  next
) {
  const body = JSON.parse(response.body);

  if (!body.success) {
    return next(new Error("Response does not indicate success"));
  }

  if (response.statusCode === 201 && !body.data.id) {
    return next(new Error("Created transaction missing ID"));
  }

  return next();
}

function logMetrics(requestParams, response, context, ee, next) {
  const timestamp = new Date().toISOString();
  const statusCode = response.statusCode;
  const latency = response.timings.response;

  if (Math.random() < 0.01) {
    console.log(
      JSON.stringify({
        timestamp,
        statusCode,
        latency,
        url: requestParams.url,
        method: requestParams.method,
      })
    );
  }

  return next();
}

function setAuthHeaders(requestParams, context, ee, next) {
  return next();
}

module.exports = {
  generateTransactionData,
  generateBulkTransactionData,
  generateAccountId,
  validateTransactionResponse,
  logMetrics,
  setAuthHeaders,
};
