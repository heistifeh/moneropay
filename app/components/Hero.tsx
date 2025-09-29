import ExchangePanel from "./ExchangePanel";

export default function Hero() {
  return (
    <section className="py-30 container mx-w-7xl mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="font-semi-bold text-5xl sm:text-7xl mb-4">
          Crypto Exchange
        </h1>
        <span className="text-sm sm:text-base font-semibold">
          Free from sign-up, limits and complications
        </span>
      </div>
      <ExchangePanel />
    </section>
  );
}
