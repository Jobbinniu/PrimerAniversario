import React, { useState, useEffect, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, Calendar, ImagePlus, Heart, Feather } from 'lucide-react';

const COLORS = {
  aliceBlue: '#E2ECF5',
  wisteriaBlue: '#A4A7E3',
  majorelleBlue: '#6A4DD4',
  velvetOrchid: '#6E3377',
  prussianBlue: '#000229',
};

const HERO = {
  title: 'Feliz aniversario',
  subtitle: 'nuestro primer añito',
};

const DATES = [
  { id: 'd1', label: 'Nuestro aniversario', date: '2025-09-18' },
  { id: 'd2', label: 'Nos vemos', date: '2027-01-08' },
];

const DATE_THEMES = [
  { bg: COLORS.aliceBlue, heading: COLORS.majorelleBlue, counter: COLORS.velvetOrchid, muted: 'rgba(0,2,41,0.6)', ring: 'rgba(106,77,212,0.25)' },
  { bg: COLORS.velvetOrchid, heading: COLORS.aliceBlue, counter: COLORS.aliceBlue, muted: 'rgba(226,236,245,0.78)', ring: 'rgba(255,255,255,0.2)' },
];

const LETTER = `¡Feliz aniversario, mi niño hermoso! Quién diría lo rápido que llegó este día. Parece que fue ayer el día en el que entraste a mi stream, o esa noche que nos quedamos hasta las 5 a. m. hablando de la vida y conociéndonos más a fondo. Que este año pasará rápido no significa que minimice todo lo que hemos vivido; genuinamente te debo agradecer por hacerme sentir tan amada y acompañada, incluso en esos días en los que ni yo me soporto, o en esas noches en las que me enojo por tonteras.

Cuando digo que eres todo lo que siempre soñé, lo digo muy en serio; amo todo de ti, el cómo escuchas, cómo ayudas, el cómo me hablas bonito, tus bromas que no comprendo del todo, tu paciencia, tu carita linda, esos ojitos por los que me derrito cada vez que los veo, tus abracitos apretados, cómo se siente tu cuerpo cuando está junto al mío, los besitos lindos que me das. Esas son algunas de las cosas, ya que si no, jamás terminaría de nombrarlas todas.

¿Cómo no mencionar el día en el que llegaste? Creo que mi corazón hubiera saltado de mi pecho si pudiera. Cuando por fin llegaste y te vi, no sabía qué más hacer de la emoción, solo quería abrazarte y no soltarte nunca más (me arrepiento de soltarte y dejarte ir). A diario recuerdo ese besito todo nervioso y lo nerviosa que estaba.

Extraño con locura tus besitos y tenerte aquí conmigo; créeme que si hubiera podido, me subía a ese avión contigo sin importarme lo demás, ya que tendría a lo único que necesito… a ti.

Créeme que pelearé y me esforzaré todo lo que sea necesario para que este primer añito se convierta en muchísimos más; hay una cantidad enorme de cosas que ansío hacer contigo. Cómo vivir juntos, viajar, tener citas (muchas), hacernos desayunos los domingos, reírnos de los niños que se caen en la calle, amarte todos los días, pelar (incluso eso), reír juntos, mirar esos ojitos por el resto de mi vida, casarnos, tener unos mini tú, etc.

Quiero que entiendas que eres la persona más importante en mi vida y que deseo hacer todo mientras lo haga contigo.

Te quiero, te adoro, te amo.

Y sí… yo te amo más.

Con todo el amor del universo, esta niña que solo tiene ojitos para ti.

J.`;

