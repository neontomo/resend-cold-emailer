import axios from 'axios'
import { checkLicense } from '@/utils/gumroad/license'
import { getGenericJSONHeaders } from '@/utils/netlifyIdentity/tokens'

export const getCustomDataFromUser = async (key: string) => {
  const genericJSONHeaders = await getGenericJSONHeaders()
  if (!genericJSONHeaders || !key) return

  const customData = await axios
    .get(`${process.env.BASE_URL}/.netlify/identity/user`, {
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

export const getMultipleCustomDataFromUser = async (keys: string[]) => {
  const genericJSONHeaders = await getGenericJSONHeaders()
  if (!genericJSONHeaders || !keys) return

  const customData = await axios
    .get(`${process.env.BASE_URL}/.netlify/identity/user`, {
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

export const addCustomDataToUser = async ({ data }: { data: any }) => {
  const genericJSONHeaders = await getGenericJSONHeaders()
  if (!genericJSONHeaders || !data) return

  const allCustomData = await axios
    .put(
      `${process.env.BASE_URL}/.netlify/identity/user`,
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

export const addLicenseToUser = async ({
  licenseKey
}: {
  licenseKey?: string
}) => {
  try {
    const isValidLicense = await checkLicense({ licenseKey })

    if (isValidLicense) {
      await addCustomDataToUser({ data: { licenseKey } })
      location.reload()
    }
  } catch (error) {}
}
