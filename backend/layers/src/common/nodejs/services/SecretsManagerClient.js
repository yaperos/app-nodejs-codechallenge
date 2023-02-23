const { SecretsManager } = require('aws-sdk');

class SecretsManagerClient {
  static async getSecretValue(secret) {
    return new Promise((resolve, reject) => {
      const clientSecretManager = new SecretsManager();
      clientSecretManager.getSecretValue(
        { SecretId: `${process.env.APP_NAME}-${secret}-secret-${process.env.ENV}` },
        function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(data.SecretString));
          }
        }
      );
    });
  }

}

module.exports = SecretsManagerClient;