const IMAGES = [
  { id: 'img_1', src: `${import.meta.env.BASE_URL}12_julio_2026.jpeg`,   date: '2026-07-12' },
  { id: 'img_2', src: `${import.meta.env.BASE_URL}13_julio_2026.jpeg`,   date: '2026-07-13' },
  { id: 'img_3', src: `${import.meta.env.BASE_URL}17_julio_2026.jpeg`,   date: '2026-07-17' },
  { id: 'img_4', src: `${import.meta.env.BASE_URL}18_julio_2026.jpeg`,   date: '2026-07-18' },
  { id: 'img_5', src: `${import.meta.env.BASE_URL}18_julio_2026_2.jpeg`, date: '2026-07-18' },
  { id: 'img_6', src: `${import.meta.env.BASE_URL}22_julio_2026.jpeg`,   date: '2026-07-22' },
  { id: 'img_7', src: `${import.meta.env.BASE_URL}26_julio_2026.jpeg`,   date: '2026-07-26' },
  { id: 'img_8', src: `${import.meta.env.BASE_URL}27_julio_2026.jpeg`,   date: '2026-07-27' },
  { id: 'img_9', src: `${import.meta.env.BASE_URL}27_julio_2026_2.jpeg`, date: '2026-07-27' },
];

function getCounterParts(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today - target) / 86400000);
  if (diffDays === 0) return { isToday: true };
  const isPast = diffDays > 0;
  const n = Math.abs(diffDays);
  return { isToday: false, isPast, number: n, unit: n === 1 ? 'día' : 'días' };
}

function formatShortDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatCardDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

function getPhotoRotation(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % 1000;
  return (hash % 7) - 3;
}

