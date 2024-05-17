'use client'

import { useState, useEffect } from 'react'
import { checkLoggedIn } from '@/utils/netlifyIdentity/tokens'

export default function LoginButton({
  netlifyIdentity,
  settings
}: {
  netlifyIdentity: any
  settings?: boolean
}) {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    checkLoggedIn().then((loginState) => {
      setLoggedIn(loginState)
    })

    netlifyIdentity.on('login', () => {
      window.location.reload()
    })

    netlifyIdentity.on('logout', () => {
      window.location.reload()
    })
  }, [])

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
            <a
              onClick={() => {
                netlifyIdentity.logout()
              }}>
              Log out (
              {netlifyIdentity?.currentUser()?.user_metadata?.full_name})
            </a>
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
