const { client, setup } = require('./client')
const axios = require('axios')

async function checkLicense(email, productID, licenseKey) {
  //https://simple-resend-emailer.netlify.app/api/checkLicense/tomo@gmail.com/bJ-NJvJIHf1FwZexc0pyIA==/554DB8D9-B3264533-92D4858F-E799DE0F
  try {
    if (
      !licenseKey
        .toUpperCase()
        .match(/^[0-9A-F]{8}-[0-9A-F]{8}-[0-9A-F]{8}-[0-9A-F]{8}$/)
    ) {
      return false
    }

    await client.connect()
    const response = await client
      .db(setup.databaseName)
      .collection(setup.collectionName)
      .find({ email: email, licenseKey: licenseKey })
      .toArray()

    await client.close()

    if (response.length > 0) {
      console.log('License is connected to this email')
    } else {
      console.log('License is NOT connected to this email', response)
      return false
    }

    const licenseResponse = await axios.post(
      'https://api.gumroad.com/v2/licenses/verify',
      {
        product_id: productID,
        license_key: licenseKey
      }
    )

    if (licenseResponse.data.success) {
      console.log('License is valid')
      return true
    }
    console.log('License is invalid')
    return false
  } catch (error) {
    console.error(error)
    return false
  }
}

module.exports = { checkLicense }
