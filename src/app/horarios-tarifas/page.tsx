import { getSchedulesFormatted, getPrices, formatPrice, getSiteText } from "@/lib/data";

export const metadata = {
  title: "Horarios y Tarifas | Circuito Motocross Don Balbus",
  description:
    "Entrenamientos miércoles y viernes 20 a 00 hs. Precios por moto y acompañante. San Rafael, Mendoza.",
};

export default async function HorariosTarifasPage() {
  const [schedules, prices, weatherNotice] = await Promise.all([
    getSchedulesFormatted(),
    getPrices(),
    getSiteText("weather_notice"),
  ]);

  return (
    <div className="min-h-screen bg-brand-black">
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <h1 className="section-title">Horarios & Tarifas</h1>

          <div className="mt-10 card-racing">
            <h2 className="font-display text-xl uppercase text-brand-yellow">Horarios de entrenamiento</h2>
            <ul className="mt-4 space-y-3">
              {schedules.map((s) => (
                <li key={s.day} className="flex justify-between border-b border-white/10 pb-3 last:border-0">
                  <span className="text-white">{s.day}</span>
                  <span className="text-gray-300">{s.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-gray-400">Sujeto a cambios. A veces también sábado a la tarde.</p>
          </div>

          <div className="mt-10 card-racing">
            <h2 className="font-display text-xl uppercase text-brand-yellow">Tarifas</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 font-medium text-gray-400">Concepto</th>
                    <th className="py-3 font-medium text-gray-400 text-right">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((p) => (
                    <tr key={p.id} className="border-b border-white/5">
                      <td className="py-3 text-white">{p.name}</td>
                      <td className="py-3 text-right font-display text-lg text-brand-yellow">
                        {formatPrice(p.amount_cents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {weatherNotice && (
              <p className="mt-4 text-sm text-gray-500">{weatherNotice}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
