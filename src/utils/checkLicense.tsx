import axios from 'axios'
import netlifyIdentity from 'netlify-identity-widget'

export const validLicenseKeyFormat = (licenseKey: string) => {
  return licenseKey?.trim().match(/^.{8}-.{8}-.{8}-.{8}$/)
}

export const checkLicenseAsync = async ({
  licenseKey
}: {
  licenseKey?: string
}) => {
  const key = licenseKey || (await getCustomDataFromUser('licenseKey'))

  if (!key || !validLicenseKeyFormat(key)) {
    console.log('No license key found or invalid format')
    return false
  }

  return await checkLicenseKeyWithGumroad(key.trim())
}

export const addLicenseToUser = async () => {
  const licenseKeyElement = document.getElementById(
    'license-key'
  ) as HTMLInputElement

  const licenseKey = licenseKeyElement?.value

  const isGoodLicense = await checkLicenseAsync({ licenseKey })

  if (await checkLicenseAsync({ licenseKey })) {
    addCustomDataToUser({ data: { licenseKey } })
    location.reload()
    return true
  }
}

export const getGenericJSONHeaders = () => {
  const accessToken = netlifyIdentity?.currentUser()?.token?.access_token
  if (!accessToken) return

  const tokenExpiration = netlifyIdentity?.currentUser()?.token?.expires_at
  if (tokenExpiration && new Date(tokenExpiration) < new Date()) {
    console.log('Token expired, refreshing')

    netlifyIdentity.refresh().then(() => location.reload())
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  }
}

export const addCustomDataToUser = async ({ data }: { data: any }) => {
  const genericJSONHeaders = getGenericJSONHeaders()
  if (!genericJSONHeaders || !data) return

  try {
    const res = await axios.put(
      'https://simple-resend-emailer.netlify.app/.netlify/identity/user',
      { data },
      { headers: genericJSONHeaders }
    )
    console.log(res.data)
    return res.data
  } catch (error) {
    console.error(error)
  }
}

export const checkLicenseKeyWithGumroad = async (licenseKey: string) => {
  const productID = 'bJ-NJvJIHf1FwZexc0pyIA=='

  try {
    const res = await axios.post('https://api.gumroad.com/v2/licenses/verify', {
      product_id: productID,
      license_key: licenseKey
    })

    const isValid = res?.data?.success
    console.log(isValid ? 'License key is valid' : 'License key is invalid')
    return isValid
  } catch (error) {
    console.log('License key is invalid')
    return null
  }
}

export const getCustomDataFromUser = async (key: string) => {
  const genericJSONHeaders = getGenericJSONHeaders()
  if (!genericJSONHeaders || !key) return

  try {
    const res = await axios.get(
      `https://simple-resend-emailer.netlify.app/.netlify/identity/user`,
      {
        headers: genericJSONHeaders
      }
    )
    return res?.data?.user_metadata?.[key] || null
  } catch (error) {
    console.error(error)
    return null
  }
}
