import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().optional(),
  telegram: z.string().min(2),
  phone: z.string().optional(),
  email: z.string().email(),
  message: z.string().optional(),
});

async function sendTelegramNotification(data: {
  name?: string;
  telegram: string;
  phone?: string;
  email: string;
  message?: string;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const lines = [`📬 *Новое сообщение с портфолио*\n`];
  if (data.name) lines.push(`👤 *Имя:* ${data.name}`);
  lines.push(`💬 *Telegram:* ${data.telegram}`);
  if (data.phone) lines.push(`📞 *Телефон:* ${data.phone}`);
  lines.push(`📧 *Email:* ${data.email}`);
  if (data.message) lines.push(`\n✉️ *Сообщение:*\n${data.message}`);

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: lines.join("\n"), parse_mode: "Markdown" }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    await db.contactMessage.create({ data });

    await sendTelegramNotification(data).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
