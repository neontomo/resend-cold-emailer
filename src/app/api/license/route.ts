import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(req: Request, res: Response) {
  try {
    const { productID, licenseKey } = await req.json()

    if (!productID || !licenseKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (
      !licenseKey
        .toUpperCase()
        .match(/^[0-9A-F]{8}-[0-9A-F]{8}-[0-9A-F]{8}-[0-9A-F]{8}$/)
    ) {
      return NextResponse.json(
        { error: 'Invalid license key format' },
        { status: 400 }
      )
    }

    const response = await axios.post(
      'https://api.gumroad.com/v2/licenses/verify',
      {
        product_id: productID,
        license_key: licenseKey
      }
    )

    if (response.data.success) {
      return NextResponse.json(
        {
          message: 'License key is valid'
        },
        {
          status: 200
        }
      )
    }

    return NextResponse.json(
      {
        message: 'License key is invalid'
      },
      {
        status: 400
      }
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        message: 'Error validating license key'
      },
      {
        status: 500
      }
    )
  }
}
