import React, { useState } from 'react'
import { Check, Ticket } from '@phosphor-icons/react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { addLicenseToUser } from '@/utils/checkLicense'
import netlifyIdentity from 'netlify-identity-widget'

export function LoginScreen() {
  return (
    <>
      <div className="mx-auto p-8 h-screen overflow-x-hidden flex w-full md:w-1/2 items-center justify-center">
        <div className="card bg-base-100 shadow-xl w-full">
          <div className="card-body">
            <div className="flex flex-col gap-4 justify-between">
              <h2 className="card-title">🔒 No Access</h2>
              <div>
                <div className="text-lg">
                  Please register or log in to purchase a license. Licenses are
                  valid for life.
                </div>
              </div>
              <div className="flex flex-row gap-8 justify-end flex-wrap items-center">
                <Button
                  icon={<Check />}
                  type="button"
                  value="Sign up / Log in"
                  onClick={() => netlifyIdentity.open('signup')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export function BuyLicense() {
  return (
    <>
      <div className="mx-auto p-8 h-screen overflow-x-hidden flex w-full md:w-1/2 items-center justify-center">
        <div className="card bg-base-100 shadow-xl w-full">
          <div className="card-body">
            <div className="flex flex-col gap-4 justify-between">
              <h2 className="card-title">🎟️ Buy license</h2>
              <div>
                <div className="text-lg">
                  Please buy a license to use this tool. Licenses are valid for
                  life.
                </div>
              </div>
              <div className="flex flex-col flex-wrap justify-end w-full gap-4">
                <div className="flex flex-row flex-wrap justify-end w-full gap-4">
                  <Button
                    icon={<Ticket />}
                    type="button"
                    value="Buy license"
                    which="primary"
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
      </div>
      <div className="flex flex-row flex-wrap justify-end w-full gap-4">
        <Input
          id="license-key"
          type="text"
          placeholder="License key"
          containerStyle="flex-grow"
        />
        <Button
          icon={<Check />}
          type="button"
          which="light"
          value="Verify license"
          onClick={() => addLicenseToUser()}
        />
      </div>
    </>
  )
}
