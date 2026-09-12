import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface DemoBody {
  school: string;
  name: string;
  email: string;
  note?: string;
}

function validate(body: unknown): { data: DemoBody } | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Request body must be a JSON object." };
  }
  const b = body as Record<string, unknown>;

  if (typeof b["school"] !== "string" || b["school"].trim() === "") {
    return { error: "School name is required." };
  }
  if (typeof b["name"] !== "string" || b["name"].trim() === "") {
    return { error: "Contact name is required." };
  }
  if (typeof b["email"] !== "string" || !EMAIL_RE.test(b["email"])) {
    return { error: "A valid work email address is required." };
  }

  return {
    data: {
      school: b["school"].trim(),
      name: b["name"].trim(),
      email: b["email"].trim(),
      note: typeof b["note"] === "string" ? b["note"].trim() : undefined,
    },
  };
}

// ---------------------------------------------------------------------------
// Transporter (created fresh per cold start — Vercel functions are stateless)
// ---------------------------------------------------------------------------
function createTransporter(): nodemailer.Transporter {
  const host = process.env["SMTP_HOST"];
  const port = Number(process.env["SMTP_PORT"] ?? 587);
  const user = process.env["SMTP_USER"];
  const pass = process.env["SMTP_PASS"];

  if (!host || !user || !pass) {
    throw new Error(
      "Missing SMTP config. Set SMTP_HOST, SMTP_USER and SMTP_PASS in Vercel environment variables.",
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

// ---------------------------------------------------------------------------
// HTML escape helper
// ---------------------------------------------------------------------------
function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method not allowed." });
  }

  const result = validate(req.body);
  if ("error" in result) {
    return res.status(400).json({ success: false, message: result.error });
  }

  const { school, name, email, note } = result.data;
  const to = process.env["CONTACT_EMAIL"] ?? "bidiisoftwares.1.ke@gmail.com";

  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Bidii Website" <${process.env["SMTP_USER"]}>`,
      to,
      replyTo: `"${name}" <${email}>`,
      subject: `Demo request — ${school}`,
      text: [
        `School: ${school}`,
        `Contact name: ${name}`,
        `Work email: ${email}`,
        note ? `Note:\n${note}` : "",
      ]
        .filter(Boolean)
        .join("\n\n"),
      html: `
        <table style="font-family:sans-serif;font-size:15px;color:#111;max-width:600px">
          <tr>
            <td style="padding:8px 0"><strong>School</strong></td>
            <td style="padding:8px 16px">${esc(school)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0"><strong>Contact name</strong></td>
            <td style="padding:8px 16px">${esc(name)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0"><strong>Work email</strong></td>
            <td style="padding:8px 16px">
              <a href="mailto:${esc(email)}">${esc(email)}</a>
            </td>
          </tr>
          ${
            note
              ? `<tr>
            <td style="padding:8px 0;vertical-align:top"><strong>Note</strong></td>
            <td style="padding:8px 16px">${esc(note).replace(/\n/g, "<br>")}</td>
          </tr>`
              : ""
          }
        </table>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Failed to send demo request email:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send email. Please try again later." });
  }
}
