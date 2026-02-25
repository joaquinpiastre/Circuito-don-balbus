import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const TO_EMAIL = process.env.CONTACT_EMAIL || "contacto@donbalbus.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, message } = body;
    if (!name || !message) {
      return NextResponse.json(
        { error: "Faltan nombre o mensaje" },
        { status: 400 }
      );
    }
    if (!resend) {
      return NextResponse.json(
        { error: "Servicio de email no configurado" },
        { status: 503 }
      );
    }
    const { error } = await resend.emails.send({
      from: "Circuito Don Balbus <onboarding@resend.dev>",
      to: TO_EMAIL,
      replyTo: body.email || undefined,
      subject: `Consulta web: ${name}`,
      text: `Nombre: ${name}\nTeléfono: ${phone || "—"}\n\nMensaje:\n${message}`,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Error al enviar el mensaje" },
      { status: 500 }
    );
  }
}
