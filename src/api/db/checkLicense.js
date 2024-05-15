const { response } = require('express')
const { client, setup } = require('./client')
const axios = require('axios')

async function checkLicense(email, productID) {
  //https://resend-cold-emailer.netlify.app/api/checkLicense/tomo@gmail.com/bJ-NJvJIHf1FwZexc0pyIA==/554DB8D9-B3264533-92D4858F-E799DE0F
  try {
    /*    if (
      !licenseKey
        .toUpperCase()
        .match(/^[0-9A-F]{8}-[0-9A-F]{8}-[0-9A-F]{8}-[0-9A-F]{8}$/)
    ) {
      return false
    } */

    await client.connect()

    const user = await client
      .db(setup.databaseName)
      .collection(setup.collectionName)
      .findOne({ email })

    const licenseKey = user.licenseKey

    await client.close()

    if (response.length === 0) {
      console.log('License not found')
      return { success: false, message: 'License not found' }
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
      return { success: true, message: 'License is valid' }
    }
    console.log('License is invalid')
    return { success: false, message: 'License is invalid' }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Error checking license' }
  }
}

module.exports = { checkLicense }
