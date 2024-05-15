import netlifyIdentity from 'netlify-identity-widget'

export function checkLoggedIn() {
  netlifyIdentity.init()

  const user = netlifyIdentity.currentUser()

  if (!user) {
    return false
  }

  return true
}
