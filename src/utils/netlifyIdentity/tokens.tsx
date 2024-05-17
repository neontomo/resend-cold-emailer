import netlifyIdentity from 'netlify-identity-widget'

export async function checkLoggedIn() {
  netlifyIdentity.init()
  return Boolean(netlifyIdentity.currentUser())
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

export const refreshAccessToken = async () => {
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
