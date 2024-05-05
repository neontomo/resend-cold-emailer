const { client, setup } = require('./client')

async function allUsers(user) {
  try {
    await client.connect()
    const response = await client
      .db(setup.databaseName)
      .collection(setup.collectionName)
      .find()
      .toArray()

    console.log('All users: ', response)
    await client.close()
    return response
  } catch (error) {
    console.error(error)
  }
}

module.exports = { allUsers }
