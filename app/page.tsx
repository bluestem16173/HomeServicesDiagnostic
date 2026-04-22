export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white px-6 py-16">

      {/* HERO */}
      <section className="max-w-5xl mx-auto text-center mb-20">
        <h1 className="text-5xl font-bold mb-6">
          Diagnose problems <span className="text-yellow-400">before they cost you thousands</span>
        </h1>

        <p className="text-lg text-gray-300 mb-8">
          Identify HVAC, plumbing, electrical, and home issues fast — then decide whether to fix it or upgrade with confidence.
        </p>

        <div className="flex justify-center gap-4">
          <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold">
            Start Diagnosis
          </button>

          <button className="border border-gray-400 px-6 py-3 rounded-lg">
            Get Local Help
          </button>
        </div>
      </section>

      {/* SPLIT SECTION */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">

        {/* REPAIR */}
        <div className="bg-gray-900 p-8 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-3">Fix a Problem</h2>
          <p className="text-gray-400 mb-6">
            Diagnose urgent issues like AC not cooling, leaks, or electrical problems.
          </p>
          <button className="bg-red-600 px-5 py-2 rounded-lg">
            Start Diagnosis
          </button>
        </div>

        {/* UPGRADE */}
        <div className="bg-white text-black p-8 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-3">Upgrade Your Home</h2>
          <p className="text-gray-700 mb-6">
            Explore window replacements, HVAC upgrades, roofing, and more.
          </p>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg">
            Explore Upgrades
          </button>
        </div>

      </section>

    </main>
  );
}