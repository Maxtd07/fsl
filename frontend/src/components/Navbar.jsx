import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
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

const MotionNav = motion.nav;

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const isHomeAtTop = location.pathname === "/" && !hasScrolled && !isOpen;

  const brandText = (
    <div className="hidden md:flex flex-col leading-tight">
      <span className={`text-[0.55rem] font-bold uppercase tracking-[0.28em] ${isHomeAtTop ? "text-white/85" : "text-text"}`}>
        ASD
      </span>
      <span className={`text-sm font-semibold uppercase tracking-[0.12em] ${isHomeAtTop ? "text-white" : "text-text"}`}>
        Soccer Dream Fermana
      </span>
    </div>
  );

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setHasScrolled(currentScrollY > 40);

          if (currentScrollY < lastScrollY || currentScrollY < 100) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  if (isAdmin && isAuthenticated) {
    return (
      <MotionNav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="fixed top-0 left-0 z-50 mx-0 w-full rounded-b-3xl border-b border-text/10 bg-base py-2 shadow-md"
      >
        <div className="flex items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-4">
            <NavLink
              to="/admin/dashboard"
              className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <img
                src={logo}
                alt="Logo"
                className="h-16 w-auto object-contain md:h-[4.5rem]"
              />
              {brandText}
            </NavLink>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="rounded-lg border border-accent bg-accent/70 px-5 py-3 font-semibold text-text/80 shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition-all duration-200 hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-accent/40 focus-visible:ring-offset-2"
            >
              Esci
            </button>
          </div>

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

        {isOpen && (
          <div className="mt-4 flex flex-col gap-2 px-6 pt-4 lg:hidden">
            <button
              type="button"
              onClick={() => {
                logout();
                setIsOpen(false);
                navigate("/");
              }}
              className="w-full rounded-lg bg-accent px-4 py-3 text-xs font-bold text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition-all duration-200 hover:bg-accent/90"
            >
              Esci
            </button>
          </div>
        )}
      </MotionNav>
    );
  }

  return (
    <MotionNav
      initial={{ y: -100 }}
      animate={{ y: location.pathname === "/" ? 0 : isVisible ? 0 : -100 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`fixed top-0 left-0 z-50 mx-0 mb-6 w-full transition-all duration-300 ${
        isHomeAtTop
          ? "bg-transparent py-3 shadow-none"
          : "border-b border-text/10 bg-base/95 py-2 shadow-md backdrop-blur-md md:rounded-b-3xl"
      }`}
    >
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <NavLink
            to="/"
            className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
          >
            <img
              src={logo}
              alt="Logo"
              className={`w-auto object-contain transition-all duration-300 drop-shadow-lg ${
                isHomeAtTop ? "h-20 md:h-24" : "h-16 md:h-24"
              }`}
            />
            {brandText}
          </NavLink>
        </div>

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
                  isHomeAtTop
                    ? isActive
                      ? "border-white/60 bg-white/15 text-lg font-semibold text-white"
                      : "border-white/25 text-white/90 hover:border-white/50 hover:bg-white/10 hover:text-white"
                    : isActive
                      ? "border-4 border-primary/40 bg-primary/8 text-lg font-semibold text-text"
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
              `${navLinkClasses} px-5 font-semibold ${
                isHomeAtTop
                  ? "border-white/35 bg-white/15 text-white hover:bg-white/25"
                  : "border-accent/40 bg-accent/50 text-text/80 hover:bg-accent/90"
              } ${
                isActive ? "ring-3 ring-accent/40 ring-offset-2" : ""
              }`
            }
          >
            {sostieniLink.label}
          </NavLink>

          <div className={`mx-1 h-6 w-px ${isHomeAtTop ? "bg-white/25" : "bg-text/10"}`} />

          {isAuthenticated ? (
            <>
              <div className="mx-2 h-6 w-px bg-text/10" />
              <div className="rounded-lg border border-primary/30 bg-primary/8 px-4 py-2.5 text-sm font-semibold text-text transition-all duration-200 hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:ring-offset-2">
                {user?.nome}
              </div>
              {isAdmin && (
                <NavLink
                  to="/admin/dashboard"
                  className="rounded-lg border border-primary/30 bg-primary/8 px-4 py-2.5 text-sm font-semibold text-text transition-all duration-200 hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                >
                  Dashboard
                </NavLink>
              )}
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-accent/50 bg-accent/30 px-4 py-2.5 text-xs font-bold text-text transition-all duration-200 hover:bg-accent/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
              >
                Esci
              </button>
            </>
          ) : (
            <NavLink
              to="/accedi"
              className={`rounded-lg border px-4 py-2.5 text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-accent/40 focus-visible:ring-offset-2 lg:p-2 ${
                isHomeAtTop
                  ? "border-white/30 bg-white/15 hover:bg-white/25"
                  : "border-accent/30 bg-primary/80 hover:bg-primary"
              }`}
              aria-label="Accedi alla tua area"
            >
              <FontAwesomeIcon icon={faUser} className="text-lg" />
            </NavLink>
          )}
        </nav>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40 lg:hidden ${
            isHomeAtTop
              ? "border-white/35 bg-black/15 backdrop-blur-sm"
              : "border-primary/15 bg-background/90 shadow-sm"
          }`}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
            <span
            className={`h-0.5 w-6 transition-all origin-center duration-300 ${isHomeAtTop ? "bg-white" : "bg-text"} ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 duration-300 ${isHomeAtTop ? "bg-white" : "bg-text"} ${isOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 transition-all origin-center duration-300 ${isHomeAtTop ? "bg-white" : "bg-text"} ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <nav className="mx-4 mt-3 flex flex-col gap-2 rounded-2xl border border-text/10 bg-base/97 px-4 py-4 shadow-xl backdrop-blur-md lg:hidden">
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
            className="rounded-lg border border-accent/40 bg-accent px-4 py-3 text-center text-sm font-semibold text-text transition-all duration-200 hover:bg-accent/90"
          >
            {sostieniLink.label}
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/accedi"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-primary/30 bg-primary/8 px-4 py-2 text-center text-sm font-semibold text-text transition-all duration-200 hover:bg-primary/12"
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
                className="rounded-lg border border-accent/40 bg-accent/50 px-5 font-semibold text-text/80 transition-all duration-200 hover:bg-accent/90"
              >
                Esci
              </button>
            </>
          ) : (
            <NavLink
              to="/accedi"
              onClick={() => setIsOpen(false)}
              className="rounded-lg border border-accent/30 bg-primary/80 px-4 py-3 text-center text-white transition-all duration-200 hover:bg-accent/90"
              aria-label="Accedi alla tua area"
            >
              <FontAwesomeIcon icon={faUser} className="text-lg" />
            </NavLink>
          )}
        </nav>
      )}
    </MotionNav>
  );
}

export default Navbar;
