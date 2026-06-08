import React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { Resend } from 'npm:resend@4.0.0'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { MagicLinkEmail } from './_templates/magic-link.tsx'

type SendEmailPayload = {
  user: {
    email: string
  }
  email_data: {
    token: string
    token_hash: string
    redirect_to: string
    email_action_type: string
    site_url: string
  }
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY') ?? '')
const hookSecret = (Deno.env.get('SEND_EMAIL_HOOK_SECRET') ?? '').replace(
  'v1,whsec_',
  '',
)

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const payload = await req.text()
  const headers = Object.fromEntries(req.headers)
  const webhook = new Webhook(hookSecret)

  try {
    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type, site_url },
    } = webhook.verify(payload, headers) as SendEmailPayload

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? site_url
    const html = await renderAsync(
      React.createElement(MagicLinkEmail, {
        supabaseUrl,
        token,
        tokenHash: token_hash,
        redirectTo: redirect_to,
        emailActionType: email_action_type,
      }),
    )

    const { error } = await resend.emails.send({
      from: Deno.env.get('AUTH_EMAIL_FROM') ?? 'Supabase Auth POC <onboarding@resend.dev>',
      to: [user.email],
      subject: 'Sign in to Supabase Auth POC',
      html,
    })

    if (error) {
      throw error
    }

    return Response.json({})
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send auth email'

    return Response.json(
      {
        error: {
          message,
        },
      },
      { status: 401 },
    )
  }
})
