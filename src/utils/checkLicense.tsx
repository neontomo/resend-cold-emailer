import axios from 'axios'
import netlifyIdentity from 'netlify-identity-widget'

export const getGenericJSONHeaders = () => {
  const accessToken = netlifyIdentity?.currentUser()?.token?.access_token
  if (!accessToken) return

  const tokenExpiration = netlifyIdentity?.currentUser()?.token?.expires_at
  if (tokenExpiration && new Date(tokenExpiration) < new Date()) {
    console.log('Token expired, refreshing')

    netlifyIdentity.refresh().then((token) => {
      location.reload()
    })
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  }
}

export const addCustomDataToUser = async ({ data }: { data: any }) => {
  const genericJSONHeaders = getGenericJSONHeaders()
  if (!genericJSONHeaders || !data) return

  axios
    .put(
      'https://simple-resend-emailer.netlify.app/.netlify/identity/user',
      { data },
      { headers: genericJSONHeaders }
    )
    .then((res) => {
      console.log(res.data)
    })
    .catch((error) => {
      console.error(error)
    })
}

export const validLicenseKeyFormat = (licenseKey: string) => {
  return licenseKey?.trim().match(/^.{8}-.{8}-.{8}-.{8}$/)
}

export const checkLicenseKeyWithGumroad = async (licenseKey: string) => {
  const productID = 'bJ-NJvJIHf1FwZexc0pyIA=='

  const licenseKeyProcessed = licenseKey?.trim()

  if (!licenseKey || !validLicenseKeyFormat(licenseKeyProcessed)) {
    console.log('No license key found or invalid format')
    return
  }

  const licenseResponse = await axios
    .post('https://api.gumroad.com/v2/licenses/verify', {
      product_id: productID,
      license_key: licenseKeyProcessed
    })
    .then((res) => {
      return res?.data?.success
    })
    .catch((error) => {
      console.log('Error:', error)
      return null
    })

  if (licenseResponse) {
    console.log('License key is valid')
    return true
  }
  console.log('License key is invalid')
  return false
}

export const getCustomDataFromUser = async (key: string) => {
  const genericJSONHeaders = getGenericJSONHeaders()
  if (!genericJSONHeaders || !key) return

  const data = axios
    .get(`https://simple-resend-emailer.netlify.app/.netlify/identity/user`, {
      headers: genericJSONHeaders
    })
    .then((res) => {
      return res?.data?.user_metadata?.[key] || null
    })
    .catch((error) => {
      console.error(error)
      return null
    })

  return data
}
