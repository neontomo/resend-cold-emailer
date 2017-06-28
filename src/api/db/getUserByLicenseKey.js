const { client, setup } = require('./client')

async function getUserByLicenseKey(licenseKey) {
  try {
    await client.connect()
    const response = await client
      .db(setup.databaseName)
      .collection(setup.collectionName)
      .find({ licenseKey: licenseKey })
      .toArray()

    if (response.length === 0) {
      return 'No user found'
    }
    console.log('User found: ', response)
    return response
  } catch (error) {
    console.error(error)
  }
}

module.exports = { getUserByLicenseKey }