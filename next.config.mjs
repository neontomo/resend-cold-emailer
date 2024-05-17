/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    BASE_URL: process.env.BASE_URL,
    WEBSITE_NAME: process.env.WEBSITE_NAME,
    WEBSITE_DESCRIPTION: process.env.WEBSITE_DESCRIPTION,
    GUMROAD_VERIFY_URL: process.env.GUMROAD_VERIFY_URL,
    RESEND_SUBJECT: process.env.RESEND_SUBJECT,
    RESEND_MESSAGE: process.env.RESEND_MESSAGE
  }
}

export default nextConfig
