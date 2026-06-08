import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import React from 'npm:react@18.3.1'

type MagicLinkEmailProps = {
  token: string
}

export function MagicLinkEmail({ token }: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your one-time login code is ready.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.mark}>S</Section>
          <Heading style={styles.heading}>Your login code</Heading>
          <Text style={styles.text}>
            Enter this code in Supabase Auth POC to finish signing in.
          </Text>
          <Text style={styles.code}>{token}</Text>
          <Text style={styles.footer}>
            If you did not request this email, you can safely ignore it.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const styles = {
  body: {
    margin: 0,
    backgroundColor: '#f5f4ed',
    color: '#161d18',
    fontFamily:
      "Avenir, 'Avenir Next', 'Trebuchet MS', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  container: {
    width: '100%',
    maxWidth: '520px',
    margin: '0 auto',
    padding: '48px 24px',
  },
  mark: {
    width: '44px',
    height: '44px',
    borderRadius: '8px',
    backgroundColor: '#205a45',
    color: '#f8fbf8',
    fontSize: '22px',
    fontWeight: 700,
    lineHeight: '44px',
    textAlign: 'center' as const,
  },
  heading: {
    margin: '28px 0 12px',
    color: '#161d18',
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: '32px',
    lineHeight: '36px',
    fontWeight: 600,
  },
  text: {
    margin: '0 0 22px',
    color: '#68716b',
    fontSize: '16px',
    lineHeight: '24px',
  },
  code: {
    margin: '0 0 24px',
    padding: '16px 18px',
    border: '1px solid #d9d6ca',
    borderRadius: '6px',
    backgroundColor: '#fffef9',
    color: '#161d18',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: '22px',
    fontWeight: 700,
    letterSpacing: '4px',
    textAlign: 'center' as const,
  },
  footer: {
    margin: 0,
    color: '#8c8b80',
    fontSize: '13px',
    lineHeight: '20px',
  },
}
