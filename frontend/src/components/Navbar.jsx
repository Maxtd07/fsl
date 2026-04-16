import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/useAuth.js";

import logo from "../assets/logo.png";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/chi-siamo", label: "Chi siamo" },
  { to: "/eventi", label: "Eventi" },
  { to: "/galleria", label: "Galleria" },
  { to: "/contatti", label: "Contatti" },
];

const sostieniLink = { to: "/donazioni", label: "Sostienici" };

const navLinkClasses =
  "rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:ring-offset-2";

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout, user } = useAuth();

  // Se admin, mostra navbar semplificata
  if (isAdmin && isAuthenticated) {
    return (
      <nav className="rounded-lg border border-text/10 bg-base shadow-md lg:px-6 px-5 py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <NavLink
              to="/admin/dashboard"
              className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <img
                src={logo}
                alt="Logo"
                className="h-28 w-auto object-contain"
              />
            </NavLink>
          </div>

          {/* Desktop - Solo Esci */}
          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="rounded-lg bg-accent px-4 py-2.5 text-xs font-bold text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition-all duration-200 hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-accent/40 focus-visible:ring-offset-2"
            >
              Esci
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col gap-1.5 rounded-lg p-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <span
              className={`h-0.5 w-6 bg-text transition-all origin-center duration-300 ${
                isOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-text transition-opacity duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-text transition-all origin-center duration-300 ${
                isOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Navigation - Solo Esci */}
        {isOpen && (
          <div className="mt-6 flex flex-col gap-2 border-t border-text/10 pt-4 lg:hidden">
            <button
              type="button"
              onClick={() => {
                logout();
                setIsOpen(false);
                navigate("/");
              }}
              className="rounded-lg bg-accent px-4 py-3 text-xs font-bold text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition-all duration-200 hover:bg-accent/90 w-full"
            >
              Esci
            </button>
          </div>
        )}
      </nav>
    );
  }

  // Navbar normale per utenti non-admin
  return (
    <nav className="rounded-lg border border-text/10 bg-base shadow-md lg:px-6 px-5 py-6">
      <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <NavLink
            to="/"
            className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
          >
            <img src={logo} alt="Logo" className="h-28 w-auto object-contain" />
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center justify-center gap-2 lg:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${navLinkClasses} ${
                  isActive
                    ? "border-primary/40 bg-primary/8 text-text border-4 text-lg font-semibold"
                    : "border-text/10 text-text/75 hover:border-primary/20 hover:bg-primary/5 hover:text-text"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to={sostieniLink.to}
            className={({ isActive }) =>
              `${navLinkClasses} border-accent/40 bg-accent/50 px-5 text-text/80 font-semibold hover:bg-accent/90 ${
                isActive ? "ring-3 ring-accent/40 ring-offset-2" : ""
              }`
            }
          >
            {sostieniLink.label}
          </NavLink>

          {/* Divisore */}
          <div className="mx-1 h-6 w-px bg-text/10" />

          {/* Auth Section Desktop */}
          {isAuthenticated ? (
            <>
              <div className="mx-2 h-6 w-px bg-text/10" />
              <NavLink
                to="/accedi"
                className="rounded-lg border border-secondary/30 bg-secondary/8 px-4 py-2.5 text-xs font-semibold text-secondary transition-all duration-200 hover:bg-secondary/12 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-secondary/40 focus-visible:ring-offset-2"
              >
                {user?.nome}
              </NavLink>
              {isAdmin && (
                <NavLink
                  to="/admin/dashboard"
                  className="rounded-lg border border-primary/30 bg-primary/8 px-4 py-2.5 text-xs font-semibold text-primary transition-all duration-200 hover:bg-primary/12 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                >
                  Dashboard
                </NavLink>
              )}
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-text/20 px-4 py-2.5 text-xs font-semibold text-text transition-all duration-200 hover:bg-text/5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
              >
                Esci
              </button>
            </>
          ) : (
            <NavLink
              to="/accedi"
              className="rounded-lg border border-accent/30 bg-primary/80 px-4 py-2.5 text-white transition-all duration-200 hover:bg-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-accent/40 focus-visible:ring-offset-2 lg:p-2"
              title="Accedi"
            >
              <FontAwesomeIcon icon={faUser} className="text-lg" />
            </NavLink>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col gap-1.5 rounded-lg p-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span
            className={`h-0.5 w-6 bg-text transition-all origin-center duration-300 ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-text transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-text transition-all origin-center duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="mt-6 flex flex-col gap-2 border-t border-text/10 pt-4 lg:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${navLinkClasses} text-center ${
                  isActive
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-text/10 text-text/75 hover:bg-primary/5"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div className="my-2 h-px w-full bg-text/10" />

          <NavLink
            to={sostieniLink.to}
            onClick={() => setIsOpen(false)}
            className="rounded-lg border border-accent/40 bg-accent px-4 py-3 text-center text-xs font-semibold text-white transition-all duration-200 hover:bg-accent/90"
          >
            {sostieniLink.label}
          </NavLink>

          {/* Auth Section Mobile */}
          {isAuthenticated ? (
            <>
              <NavLink
                to="/accedi"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-secondary/30 bg-secondary/8 px-4 py-3 text-center text-xs font-semibold text-secondary transition-all duration-200 hover:bg-secondary/12"
              >
                {user?.nome}
              </NavLink>
              {isAdmin && (
                <NavLink
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-primary/30 bg-primary/8 px-4 py-3 text-center text-xs font-semibold text-primary transition-all duration-200 hover:bg-primary/12"
                >
                  Dashboard
                </NavLink>
              )}
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="rounded-lg border border-text/20 px-4 py-3 text-xs font-semibold text-text transition-all duration-200 hover:bg-text/5"
              >
                Esci
              </button>
            </>
          ) : (
            <NavLink
              to="/accedi"
              onClick={() => setIsOpen(false)}
              className="rounded-lg border border-accent/30 bg-accent px-4 py-3 text-center text-white transition-all duration-200 hover:bg-accent/90"
              title="Accedi"
            >
              <FontAwesomeIcon icon={faUser} className="text-lg" />
            </NavLink>
          )}
        </nav>
      )}
    </nav>
  );
}

export default Navbar;
