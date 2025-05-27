// pages/api/send-sms.js

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { to, body } = req.body

  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
  const TWILIO_MESSAGING_SERVICE_SID = process.env.TWILIO_MESSAGING_SERVICE_SID

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`

  const params = new URLSearchParams()
  params.append('To', to)
  params.append('MessagingServiceSid', TWILIO_MESSAGING_SERVICE_SID)
  params.append('Body', body)

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  })

  const result = await response.json()
  res.status(200).json({ status: result.status || 'sent', sid: result.sid })
}
