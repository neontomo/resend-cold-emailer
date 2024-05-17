import axios from 'axios'
import netlifyIdentity from 'netlify-identity-widget'
import { checkLoggedIn } from './checkLoggedIn'

export const validLicenseKeyFormat = (licenseKey: string) => {
  return licenseKey?.trim().match(/^.{8}-.{8}-.{8}-.{8}$/)
}

export const checkLicenseKeyWithGumroad = async (licenseKey: string) => {
  const isValidLicense = await axios
    .post('https://api.gumroad.com/v2/licenses/verify', {
      product_id: 'bJ-NJvJIHf1FwZexc0pyIA==',
      license_key: licenseKey
    })
    .then((response) => {
      return response?.data?.success ? true : false
    })
    .catch((error) => {
      console.log(`Error checking license key: ${error}`)
      return false
    })

  console.log(
    isValidLicense ? 'License key is valid' : 'License key is invalid'
  )

  return isValidLicense
}

export const checkLicenseAsync = async ({
  licenseKey
}: {
  licenseKey?: string
}) => {
  const { licenseKey: keyFromUser } = await getMultipleCustomDataFromUser([
    'licenseKey'
  ])

  const key = licenseKey || keyFromUser

  if (!key || !validLicenseKeyFormat(key)) {
    console.log('No license key found or invalid format')
    return false
  }

  return await checkLicenseKeyWithGumroad(key.trim())
}

export const addLicenseToUser = async ({
  licenseKey
}: {
  licenseKey?: string
}) => {
  checkLicenseAsync({ licenseKey }).then((isValidLicense) => {
    if (isValidLicense) {
      addCustomDataToUser({ data: { licenseKey } })
      location.reload()
    }
  })
}
const refreshAccessToken = async () => {
  return netlifyIdentity
    .refresh(true)
    .then(() => {
      return netlifyIdentity.currentUser()?.token?.access_token
    })
    .catch((error) => {
      console.log('Error refreshing token:', error)
      return null
    })
}

export const getAccessToken = async () => {
  const tokenExpiration = netlifyIdentity?.currentUser()?.token?.expires_at
  const tokenExpired =
    tokenExpiration && new Date(tokenExpiration) <= new Date()

  const token = tokenExpired
    ? await refreshAccessToken()
    : netlifyIdentity?.currentUser()?.token?.access_token

  console.log(tokenExpired ? 'Token invalid, refreshing' : 'Token still valid')
  return token
}

export const getGenericJSONHeaders = async () => {
  const loggedIn = await checkLoggedIn()
  if (!loggedIn) return

  const accessToken = await getAccessToken()
  if (!accessToken) return

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  }
}

export const addCustomDataToUser = async ({ data }: { data: any }) => {
  const genericJSONHeaders = await getGenericJSONHeaders()
  if (!genericJSONHeaders || !data) return

  const allCustomData = await axios
    .put(
      'https://resend-cold-emailer.netlify.app/.netlify/identity/user',
      { data },
      { headers: genericJSONHeaders }
    )
    .then((res) => {
      return res.data || null
    })
    .catch((error) => {
      console.log('Error adding custom data to user:', error)
      return null
    })

  console.log(allCustomData || 'No response data')
  return allCustomData
}

export const getMultipleCustomDataFromUser = async (keys: string[]) => {
  const genericJSONHeaders = await getGenericJSONHeaders()
  if (!genericJSONHeaders || !keys) return

  const customData = await axios
    .get(`https://resend-cold-emailer.netlify.app/.netlify/identity/user`, {
      headers: genericJSONHeaders
    })
    .then((res) => {
      const data = res?.data?.user_metadata
      return keys.reduce((acc: any, key: string) => {
        acc[key] = data?.[key] || null
        return acc
      }, {})
    })
    .catch((error) => {
      console.log('Error getting custom data from user:', error)
      return null
    })

  return customData
}

export const getCustomDataFromUser = async (key: string) => {
  const genericJSONHeaders = await getGenericJSONHeaders()
  if (!genericJSONHeaders || !key) return

  const customData = await axios
    .get(`https://resend-cold-emailer.netlify.app/.netlify/identity/user`, {
      headers: genericJSONHeaders
    })
    .then((res) => {
      return res?.data?.user_metadata?.[key] || null
    })
    .catch((error) => {
      console.log('Error getting custom data from user:', error)
      return null
    })

  return customData
}
