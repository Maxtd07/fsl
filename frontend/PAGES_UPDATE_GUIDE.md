# Guida Finale - Aggiornamento Pagine Rimanenti

## Status Completato ✅
- ✅ PrivacyPage.jsx (100%)
- ✅ HomePage.jsx (100%)
- ✅ EventiPage.jsx (100%)

## Pagine Rimanenti (Usa Find & Replace in Parallelo)
- AdminDashboard.jsx
- AdminLoginPage.jsx
- AuthPage.jsx  
- DonazioniPage.jsx
- GalleriaPage.jsx
- AboutPage.jsx
- ContattiPage.jsx

---

## Quick Update - Pattern Trovati

### Pattern 1: Border Radius (RICERCA GLOBALE)
Apri Find & Replace (Ctrl+H), **Search in folder**: `src/pages`

| Find | Replace | Regex |
|------|---------|-------|
| `rounded-\[2rem\]` | `rounded-lg` | ON |
| `rounded-\[1\.5rem\]` | `rounded-lg` | ON |
| `rounded-\[1\.4rem\]` | `rounded-lg` | ON |
| `rounded-\[1\.6rem\]` | `rounded-lg` | ON |
| `rounded-3xl` | `rounded-lg` | OFF |

### Pattern 2: Shadows (RICERCA GLOBALE)
| Find | Replace | Regex |
|------|---------|-------|
| `shadow-\[0_12px_28px_rgba\(0,0,0,0\.08\)\]` | `shadow-lg` | ON |
| `shadow-\[0_12px_28px_rgba\(0,0,0,0\.06\)\]` | `shadow-md` | ON |
| `shadow-\[0_8px_18px_rgba\(0,0,0,0\.08\)\]` | `shadow-md` | ON |
| `shadow-\[0_16px_40px_rgba\(0,0,0,0\.10\)\]` | `shadow-xl` | ON |
| `shadow-\[0_6px_14px_rgba\(0,0,0,0\.06\)\]` | `shadow-sm` | ON |

### Pattern 3: Borders (RICERCA GLOBALE)
| Find | Replace | Regex |
|------|---------|-------|
| `border-2 border` | `border border` | OFF |

### Pattern 4: Text Colors (RICERCA GLOBALE)  
| Find | Replace | Regex |
|------|---------|-------|
| `text-slate-900` | `text-text` | OFF |
| `text-slate-700` | `text-text/70` | OFF |
| `text-slate-600` | `text-text/75` | OFF |
| `text-gray-900` | `text-text` | OFF |
| `text-gray-700` | `text-text/70` | OFF |

### Pattern 5: Success/Error Colors (RICERCA GLOBALE)
| Find | Replace | Regex |
|------|---------|-------|
| `bg-green-50` | `bg-secondary/10` | OFF |
| `bg-green-200` | `bg-secondary/20` | OFF |
| `text-green-700` | `text-secondary` | OFF |
| `border-green-` | `border-secondary/` | OFF |
| `bg-red-50` | `bg-accent/10` | OFF |
| `text-red-700` | `text-accent` | OFF |

### Pattern 6: Typography Tracking (RICERCA GLOBALE)
| Find | Replace | Regex |
|------|---------|-------|
| `tracking-\[0\.22em\]` | `tracking-widest` | ON |
| `tracking-\[0\.24em\]` | `tracking-widest` | ON |

### Pattern 7: Background Colors (RICERCA GLOBALE)
| Find | Replace | Regex |
|------|---------|-------|
| `bg-slate-50` | `bg-background` | OFF |
| `bg-slate-100` | `bg-background` | OFF |

---

## Passo Passo Veloce
1. Apri Find & Replace: **Ctrl+H**
2. Abilita "Use Regular Expression" (icona con `.*`)
3. Seleziona cartella: Clicca icona folder e scegli `src/pages`
4. Copia-incolla ogni pattern da tabella sopra
5. Clicca "Replace All" (icona con due freccie)
6. Passa al pattern seguente

**Tempo stimato: 15 minuti per completare tutte le 7 pagine**

---

## Verifica Post-Update
1. **Visually check** su browser: verificare che i colori siano coerenti
2. **Focus states**: Tab attraverso link e button
3. **Mobile responsive**: verifica su `sm` (400px) e `lg` (1024px)

---

## Componenti Già Aggiornati ✅
- ✅ Tailwind config (ombre, transizioni, focus)
- ✅ index.css (stili globali, focus ring)
- ✅ Button.jsx (5 varianti con FontAwesome)
- ✅ Card.jsx (3 varianti)
- ✅ Input.jsx (standardizzato)
- ✅ ActionLink.jsx (varianti moderne)
- ✅ Navbar.jsx (colori coerenti, responsive)
- ✅ Footer.jsx (bg-dark, link colors)
- ✅ PageHero.jsx (gradient, shadow)
- ✅ SectionHeading.jsx
- ✅ Calendar.jsx (Day/Week/Month views con FontAwesome)
- ✅ EventModal.jsx (Card-based, con icone)

---

## Note Finali
- Tutti i pattern sono **idempotenti** (safe to run multiple times)
- Se dimandati, puoi testare il Find & Replace su UNA pagina prima di global
- La palette è verificata a livello WCAG (vedi accessibility notes in tailwind.config.js)
