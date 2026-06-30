import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import { Font } from '@react-email/font';
import { Preview } from '@react-email/preview';
import { Body } from '@react-email/body';
import { Container } from '@react-email/container';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { Button } from '@react-email/button';
import { Hr } from '@react-email/hr';
import { Link } from '@react-email/link';
import { Heading } from '@react-email/heading';

interface VerificationEmailProps {
  username?: string;
  emailType: 'VERIFY' | 'RESET';
  hashedToken: string;
  domain: string;
}

export default function VerificationEmail({
  emailType,
  hashedToken,
  domain,
}: VerificationEmailProps) {
  const isVerify = emailType === 'VERIFY';
  const actionText = isVerify ? 'verify your email' : 'reset your password';
  const link = `${domain}/verifyemail?token=${hashedToken}`;

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>
          {isVerify ? 'Verify your email address' : 'Reset your password'}
        </title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>Click here to {actionText}</Preview>

      <Body style={body}>
        <Container style={container}>
          <Section style={logoSection}>
            <Text style={brandName}>nextjs&#8209;auth</Text>
          </Section>

          <Hr style={divider} />

          <Section style={contentSection}>
            <Heading as="h1" style={heading}>
              {isVerify ? 'Verify your email address' : 'Reset your password'}
            </Heading>

            <Text style={subtext}>
              {isVerify
                ? 'Please confirm that you want to use this as your nextjs-auth account email address. Once verified you will be able to sign in.'
                : 'We received a request to reset the password for your nextjs-auth account. Click the button below to choose a new password.'}
            </Text>

            <Button href={link} style={button}>
              {isVerify ? 'Verify my email' : 'Reset my password'}
            </Button>

            <Hr style={divider} />

            <Text style={fallbackLabel}>
              Or paste this link into your browser:
            </Text>
            <Link href={link} style={fallbackLink}>
              {link}
            </Link>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              If you did not request this, you can safely ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/* ── Styles ── */

const body: React.CSSProperties = {
  backgroundColor: '#f4f4f4',
  fontFamily: 'Roboto, Verdana, sans-serif',
  margin: 0,
  padding: '40px 0',
};

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '6px',
  maxWidth: '520px',
  margin: '0 auto',
  padding: '0 0 32px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
};

const logoSection: React.CSSProperties = {
  textAlign: 'center',
  padding: '32px 40px 20px',
};

const brandName: React.CSSProperties = {
  fontSize: '26px',
  fontWeight: 700,
  color: '#22c55e',
  margin: 0,
  letterSpacing: '-0.5px',
};

const divider: React.CSSProperties = {
  borderColor: '#e8e8e8',
  margin: '0 40px',
};

const contentSection: React.CSSProperties = {
  padding: '28px 40px 0',
  textAlign: 'center',
};

const heading: React.CSSProperties = {
  fontSize: '26px',
  fontWeight: 700,
  color: '#111827',
  margin: '0 0 16px',
  lineHeight: '1.3',
};

const subtext: React.CSSProperties = {
  fontSize: '15px',
  color: '#6b7280',
  lineHeight: '1.6',
  margin: '0 0 28px',
};

const button: React.CSSProperties = {
  display: 'block',
  backgroundColor: '#22c55e',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 700,
  textDecoration: 'none',
  textAlign: 'center',
  borderRadius: '5px',
  padding: '14px 24px',
  margin: '0 0 28px',
  width: '100%',
  boxSizing: 'border-box',
};

const fallbackLabel: React.CSSProperties = {
  fontSize: '13px',
  color: '#9ca3af',
  margin: '20px 0 6px',
};

const fallbackLink: React.CSSProperties = {
  fontSize: '13px',
  color: '#3b82f6',
  wordBreak: 'break-all',
};

const footer: React.CSSProperties = {
  textAlign: 'center',
  padding: '20px 40px 0',
};

const footerText: React.CSSProperties = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: 0,
};
