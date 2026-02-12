import { Resend } from 'resend'

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY
  const contactEmail = process.env.CONTACT_EMAIL ?? 'ahmedhazaaqasem@gmail.com'
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'

  if (!apiKey) {
    return Response.json({ error: 'Missing RESEND_API_KEY' }, { status: 500 })
  }

  let payload: {
    name?: string
    phone?: string
    email?: string
    city?: string
    region?: string
    message?: string
  }

  try {
    payload = await request.json()
  } catch {
    return Response.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const name = payload.name?.trim()
  const phone = payload.phone?.trim()
  const email = payload.email?.trim()
  const city = payload.city?.trim() || '-'
  const region = payload.region?.trim() || '-'
  const message = payload.message?.trim() || '-'

  if (!name || !phone || !email) {
    return Response.json({ error: 'Name, phone, and email are required' }, { status: 400 })
  }

  const resend = new Resend(apiKey)

  const subject = `طلب جديد من الموقع - ${name}`

  const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.7; color: #0f172a;">
      <h2 style="margin-bottom: 16px;">طلب جديد من موقع مدماك فيجن</h2>
      <p><strong>الاسم:</strong> ${name}</p>
      <p><strong>رقم الجوال:</strong> ${phone}</p>
      <p><strong>البريد الإلكتروني:</strong> ${email}</p>
      <p><strong>المدينة:</strong> ${city}</p>
      <p><strong>المنطقة:</strong> ${region}</p>
      <p><strong>الرسالة:</strong> ${message}</p>
    </div>
  `

  const text = [
    'طلب جديد من موقع مدماك فيجن',
    `الاسم: ${name}`,
    `رقم الجوال: ${phone}`,
    `البريد الإلكتروني: ${email}`,
    `المدينة: ${city}`,
    `المنطقة: ${region}`,
    `الرسالة: ${message}`,
  ].join('\n')

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: contactEmail,
      replyTo: email,
      subject,
      html,
      text,
    })

    if (error) {
      console.error('Resend send error:', error)
      return Response.json({ error: error.message || 'Failed to send email' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('Contact API exception:', err)
    return Response.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
