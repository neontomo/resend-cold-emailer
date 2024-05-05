const { client, setup } = require('./client')

async function updateUser(email, updatedUser) {
  try {
    await client.connect()
    const response = await client
      .db(setup.databaseName)
      .collection(setup.collectionName)
      .updateOne({ email: email }, { $set: updatedUser })

    if (response.length === 0) {
      return 'No user found'
    }
    console.log('User updated: ', response)
    return response
  } catch (error) {
    console.error(error)
  }
}

module.exports = { updateUser }
