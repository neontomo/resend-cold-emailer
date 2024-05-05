import axios from 'axios'

export const handleCheckLicense = async ({
  productID,
  licenseKey
}: {
  productID: string
  licenseKey: string
}) => {
  return await axios
    .post('/api/license', {
      productID,
      licenseKey
    })
    .then((response) => {
      if (response.data.message === 'License key is valid') {
        return true
      }
      return false
    })
    .catch((error) => {
      console.error(error)
      return false
    })
}
