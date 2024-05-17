import axios from 'axios'
import { getCustomDataFromUser } from '@/utils/netlifyIdentity/user'

export const validLicenseKeyFormat = (licenseKey: string) => {
  return licenseKey?.trim().match(/^.{8}-.{8}-.{8}-.{8}$/)
}

export const checkLicenseKeyWithGumroad = async (licenseKey: string) => {
  try {
    const isValidLicenseRequest = await axios.post(
      process.env.GUMROAD_VERIFY_URL as string,
      {
        product_id: 'bJ-NJvJIHf1FwZexc0pyIA==',
        license_key: licenseKey?.trim()
      }
    )
    const isValidLicense = isValidLicenseRequest?.data?.success ? true : false

    console.log(
      isValidLicense ? 'License key is valid' : 'License key is invalid'
    )

    return isValidLicense
  } catch (error) {
    console.log(`Error checking license key: ${error}`)
    return false
  }
}

export const checkLicense = async ({ licenseKey }: { licenseKey?: string }) => {
  try {
    const key = licenseKey || (await getCustomDataFromUser('licenseKey'))

    if (!validLicenseKeyFormat(key)) {
      console.log('No license key found or invalid format')
      return false
    }

    return await checkLicenseKeyWithGumroad(key)
  } catch (error) {
    return false
  }
}
