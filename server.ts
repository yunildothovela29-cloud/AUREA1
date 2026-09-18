import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/schedule-visit", async (req, res) => {
    try {
      const { propertyId, propertyTitle, clientName, clientEmail, clientPhone, preferredDate, message } = req.body;

      // Note: In production, the user must set SMTP credentials in the environment variables
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const adminEmail = process.env.ADMIN_EMAIL || "sergio.sulemane@gmail.com";

      if (smtpUser && smtpPass) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const mailOptions = {
          from: `"2S Imobiliária & Serviços" <${smtpUser}>`,
          to: adminEmail,
          subject: `Nova Solicitação de Visita: ${propertyTitle}`,
          text: `
Foi recebida uma nova solicitação de visita no site.

Imóvel: ${propertyTitle} (ID: ${propertyId})
Data Preferencial: ${preferredDate}

Dados do Cliente:
Nome: ${clientName}
E-mail: ${clientEmail}
Telefone: ${clientPhone}

Mensagem Adicional:
${message || "Nenhuma mensagem enviada."}
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Email notification sent to admin.");
      } else {
        console.warn("SMTP credentials not configured. Email notification skipped.");
      }

      res.status(200).json({ success: true, message: "Visita agendada com sucesso" });
    } catch (error) {
      console.error("Error scheduling visit:", error);
      res.status(500).json({ success: false, error: "Falha ao agendar a visita" });
    }
  });

  // Vite Middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
