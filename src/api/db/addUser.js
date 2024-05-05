const { client, setup } = require('./client')
const { findUser } = require('./findUser')
const { updateUser } = require('./updateUser')
const { checkLicense } = require('./checkLicense')

async function addUser(user) {
  try {
    await client.connect()
    const existingUser = await findUser(user.email)

    if (existingUser && existingUser.email === user.email) {
      console.log('User with this email already exists, updating...')
      const response = await updateUser(user.email, user)
      await client.close()
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
