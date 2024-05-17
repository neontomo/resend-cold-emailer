'use client'

import { useEffect, useState } from 'react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import netlifyIdentity from 'netlify-identity-widget'
import { checkLoggedIn } from '@/utils/netlifyIdentity/tokens'
import { checkLicense } from '@/utils/gumroad/license'
import { getMultipleCustomDataFromUser } from '@/utils/netlifyIdentity/user'
import { GetStarted } from '@/components/settings/GetStarted'
import { LicenseChecker } from '@/components/settings/LicenseChecker'
import { TemplateSettings } from '@/components/settings/TemplateSettings'
import { MainSettings } from '@/components/settings/MainSettings'

export default function Settings() {
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [licensedUser, setLicensedUser] = useState(false)
  const [licenseKey, setLicenseKey] = useState('')
  const [userID, setUserID] = useState('')

  async function checks() {
    if (!loadingSettings) return
    const loginState = await checkLoggedIn()
    if (!loginState) return

    setLoggedIn(loginState)

    const isValidLicense = await checkLicense({})
    setLicensedUser(isValidLicense)

    const license = await getMultipleCustomDataFromUser(['licenseKey']).then(
      (data) => data.licenseKey
    )
    setLicenseKey(license)

    setLoadingSettings(false)
  }

  useEffect(() => {
    checks()
  }, [])

  return (
    <>
      <NavBar netlifyIdentity={netlifyIdentity} />

      <div className="mx-auto min-h-screen overflow-x-hidden py-32 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GetStarted userID={netlifyIdentity?.currentUser()?.id as string} />
          <LicenseChecker
            userID={netlifyIdentity?.currentUser()?.id as string}
            licensedUser={licensedUser}
            licenseKey={licenseKey}
            loggedIn={loggedIn}
          />
          {loggedIn && licensedUser && (
            <>
              <MainSettings
                userID={netlifyIdentity?.currentUser()?.id as string}
              />
              <TemplateSettings
                userID={netlifyIdentity?.currentUser()?.id as string}
              />
            </>
          )}
        </div>
      </div>
    </>
  )
}
