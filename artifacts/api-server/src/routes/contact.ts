import { Router, type IRouter } from "express";
import nodemailer from "nodemailer";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface DemoBody {
  school: string;
  name: string;
  email: string;
  note?: string;
}

function validateDemoBody(body: unknown): { data: DemoBody } | { error: string } {
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
// Lazy-initialised transporter
// ---------------------------------------------------------------------------
let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (_transporter) return _transporter;

  const host = process.env["SMTP_HOST"];
  const port = Number(process.env["SMTP_PORT"] ?? 587);
  const user = process.env["SMTP_USER"];
  const pass = process.env["SMTP_PASS"];

  if (!host || !user || !pass) {
    throw new Error(
      "Missing SMTP configuration. Set SMTP_HOST, SMTP_USER and SMTP_PASS environment variables.",
    );
  }

  _transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // TLS on 465, STARTTLS on 587
    auth: { user, pass },
  });

  return _transporter;
}

// ---------------------------------------------------------------------------
// POST /api/contact/demo
// ---------------------------------------------------------------------------
router.post("/demo", async (req, res) => {
  const result = validateDemoBody(req.body);

  if ("error" in result) {
    res.status(400).json({ success: false, message: result.error });
    return;
  }

  const { school, name, email, note } = result.data;
  const recipientEmail =
    process.env["CONTACT_EMAIL"] ?? "bidiisoftwares.1.ke@gmail.com";

  try {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"Bidii Website" <${process.env["SMTP_USER"]}>`,
      to: recipientEmail,
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
          <tr><td style="padding:8px 0"><strong>School</strong></td><td style="padding:8px 16px">${escHtml(school)}</td></tr>
          <tr><td style="padding:8px 0"><strong>Contact name</strong></td><td style="padding:8px 16px">${escHtml(name)}</td></tr>
          <tr><td style="padding:8px 0"><strong>Work email</strong></td><td style="padding:8px 16px"><a href="mailto:${escHtml(email)}">${escHtml(email)}</a></td></tr>
          ${note ? `<tr><td style="padding:8px 0;vertical-align:top"><strong>Note</strong></td><td style="padding:8px 16px">${escHtml(note).replace(/\n/g, "<br>")}</td></tr>` : ""}
        </table>
      `,
    });

    logger.info({ school, email }, "Demo request email sent");
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, "Failed to send demo request email");
    res
      .status(500)
      .json({ success: false, message: "Failed to send email. Please try again later." });
  }
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default router;
