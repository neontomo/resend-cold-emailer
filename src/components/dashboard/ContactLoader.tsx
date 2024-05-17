import React from 'react'
import Input from '@/components/Input'
import Button from '@/components/Button'
import Code from '@/components/Code'
import {
  Spinner,
  ArrowLineLeft,
  ArrowLineRight,
  ArrowLeft,
  ArrowRight,
  Upload
} from '@phosphor-icons/react'
import * as yup from 'yup'
import Card from '@/components/Card'

function ContactLoader({
  contacts,
  currentContactIndex,
  setContacts,
  setCurrentContactIndex
}: {
  contacts: string
  currentContactIndex: number
  setContacts: (contacts: string) => void
  setCurrentContactIndex: (currentContactIndex: number) => void
}) {
  return (
    <>
      <Card
        key="contacts-list"
        title="Load contacts">
        <div className="flex flex-row gap-2 flex-wrap lg:flex-nowrap justify-end">
          <Input
            id="contacts-list"
            type="text"
            placeholder="Comma-separated list of emails (daisy@gmail.com, bobby@yahoo.com, meredith@aol.com, ...)"
            containerStyle="w-full"
            style="text-xs"
          />
          <Button
            type="button"
            value="Load contacts"
            icon={<Spinner />}
            onClick={() => {
              const contactsList = document.getElementById(
                'contacts-list'
              ) as HTMLInputElement
              contactsList.value = contactsList.value
                .split(',')
                .map((email) => email.trim())
                .filter((email) => yup.string().email().isValidSync(email))
                .filter((email, index, self) => self.indexOf(email) === index)
                .join(', ')
                .replace(/, $/, '')
              setContacts(contactsList.value)
            }}
          />
          <Button
            type="button"
            value="Upload CSV"
            icon={<Upload />}
            onClick={() => {
              alert('Not implemented yet')
            }}
          />
        </div>
        {contacts && (
          <div className="flex flex-row gap-4 my-4 justify-between">
            <div className="flex flex-row gap-2 flex-wrap contact-buttons">
              {contacts.split(', ').map((contact, index) => (
                <Code
                  key={`contact-${index}`}
                  style={
                    currentContactIndex === index
                      ? 'bg-secondary text-white hover:bg-secondary'
                      : ''
                  }
                  onClick={() => {
                    setCurrentContactIndex(index)
                  }}>
                  {contact}
                </Code>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="xs"
                  iconSide="left"
                  icon={<ArrowLineLeft />}
                  which="secondary"
                  disabled={currentContactIndex === 0 || !contacts}
                  onClick={() => {
                    if (contacts) {
                      try {
                        const contactList = contacts
                          .split(',')
                          .map((contact) => {
                            return contact.trim()
                          })

                        setCurrentContactIndex(0)
                      } catch (error) {
                        console.log(error)
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  size="xs"
                  iconSide="left"
                  icon={<ArrowLeft />}
                  which="secondary"
                  disabled={currentContactIndex === 0 || !contacts}
                  onClick={() => {
                    if (contacts) {
                      try {
                        const contactList = contacts
                          .split(',')
                          .map((contact) => {
                            return contact.trim()
                          })

                        if (currentContactIndex > 0) {
                          setCurrentContactIndex(currentContactIndex - 1)
                        }
                      } catch (error) {
                        setCurrentContactIndex(0)
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  size="xs"
                  iconSide="right"
                  icon={<ArrowRight />}
                  which="secondary"
                  disabled={
                    currentContactIndex === contacts.split(',').length - 1 ||
                    !contacts
                  }
                  onClick={() => {
                    if (contacts) {
                      try {
                        const contactList = contacts
                          .split(',')
                          .map((contact) => {
                            return contact.trim()
                          })

                        if (currentContactIndex < contactList.length - 1) {
                          setCurrentContactIndex(currentContactIndex + 1)
                        }
                      } catch (error) {
                        setCurrentContactIndex(0)
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  size="xs"
                  iconSide="right"
                  icon={<ArrowLineRight />}
                  which="secondary"
                  disabled={
                    currentContactIndex === contacts.split(',').length - 1 ||
                    !contacts
                  }
                  onClick={() => {
                    if (contacts) {
                      try {
                        const contactList = contacts
                          .split(',')
                          .map((contact) => {
                            return contact.trim()
                          })

                        setCurrentContactIndex(contactList.length - 1)
                      } catch (error) {
                        console.log(error)
                      }
                    }
                  }}
                />
              </div>
              <span className="text-xs text-gray-400 mr-4">
                {contacts &&
                  `(${currentContactIndex + 1} of ${
                    contacts.split(',').length
                  })`}
              </span>
            </div>
          </div>
        )}
      </Card>
    </>
  )
}

export default ContactLoader
