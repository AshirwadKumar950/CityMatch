const features = [
  {
    icon: "🗺️",
    title: "Interactive Map",
    desc: "Drop a pin anywhere in the world to explore neighborhoods visually and understand the area around you.",
  },
  {
    icon: "🎯",
    title: "Facility Matching",
    desc: "Tell us what you need — hospitals, schools, gyms, parks — and we highlight the regions that fit your life.",
  },
  {
    icon: "🚶",
    title: "Walk Radius Analysis",
    desc: "Visualize a 20-minute walking radius so you truly understand what daily life in a neighborhood feels like.",
  },
];

function About() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1a103a 50%, #0f172a 100%)' }}>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-8 pt-24 pb-16 text-center">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-sm font-medium"
          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}
        >
          ✦ About CityMatch
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
          Move smarter,<br />
          <span className="text-sky-400">not just farther.</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
          CityMatch helps you find the perfect neighborhood — not just a city — by
          matching your lifestyle preferences with real geographic data.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="max-w-5xl mx-auto px-8 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="rounded-2xl p-8"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="text-4xl mb-5">{f.icon}</div>
            <h3 className="text-white font-semibold text-lg mb-3">{f.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Mission bar */}
      <div
        className="max-w-4xl mx-auto mx-8 mb-20 rounded-2xl px-10 py-10 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))',
          border: '1px solid rgba(99,102,241,0.2)',
        }}
      >
        <p className="text-slate-300 text-base leading-relaxed max-w-2xl mx-auto">
          "We believe where you live shapes how you live. CityMatch was built to give
          everyone the tools to make that choice with clarity and confidence."
        </p>
        <p className="mt-4 text-indigo-400 text-sm font-medium">— The CityMatch Team</p>
      </div>
    </div>
  );
}

export default About;
