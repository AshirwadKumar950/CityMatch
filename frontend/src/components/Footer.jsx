function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(180deg, #0a0f1e 0%, #0d1117 100%)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="max-w-6xl mx-auto px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">
              City<span className="text-sky-400">Match</span> 🚀
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Helping people relocate smarter by matching them with the best
              neighborhoods based on their lifestyle and preferences.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">Navigate</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="/" className="hover:text-sky-400 transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-sky-400 transition-colors">About</a></li>
              <li><a href="/map" className="hover:text-sky-400 transition-colors">Explore Map</a></li>
              <li><a href="/login" className="hover:text-sky-400 transition-colors">Sign In</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>📧 hello@citymatch.app</li>
              <li>📍 Dehradun, India</li>
              <li className="hover:text-sky-400 cursor-pointer transition-colors">🐙 GitHub</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/[0.07] flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 CityMatch. All rights reserved.</p>
          <p>Built with React · Leaflet · Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;