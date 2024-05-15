'use client'

import netlifyIdentity from 'netlify-identity-widget'
import { useState, useEffect } from 'react'

export default function LoginButton({ settings }: { settings?: boolean }) {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [netlifyInitSet, setNetlifyInitSet] = useState(false)

  useEffect(() => {
    const handleLogin = (user: any) => {
      if (!user.user_metadata || !user.user_metadata.full_name) return
      setLoggedIn(true)
      setUsername(user.user_metadata.full_name)

      if (!netlifyInitSet) {
        netlifyIdentity.init()
        setNetlifyInitSet(true)
        if (window.location.pathname === '/') {
          window.location.href = '/dashboard'
        }
      }
    }

    const handleLogout = () => {
      setLoggedIn(false)
      setUsername('')
      window.location.reload && window.location.reload()
    }

    if (!netlifyInitSet) {
      netlifyIdentity.init()
      setNetlifyInitSet(true)
    }

    netlifyIdentity.on('login', handleLogin)
    netlifyIdentity.on('logout', handleLogout)

    const currentUser = netlifyIdentity.currentUser()
    if (
      currentUser &&
      currentUser.user_metadata &&
      currentUser.user_metadata.full_name
    ) {
      setLoggedIn(true)
      setUsername(currentUser.user_metadata.full_name)

      if (!netlifyInitSet) {
        setNetlifyInitSet(true)
      }
    }

    return () => {
      netlifyIdentity.off('login', handleLogin)
      netlifyIdentity.off('logout', handleLogout)
    }
  }, [netlifyInitSet])

  return (
    <>
      {!loggedIn && (
        <>
          <li
            className="tooltip tooltip-bottom cursor-pointer"
            data-tip="Create an account or log in">
            <a
              className="font-bold"
              onClick={() => netlifyIdentity.open('signup')}>
              Sign up / Log in
            </a>
          </li>
        </>
      )}

      {loggedIn && (
        <>
          <li
            className="tooltip tooltip-bottom cursor-pointer"
            data-tip="Log out of your account">
            <a onClick={() => netlifyIdentity.logout()}>Log out ({username})</a>
          </li>
          {settings && (
            <li
              className="tooltip tooltip-bottom"
              data-tip="Your user settings">
              <a href="/settings">Settings</a>
            </li>
          )}
        </>
      )}
    </>
  )
}
