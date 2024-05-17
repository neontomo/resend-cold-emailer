import netlifyIdentity from 'netlify-identity-widget'

export async function checkLoggedIn() {
  netlifyIdentity.init()
  return Boolean(netlifyIdentity.currentUser())
}
