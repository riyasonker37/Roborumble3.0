import {
  Body, Container, Head, Heading, Hr, Html, 
  Link, Preview, Section, Text
} from "@react-email/components";
import * as React from "react";

interface EmailProps {
  userName: string;
  eventName: string;
  transactionId: string;
  amount: string;
  brochureUrl: string;
}

export const RegistrationApprovedEmail = ({
  userName, eventName, transactionId, amount, brochureUrl
}: EmailProps) => (
  <Html>
    <Head />
    <Preview>Your registration for {eventName} is confirmed!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Registration Approved! 🎉</Heading>
        <Text style={text}>Hi {userName},</Text>
        <Text style={text}>
          Great news! Your registration for **{eventName}** has been officially approved. 
          We are excited to have you join us.
        </Text>

        <Section style={statsContainer}>
          <Text style={subheading}>Transaction Details</Text>
          <Text style={detailText}><strong>Amount Paid:</strong> {amount}</Text>
          <Text style={detailText}><strong>Transaction ID:</strong> {transactionId}</Text>
        </Section>

        <Hr style={hr} />

        <Section>
          <Text style={subheading}>Event Guidelines & Materials</Text>
          <Text style={text}>
            Please review the event guidelines and download the official brochure 
            to prepare for the day:
          </Text>
          <Link href={brochureUrl} style={button}>Download Event Brochure</Link>
        </Section>

        <Text style={footer}>
          If you have any questions, reply to this email. See you there!
        </Text>
      </Container>
    </Body>
  </Html>
);

// Styles
const main = { backgroundColor: "#f6f9fc", fontFamily: "sans-serif" };
const container = { backgroundColor: "#ffffff", margin: "0 auto", padding: "20px 0 48px" };
const h1 = { color: "#333", fontSize: "24px", fontWeight: "bold", textAlign: "center" as const };
const text = { color: "#525f7f", fontSize: "16px", lineHeight: "24px" };
const statsContainer = { background: "#f4f4f4", padding: "15px", borderRadius: "8px" };
const subheading = { fontSize: "18px", fontWeight: "bold", color: "#333" };
const detailText = { fontSize: "14px", color: "#555", margin: "4px 0" };
const button = { backgroundColor: "#0070f3", borderRadius: "5px", color: "#fff", padding: "12px 20px", textDecoration: "none", display: "inline-block", marginTop: "10px" };
const hr = { borderColor: "#e6ebf1", margin: "20px 0" };
const footer = { color: "#8898aa", fontSize: "12px", textAlign: "center" as const, marginTop: "20px" };