export default function NuestraHistoria() {
  const [lightboxId, setLightboxId] = useState(null);

  const lightboxIndex = IMAGES.findIndex((i) => i.id === lightboxId);
  const navigateLightbox = (dir) => {
    if (lightboxIndex === -1 || IMAGES.length === 0) return;
    const nextIndex = (lightboxIndex + dir + IMAGES.length) % IMAGES.length;
    setLightboxId(IMAGES[nextIndex].id);
  };

  useEffect(() => {
    if (!lightboxId) return;
    const handler = (e) => {
      if (e.key === 'Escape') setLightboxId(null);
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxId]);

  const stars = useMemo(() => Array.from({ length: 24 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: 6 + Math.random() * 9,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
  })), []);

  const lightboxImg = lightboxId ? IMAGES.find((i) => i.id === lightboxId) : null;

  return (
    <div style={{ minHeight: '100vh', position: 'relative', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,400;1,600&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .serif { font-family: 'Playfair Display', serif; }
        @keyframes twinkle { 0%, 100% { opacity: 0.12; transform: scale(0.75); } 50% { opacity: 0.85; transform: scale(1.1); } }
        .star { position: absolute; color: ${COLORS.wisteriaBlue}; animation-name: twinkle; animation-iteration-count: infinite; animation-timing-function: ease-in-out; pointer-events: none; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.7s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .star { animation: none; opacity: 0.35; }
          .fade-up { animation: none; }
        }
        .album-card { position: relative; background: ${COLORS.aliceBlue}; border-radius: 6px; padding: 10px 10px 14px; border: none; cursor: pointer; box-shadow: 0 8px 20px rgba(0,2,41,0.35); transition: transform 0.25s ease, box-shadow 0.25s ease; display: flex; flex-direction: column; }
        .album-card:hover { transform: rotate(0deg) scale(1.05) !important; box-shadow: 0 16px 32px rgba(0,2,41,0.5); z-index: 5; }
        .album-photo { width: 100%; aspect-ratio: 1 / 1; border-radius: 2px; overflow: hidden; background: rgba(0,2,41,0.08); }
        .album-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .album-caption { padding-top: 8px; text-align: center; }
        .album-caption-date { font-family: 'Inter', sans-serif; font-size: 0.68rem; letter-spacing: 0.05em; text-transform: uppercase; color: ${COLORS.velvetOrchid}; font-weight: 600; opacity: 0.9; }
        .lightbox-overlay { position: fixed; inset: 0; background: rgba(0,2,41,0.92); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 20px; }
        .lightbox-content { position: relative; max-width: 540px; width: 100%; max-height: 90vh; overflow-y: auto; background: rgba(226,236,245,0.08); border: 1px solid rgba(226,236,245,0.18); border-radius: 20px; padding: 20px; backdrop-filter: blur(12px); }
        .icon-btn { width: 38px; height: 38px; border-radius: 999px; background: rgba(255,255,255,0.14); border: none; color: ${COLORS.aliceBlue}; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.15s ease; flex-shrink: 0; }
        .icon-btn:hover { background: rgba(255,255,255,0.26); }
        .section-title { font-family: 'Playfair Display', serif; font-weight: 700; font-size: clamp(1.35rem, 4vw, 1.75rem); color: ${COLORS.aliceBlue}; display: flex; align-items: center; gap: 10px; }
        .letter-card { position: relative; background: rgba(226,236,245,0.96); border-radius: 24px; padding: 44px 32px 36px; box-shadow: 0 16px 40px rgba(0,2,41,0.35); overflow: hidden; }
        .letter-quote { position: absolute; top: -10px; left: 18px; font-family: 'Playfair Display', serif; font-size: 5.5rem; color: ${COLORS.wisteriaBlue}; opacity: 0.4; line-height: 1; pointer-events: none; }
        .letter-text { position: relative; font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.05rem; line-height: 1.8; white-space: pre-wrap; color: ${COLORS.prussianBlue}; }
        .song-card { background: rgba(226,236,245,0.08); border: 1px solid rgba(226,236,245,0.18); border-radius: 20px; padding: 24px; backdrop-filter: blur(10px); }
        audio { accent-color: ${COLORS.majorelleBlue}; }
        button:focus-visible { outline: 2px solid ${COLORS.wisteriaBlue}; outline-offset: 2px; }
      `}</style>

      {/* Fondo degradado romántico */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: `radial-gradient(circle at 50% -5%, rgba(164,167,227,0.32), transparent 55%),
                     radial-gradient(circle at 8% 92%, rgba(110,51,119,0.5), transparent 50%),
                     radial-gradient(circle at 95% 65%, rgba(106,77,212,0.35), transparent 50%),
                     ${COLORS.prussianBlue}`,
      }} />

      {/* Estrellitas titilantes */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        {stars.map((s) => (
          <Sparkles
            key={s.id}
            className="star"
            size={s.size}
            style={{ top: `${s.top}%`, left: `${s.left}%`, animationDelay: `${s.delay}s`, animationDuration: `${s.duration}s` }}
          />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 880, margin: '0 auto', padding: '52px 20px 72px' }}>
        {/* Encabezado */}
        <header className="fade-up" style={{ textAlign: 'center', marginBottom: 52 }}>
          <Sparkles style={{ color: COLORS.wisteriaBlue }} size={26} />
          <h1
            className="serif"
            style={{
              color: COLORS.aliceBlue,
              fontWeight: 800,
              fontSize: 'clamp(2rem, 6vw, 3.4rem)',
              marginTop: 10,
              textShadow: '0 4px 30px rgba(106,77,212,0.45)',
            }}
          >
            {HERO.title}
          </h1>
          <p
            style={{
              color: COLORS.wisteriaBlue,
              fontSize: 'clamp(1rem, 2.8vw, 1.25rem)',
              marginTop: 12,
              letterSpacing: '0.04em',
              fontWeight: 500,
            }}
          >
            {HERO.subtitle}
          </p>
        </header>

        {/* Fechas importantes */}
        <section className="fade-up" style={{ marginBottom: 60 }}>
          <h2 className="section-title"><Calendar size={22} />Fechas importantes</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 22 }}>
            {DATES.map((d, i) => {
              const theme = DATE_THEMES[i % DATE_THEMES.length];
              const counter = getCounterParts(d.date);
              return (
                <div key={d.id} style={{ background: theme.bg, borderRadius: 20, padding: '26px 20px', border: `1px solid ${theme.ring}`, boxShadow: '0 12px 32px rgba(0,2,41,0.35)', textAlign: 'center' }}>
                  <div
                    className="serif"
                    style={{ color: theme.heading, fontWeight: 700, fontSize: '1.1rem' }}
                  >
                    {d.label}
                  </div>
                  {!counter && (
                    <div style={{ color: theme.muted, fontSize: '0.8rem', marginTop: 16, fontStyle: 'italic' }}>Sin fecha todavía</div>
                  )}
                  {counter && counter.isToday && (
                    <div className="serif" style={{ color: theme.counter, fontWeight: 800, fontSize: '1.7rem', marginTop: 16 }}>¡Es hoy! 🎉</div>
                  )}
                  {counter && !counter.isToday && (
                    <div style={{ marginTop: 16 }}>
                      <div className="serif" style={{ color: theme.counter, fontWeight: 800, fontSize: 'clamp(2.6rem, 9vw, 3.4rem)', lineHeight: 1 }}>{counter.number}</div>
                      <div style={{ color: theme.muted, fontSize: '0.85rem', marginTop: 4 }}>{counter.unit} {counter.isPast ? 'desde entonces' : 'para llegar'}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Carta */}
        <section className="fade-up" style={{ marginBottom: 60 }}>
          <h2 className="section-title"><Feather size={22} />Una carta para ti</h2>
          <div className="letter-card" style={{ marginTop: 22 }}>
            <span className="letter-quote" aria-hidden="true">“</span>
            <div className="letter-text">
              {LETTER}
            </div>
          </div>
        </section>

        {/* Canción */}
        <section className="fade-up" style={{ marginBottom: 60 }}>
          <h2 className="section-title"><Heart size={22} fill={COLORS.wisteriaBlue} />Una canción para ti</h2>
          <div className="song-card" style={{ marginTop: 22 }}>
            <audio
              controls
              src={`${import.meta.env.BASE_URL}honey_bee.mp3`}
              style={{ width: '100%', display: 'block', borderRadius: 10 }}
            >
              Tu navegador no soporta audio.
            </audio>
          </div>
        </section>

        {/* Galería */}
        <section className="fade-up">
          <h2 className="section-title"><ImagePlus size={22} />Nuestros recuerdos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 16, marginTop: 26 }}>
            {IMAGES.map((img) => (
              <button
                key={img.id}
                className="album-card"
                onClick={() => setLightboxId(img.id)}
                aria-label="Ver foto"
                style={{ transform: `rotate(${getPhotoRotation(img.id)}deg)` }}
              >
                <div className="album-photo">
                  <img src={img.src} alt="Recuerdo de nosotros" />
                </div>
                {img.date && (
                  <div className="album-caption">
                    <div className="album-caption-date">{formatCardDate(img.date)}</div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        <footer className="fade-up" style={{ textAlign: 'center', marginTop: 64, color: COLORS.wisteriaBlue, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: 0.85 }}>
          Un regalo que sigue creciendo <Heart size={14} fill={COLORS.wisteriaBlue} />
        </footer>
      </div>

      {/* Lightbox para ver fotos en grande */}
      {lightboxImg && (
        <div className="lightbox-overlay" onClick={() => setLightboxId(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ color: COLORS.aliceBlue, fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.04em' }}>
                {formatShortDate(lightboxImg.date)}
              </div>
              <button className="icon-btn" onClick={() => setLightboxId(null)} aria-label="Cerrar"><X size={18} /></button>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {IMAGES.length > 1 && (
                <button className="icon-btn" style={{ position: 'absolute', left: 8, zIndex: 2 }} onClick={() => navigateLightbox(-1)} aria-label="Anterior"><ChevronLeft size={20} /></button>
              )}
              <img
                src={lightboxImg.src}
                alt="Recuerdo en grande"
                style={{ maxWidth: '100%', maxHeight: '68vh', objectFit: 'contain', borderRadius: 12, display: 'block' }}
              />
              {IMAGES.length > 1 && (
                <button className="icon-btn" style={{ position: 'absolute', right: 8, zIndex: 2 }} onClick={() => navigateLightbox(1)} aria-label="Siguiente"><ChevronRight size={20} /></button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
