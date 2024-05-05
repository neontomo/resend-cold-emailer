import netlifyIdentity from 'netlify-identity-widget'
import axios from 'axios'

export async function checkLoggedIn() {
  netlifyIdentity.init()

  const user = netlifyIdentity.currentUser()
  if (!user || !user.user_metadata || !user.user_metadata.full_name) {
    return { loggedIn: false, username: '', licensedUser: false }
  }

  const userEmail = user.email
  try {
    const res = await axios.get(
      `/api/checkLicense/${userEmail}/bJ-NJvJIHf1FwZexc0pyIA==`
    )
    const licensedUser = res.data.success || false
    return {
      loggedIn: true,
      username: user.user_metadata.full_name,
      licensedUser
    }
  } catch (err) {
    console.error(err)
    return {
      loggedIn: true,
      username: user.user_metadata.full_name,
      licensedUser: false
    }
  }
}
