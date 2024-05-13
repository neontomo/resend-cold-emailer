'use client'

import netlifyIdentity from 'netlify-identity-widget'
import { useState, useEffect } from 'react'
import Button from './Button'
import axios from 'axios'

export default function LoginButton() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [netlifyInitSet, setNetlifyInitSet] = useState(false)
  const [licensedUser, setLicensedUser] = useState(false)

  useEffect(() => {
    netlifyIdentity.init()

    const handleCheckLicenseKey = async () => {
      const userEmail = netlifyIdentity?.currentUser()?.email

      axios
        .get(`/api/checkLicense/${userEmail}/bJ-NJvJIHf1FwZexc0pyIA==`)
        .then((res) => {
          // console.log(res)
          if (res.data.success) {
            setLicensedUser(true)
          } else {
            setLicensedUser(false)
          }
        })
    }

    const handleLogin = (user: any) => {
      if (!user.user_metadata || !user.user_metadata.full_name) return
      setLoggedIn(true)
      setUsername(user.user_metadata.full_name)

      if (!netlifyInitSet) {
        handleCheckLicenseKey()
        setNetlifyInitSet(true)
        window.location.href = '/dashboard'
      }
    }

    const handleLogout = () => {
      setLoggedIn(false)
      setUsername('')
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
        handleCheckLicenseKey()
        setNetlifyInitSet(true)
      }
    }

    return () => {
      netlifyIdentity.off('login', handleLogin)
      netlifyIdentity.off('logout', handleLogout)
    }
  }, [])

  return (
    <>
      {!loggedIn && (
        <li
          className="tooltip tooltip-bottom cursor-pointer"
          data-tip="Create an account or log in">
          <a
            className="font-bold"
            onClick={() => netlifyIdentity.open('login')}>
            Sign up / Log in
          </a>
        </li>
      )}

      {loggedIn && (
        <>
          <li
            className="tooltip tooltip-bottom cursor-pointer"
            data-tip="Log out of your account">
            <a onClick={() => netlifyIdentity.logout()}>Log out</a>
          </li>
        </>
      )}
    </>
  )
}
