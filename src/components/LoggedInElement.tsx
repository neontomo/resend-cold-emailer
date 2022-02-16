'use client'

import netlifyIdentity from 'netlify-identity-widget'
import { useState, useEffect } from 'react'
import Button from './Button'
import axios from 'axios'
import { Check } from '@phosphor-icons/react'
import LoginButton from './LoginButton'

export default function LoggedInElement({
  children
}: {
  children: React.ReactNode
}) {
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
      }
      // refresh page
      window.location.reload()
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
      {loggedIn && <>{children}</>}

      {!loggedIn && (
        <>
          <div className="mx-auto p-8 h-screen overflow-x-hidden flex w-full md:w-1/2 items-center justify-center">
            <div className="card bg-base-100 shadow-xl w-full">
              <div className="card-body">
                <div className="flex flex-col gap-4 justify-between">
                  <h2 className="card-title">License</h2>
                  <div>
                    Please purchase a license to use this product for life, or
                    log in if you already have a license.
                  </div>
                  <div className="flex flex-row gap-8 justify-end flex-wrap items-center">
                    <a
                      className="font-bold cursor-pointer"
                      onClick={() => netlifyIdentity.open('signup')}>
                      Sign up / Log in
                    </a>
                    <Button
                      icon={<Check />}
                      type="button"
                      value="Buy license"
                      onClick={() => {
                        window.open(
                          'https://store.neontomo.com/l/cold-emailer-client?wanted=true'
                        )
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
