const navItems = [
  { key: 'home', label: 'Home' },
  { key: 'galleria', label: 'Galleria' },
  { key: 'about', label: 'Chi siamo' },
  { key: 'donazioni', label: 'Donazioni' },
  { key: 'contatti', label: 'Contatti' },
]

function Navbar({ currentPage }) {
  return (
    <nav className="flex flex-wrap gap-3" aria-label="Main navigation">
      {navItems.map((item) => (
        <a
          key={item.key}
          href={`#/${item.key}`}
          className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
            item.key === currentPage
              ? 'border-slate-800 bg-slate-800 text-white'
              : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
          }`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}

export default Navbar
