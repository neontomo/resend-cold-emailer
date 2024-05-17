'use client'

import Button from '@/components/Button'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { ChartLine, Envelope, File, Lock } from '@phosphor-icons/react'
import Image from 'next/image'
import DescriptionText from '@/components/DescriptionText'
import netlifyIdentity from 'netlify-identity-widget'

export default function Index() {
  const featuresList = [
    {
      icon: <File />,
      title: 'Email Templates',
      description:
        'Create email templates with useful variables like first name, last name, your name, current date, etc, and send to your email lists.'
    },
    {
      icon: <Envelope />,
      title: 'Email Lists',
      description:
        'Enter a comma-separated list of emails and send one at a time, and choose whether to let the software guess the name of the person.'
    },
    {
      icon: <Lock />,
      title: 'Secure',
      description:
        'Your data is secure and encrypted with the latest technology.'
    },
    {
      icon: <ChartLine />,
      title: 'Email Tracking',
      description:
        'Track the progress of your email campaigns and see who has opened your emails by using the resend.com dashboard.'
    }
  ]

  return (
    <>
      <NavBar netlifyIdentity={netlifyIdentity} />
      <div className="hero min-h-screen bg-base-200 pt-32 lg:pt-0 pb-32">
        <div className="hero-content min-h-screen flex-col lg:flex-row gap-32 p-4 md:p-8">
          <div>
            <h1 className="text-6xl font-bold">Get clients yesterday</h1>
            <div className="flex flex-col gap-4 my-8">
              <div className="text-xl break-words">
                Resend Cold Emailer is the easiest way to get warm clients. Just
                paste your email list, create a template and start making money.
              </div>
              <DescriptionText>
                * Requires custom domain for emails and a free{' '}
                <a
                  href="https://resend.com/signup"
                  className="text-secondary opacity-80 tooltip tooltip-bottom"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-tip="Sign up for a Resend account">
                  resend.com
                </a>{' '}
                account.
              </DescriptionText>
            </div>
            <Button
              iconSide="left"
              icon={
                <span>
                  <Image
                    src="/logo-transparent.png"
                    alt="logo"
                    className="rounded-lg h-full w-full"
                    height={32}
                    width={32}
                  />
                </span>
              }
              type="button"
              which="primary"
              size="lg"
              onClick={() =>
                window.open(
                  'https://store.neontomo.com/l/cold-emailer-client?wanted=true',
                  '_blank'
                )
              }
              value="Buy Resend Cold Emailer"
              style="py-3 px-6 gap-4"
            />
          </div>
          <div>
            <Image
              src="/resend-emailer-screenshot.png"
              alt="screenshot"
              width={500}
              height={500}
              className="max-w-full md:max-w-xl rounded-lg shadow-2xl hover:scale-125 transition-all duration-500 ease-in-out"
            />
          </div>
        </div>
      </div>

      <div className="gap-8 py-32 px-4 md:px-8 bg-white">
        <h2 className="text-4xl font-bold text-center mb-16">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-32 gap-y-16 w-1/2 mx-auto">
          {featuresList.map((feature, i) => (
            <div
              key={`feature-${i}`}
              className="flex flex-col gap-4">
              <h3 className="text-2xl font-bold items-center flex gap-2">
                {feature.icon}
                {feature.title}
              </h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="gap-8 py-32 px-4 md:px-8 bg-base-200">
        <h2 className="text-4xl font-bold text-center mb-16">Try it now</h2>
        <div className="flex flex-row gap-4 justify-center">
          <Button
            iconSide="left"
            icon={
              <span>
                <Image
                  src="/logo-transparent.png"
                  alt="logo"
                  className="rounded-lg h-full w-full"
                  height={32}
                  width={32}
                />
              </span>
            }
            type="button"
            which="primary"
            size="lg"
            onClick={() =>
              window.open(
                // https://store.neontomo.com/l/cold-emailer-client?wanted=true
                '/dashboard',
                '_blank'
              )
            }
            value="Buy Resend Cold Emailer"
            style="py-3 px-6 gap-4"
          />
        </div>
      </div>

      <Footer />
    </>
  )
}
