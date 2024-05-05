const { MongoClient, ServerApiVersion } = require('mongodb')

const setup = {
  loginUsername: 'tomo',
  loginPassword: 'EQ6L1eMfqx0oc3HF',
  clusterName: 'sidehustlecluster',
  databaseName: 'ResendAccounts',
  collectionName: 'AccountsCollection',
  testLicenseKey: '554DB8D9-B3264533-92D4858F-E799DE0F'
}

const uri = `mongodb+srv://${setup.loginUsername}:${setup.loginPassword}@${setup.clusterName}.o1ce4vr.mongodb.net/${setup.databaseName}?retryWrites=true&w=majority`

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

module.exports = { client, setup }
