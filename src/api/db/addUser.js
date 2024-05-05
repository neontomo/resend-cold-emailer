const { client, setup } = require('./client')
const { getUser } = require('./findUser')
const { updateUser } = require('./updateUser')

async function addUser(user) {
  try {
    await client.connect()
    const existingUser = await getUser(user.email)

    if (existingUser.length > 0) {
      console.log('User with this email already exists, updating...')
      const response = await updateUser(user.email, user)
      return response
    }

    const response = await client
      .db(setup.databaseName)
      .collection(setup.collectionName)
      .insertOne(user)

    console.log('User added: ', response)
    await client.close()
    return response
  } catch (error) {
    console.error(error)
  }
}

module.exports = { addUser }
