const { client, setup } = require('./client')

async function findUser(email) {
  try {
    await client.connect()
    const response = await client
      .db(setup.databaseName)
      .collection(setup.collectionName)
      .findOne({ email })

    if (response.length === 0) {
      console.log('User not found')
      return false
    }

    console.log('User found: ', response)
    await client.close()
    return response
  } catch (error) {
    console.error(error)
  }
}

module.exports = { findUser }
