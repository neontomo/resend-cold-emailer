const { client, setup } = require('./client')

async function deleteUser(user) {
  try {
    await client.connect()
    const response = await client
      .db(setup.databaseName)
      .collection(setup.collectionName)
      .deleteOne(user)

    console.log('User deleted: ', response)
    return response
  } catch (error) {
    console.error(error)
  }
}

module.exports = { deleteUser }
