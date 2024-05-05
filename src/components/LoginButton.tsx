'use client'

import netlifyIdentity from 'netlify-identity-widget'
import { useState, useEffect } from 'react'
import Button from './Button'

export default function LoginButton() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [netlifyInitSet, setNetlifyInitSet] = useState(false)

  useEffect(() => {
    if (netlifyInitSet) return

    netlifyIdentity.init()
    setNetlifyInitSet(true)

    const currentUser = netlifyIdentity.currentUser()
    if (
      !currentUser ||
      !currentUser.user_metadata ||
      !currentUser.user_metadata.full_name
    )
      return

    setLoggedIn(true)
    setUsername(currentUser.user_metadata.full_name)

    netlifyIdentity.on('login', (user) => {
      if (!user.user_metadata || !user.user_metadata.full_name) return
      setLoggedIn(true)
      setUsername(user.user_metadata.full_name)
    })

    netlifyIdentity.on('logout', () => {
      setLoggedIn(false)
      setUsername('')
    })

    return () => {
      netlifyIdentity.off('login')
      netlifyIdentity.off('logout')
    }
  }, [netlifyInitSet])

  return (
    <>
      {!loggedIn && (
        <Button
          type="button"
          onClick={() => netlifyIdentity.open('login')}
          value="Log in"
        />
      )}
      {loggedIn && (
        <Button
          type="button"
          onClick={() => netlifyIdentity.logout()}
          value={`Log out ${username}`}
        />
      )}
    </>
  )
}
