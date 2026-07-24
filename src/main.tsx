import { StrictMode, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  CircleHelp,
  Clock3,
  Compass,
  Crosshair,
  Expand,
  Flag,
  Layers3,
  Menu,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Shield,
  Sparkles,
  Swords,
  Users,
  X,
} from 'lucide-react'
import { catalog, waterloo } from './data'
import type { BattleCategory, Position, Unit } from './types'
import './styles.css'

const categoryMeta: Record<BattleCategory, { icon: typeof Clock3; label: string; description: string }> = {
  Historical: { icon: Clock3, label: 'Historical', description: 'Battles that shaped our world' },
  Fantasy: { icon: Shield, label: 'Fantasy', description: 'Clashes from legendary realms' },
  'Science Fiction': { icon: Sparkles, label: 'Science Fiction', description: 'Conflicts beyond our world' },
}

function navigate(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <button className="brand" onClick={() => navigate('/')} aria-label="Battle Atlas home">
      <span className="brand-mark"><Compass size={compact ? 19 : 22} strokeWidth={1.5} /></span>
      <span>BATTLE <b>ATLAS</b></span>
    </button>
  )
}

function Header({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <header className={`site-header ${dark ? 'site-header--dark' : ''}`}>
      <Brand compact />
      <nav className={open ? 'nav nav--open' : 'nav'} aria-label="Primary navigation">
        <button onClick={() => navigate('/')}>Explore</button>
        <button onClick={() => document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth' })}>Archive</button>
        <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>About</button>
      </nav>
      <button className="icon-button mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
    </header>
  )
}

function HomePage() {
  const [category, setCategory] = useState<BattleCategory | 'All'>('All')
  const [notice, setNotice] = useState('')
  const featured = catalog[0]
  const filtered = category === 'All' ? catalog : catalog.filter((battle) => battle.category === category)

  function selectBattle(available: boolean, title: string) {
    if (available) navigate('/battles/waterloo')
    else {
      setNotice(`${title} is being mapped. Join the expedition soon.`)
      window.setTimeout(() => setNotice(''), 2800)
    }
  }

  return (
    <main className="home">
      <div className="hero">
        <Header />
        <div className="hero-cartography" aria-hidden="true">
          <span className="contour contour-a" />
          <span className="contour contour-b" />
          <span className="contour contour-c" />
          <span className="route-line" />
          <span className="map-label label-one">RIDGE OF MONT-ST-JEAN</span>
          <span className="map-label label-two">LA BELLE ALLIANCE</span>
        </div>
        <section className="hero-content">
          <div className="eyebrow"><span /> HISTORY, MAPPED IN MOTION</div>
          <h1>Every battle<br />has a <em>story.</em></h1>
          <p>Step onto the field. Follow every movement. Understand the decisions that changed the course of history.</p>
          <button className="primary-button" onClick={() => navigate('/battles/waterloo')}>
            Explore the atlas <ArrowRight size={17} />
          </button>
          <div className="hero-stat">
            <strong>01</strong>
            <span><b>Battle mapped</b><br />New expeditions added regularly</span>
          </div>
        </section>
        <div className="scroll-cue"><span /> SCROLL TO EXPLORE</div>
      </div>

      <section className="intro-section" id="about">
        <div className="section-kicker">THE ARCHIVE</div>
        <div className="intro-grid">
          <h2>Explore conflict<br />across <em>every world.</em></h2>
          <p>From ancient fields to distant stars, Battle Atlas transforms complex conflicts into clear, immersive stories. Choose a theater to begin.</p>
        </div>
        <div className="category-grid">
          {(Object.entries(categoryMeta) as [BattleCategory, (typeof categoryMeta)[BattleCategory]][]).map(([name, meta], index) => {
            const Icon = meta.icon
            return (
              <button className="category-card" key={name} onClick={() => { setCategory(name); document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth' }) }}>
                <span className="category-number">0{index + 1}</span>
                <span className="category-icon"><Icon size={25} strokeWidth={1.4} /></span>
                <strong>{meta.label}</strong>
                <small>{meta.description}</small>
                <ChevronRight className="category-arrow" size={19} />
              </button>
            )
          })}
        </div>
      </section>

      <section className="featured-section">
        <div className="featured-visual">
          <div className="featured-map-lines" />
          <span className="map-town town-one">WATERLOO</span>
          <span className="map-town town-two">PLANCENOIT</span>
          <span className="featured-unit allied"><span>III</span></span>
          <span className="featured-unit french"><span>I</span></span>
          <span className="featured-path" />
          <button className="round-play" onClick={() => navigate('/battles/waterloo')} aria-label="Replay Waterloo"><Play fill="currentColor" size={20} /></button>
        </div>
        <div className="featured-copy">
          <div className="section-kicker light">FEATURED EXPEDITION</div>
          <span className="featured-era">EUROPE · 1815</span>
          <h2>{featured.title}</h2>
          <p>One final gamble. Three armies. A rain-soaked field that would decide the fate of Europe.</p>
          <div className="featured-facts">
            <span><small>DATE</small><b>18 June 1815</b></span>
            <span><small>LOCATION</small><b>Waterloo, Belgium</b></span>
            <span><small>OUTCOME</small><b>Coalition victory</b></span>
          </div>
          <button className="text-button light" onClick={() => navigate('/battles/waterloo')}>Enter the battlefield <ArrowRight size={16} /></button>
        </div>
      </section>

      <section className="archive-section" id="archive">
        <div className="archive-heading">
          <div><div className="section-kicker">BROWSE THE ATLAS</div><h2>Choose an expedition</h2></div>
          <div className="filters" role="group" aria-label="Filter battles">
            {(['All', ...Object.keys(categoryMeta)] as Array<BattleCategory | 'All'>).map((item) => (
              <button className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)}>
                {item === 'Science Fiction' ? 'Sci-Fi' : item}
              </button>
            ))}
          </div>
        </div>
        <div className="battle-list">
          {filtered.map((battle, index) => (
            <button className={`battle-row ${battle.available ? 'available' : ''}`} key={battle.title} onClick={() => selectBattle(battle.available, battle.title)}>
              <span className="battle-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="battle-name"><strong>{battle.title}</strong><small>{battle.location}</small></span>
              <span className="battle-category">{battle.category}</span>
              <span className="battle-year">{battle.year}</span>
              <span className="battle-status">{battle.available ? 'EXPLORE' : 'COMING SOON'} <ArrowRight size={15} /></span>
            </button>
          ))}
        </div>
      </section>
      <footer>
        <Brand compact />
        <p>Explore the moments that changed everything.</p>
        <span>© 2026 BATTLE ATLAS</span>
      </footer>
      {notice && <div className="toast" role="status">{notice}</div>}
    </main>
  )
}

function interpolateUnit(unit: Unit, progress: number): Position {
  const nextIndex = unit.path.findIndex((point) => point.at >= progress)
  if (nextIndex <= 0) return unit.path[0]
  const next = unit.path[nextIndex]
  const previous = unit.path[nextIndex - 1]
  const local = (progress - previous.at) / Math.max(1, next.at - previous.at)
  return {
    x: previous.x + (next.x - previous.x) * local,
    y: previous.y + (next.y - previous.y) * local,
  }
}

function TacticalMap({ progress, selectedUnit, onSelectUnit }: { progress: number; selectedUnit: string | null; onSelectUnit: (id: string | null) => void }) {
  const [zoom, setZoom] = useState(1)
  const currentEvent = [...waterloo.events].reverse().find((event) => event.at <= progress)

  return (
    <div className="tactical-map" onClick={() => onSelectUnit(null)}>
      <div className="terrain" style={{ transform: `scale(${zoom})` }}>
        <svg className="map-svg" viewBox="0 0 1000 680" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <pattern id="grain" width="9" height="9" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r=".7" fill="#1d211b" opacity=".2" />
            </pattern>
          </defs>
          <path className="forest" d="M0 70 Q170 10 294 95 T530 80 Q750 -5 1000 95 L1000 0 L0 0Z" />
          <path className="forest forest-two" d="M760 680 Q790 530 1000 490 L1000 680Z" />
          <path className="ridge" d="M30 245 C220 180 350 230 520 197 S800 220 990 150" />
          <path className="road" d="M438 700 C450 590 430 510 466 420 S445 245 475 -20" />
          <path className="road minor" d="M1000 565 C770 550 625 500 475 427 S230 380 -10 410" />
          <path className="stream" d="M830 690 C770 580 820 500 730 422 S680 250 720 -10" />
          <path className="contour-path" d="M-20 150 C170 80 250 160 410 114 S730 120 1020 48" />
          <path className="contour-path" d="M-20 194 C160 125 282 204 430 157 S760 162 1020 88" />
          <path className="contour-path" d="M-20 540 C210 470 290 560 490 510 S800 525 1020 420" />
          <path className="contour-path" d="M-20 588 C220 515 310 610 520 558 S820 570 1020 470" />
          <rect width="1000" height="680" fill="url(#grain)" />
        </svg>
        <span className="place-label waterloo-label">WATERLOO <small>3 KM</small></span>
        <span className="place-label mont-label">MONT-ST-JEAN</span>
        <span className="place-label belle-label">LA BELLE ALLIANCE</span>
        <span className="place-label plan-label">PLANCENOIT</span>
        <span className="place-label houg-label">HOUGOUMONT</span>
        <span className="farm farm-a" aria-hidden="true">▰</span>
        <span className="farm farm-b" aria-hidden="true">▰</span>
        {waterloo.units.map((unit) => {
          const point = interpolateUnit(unit, progress)
          const isSelected = selectedUnit === unit.id
          return (
            <button
              key={unit.id}
              className={`map-unit ${unit.side} ${isSelected ? 'selected' : ''}`}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              onClick={(event) => { event.stopPropagation(); onSelectUnit(unit.id) }}
              aria-label={`${unit.name}, ${unit.strength} troops`}
            >
              <span className="unit-symbol">{unit.side === 'allied' ? '×' : '•'}</span>
              <span className="unit-name">{unit.name}</span>
              {isSelected && <span className="unit-tooltip"><b>{unit.name}</b><small>Estimated strength · {unit.strength}</small></span>}
            </button>
          )
        })}
        {currentEvent && Math.abs(progress - currentEvent.at) < 7 && (
          <span className="event-pulse" style={{ left: `${currentEvent.position.x}%`, top: `${currentEvent.position.y}%` }} />
        )}
      </div>
      <div className="map-tools">
        <button onClick={() => setZoom((value) => Math.min(1.5, value + .1))} aria-label="Zoom in"><Plus size={17} /></button>
        <button onClick={() => setZoom((value) => Math.max(1, value - .1))} aria-label="Zoom out"><Minus size={17} /></button>
        <button onClick={() => setZoom(1)} aria-label="Reset map"><Crosshair size={17} /></button>
      </div>
      <div className="map-legend">
        <span><i className="allied-dot" /> COALITION</span>
        <span><i className="french-dot" /> FRENCH EMPIRE</span>
      </div>
      <div className="map-scale">0 <span /> 1 KM</div>
    </div>
  )
}

function Timeline({ progress, playing, onProgress, onToggle }: { progress: number; playing: boolean; onProgress: (value: number) => void; onToggle: () => void }) {
  const event = [...waterloo.events].reverse().find((item) => item.at <= progress) ?? waterloo.events[0]
  const minutes = Math.round(690 + progress * 5.4)
  const time = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`

  return (
    <div className="timeline">
      <button className="timeline-play" onClick={onToggle} aria-label={playing ? 'Pause replay' : 'Play replay'}>
        {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
      </button>
      <div className="time-readout"><b>{time}</b><small>18 JUN 1815</small></div>
      <div className="timeline-track-wrap">
        <input type="range" min="0" max="100" step=".1" value={progress} onChange={(e) => onProgress(Number(e.target.value))} aria-label="Battle timeline" />
        <div className="timeline-events" aria-hidden="true">
          {waterloo.events.map((item) => <i key={item.id} className={progress >= item.at ? 'passed' : ''} style={{ left: `${item.at}%` }} />)}
        </div>
        <div className="timeline-labels"><span>11:30</span><span>14:00</span><span>16:30</span><span>18:30</span><span>20:30</span></div>
      </div>
      <div className="current-event"><span>NOW</span><b>{event.title}</b></div>
    </div>
  )
}

function BattlePage() {
  const [progress, setProgress] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)
  const [panel, setPanel] = useState<'story' | 'forces'>('story')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const frame = useRef<number | null>(null)
  const lastTime = useRef<number | null>(null)

  useEffect(() => {
    if (!playing) return
    function tick(timestamp: number) {
      if (lastTime.current !== null) {
        const delta = timestamp - lastTime.current
        setProgress((value) => {
          const next = value + delta / 900
          if (next >= 100) {
            setPlaying(false)
            return 100
          }
          return next
        })
      }
      lastTime.current = timestamp
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
      lastTime.current = null
    }
  }, [playing])

  const currentEvent = useMemo(
    () => [...waterloo.events].reverse().find((event) => event.at <= progress) ?? waterloo.events[0],
    [progress],
  )

  return (
    <main className="battle-page">
      <div className="battle-topbar">
        <Brand compact />
        <button className="back-link" onClick={() => navigate('/')}><ArrowLeft size={15} /> Back to atlas</button>
        <div className="battle-title-mini"><span>HISTORICAL · 1815</span><b>Waterloo</b></div>
        <div className="top-actions">
          <button aria-label="Map layers"><Layers3 size={18} /></button>
          <button aria-label="About this visualization"><CircleHelp size={18} /></button>
          <button aria-label="Full screen" onClick={() => document.documentElement.requestFullscreen?.()}><Expand size={18} /></button>
        </div>
      </div>
      <div className="battle-workspace">
        <aside className={`battle-sidebar ${sidebarOpen ? '' : 'closed'}`}>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle battle details">
            {sidebarOpen ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
          </button>
          <div className="sidebar-scroll">
            <div className="battle-tag"><Flag size={14} /> EXPEDITION 001</div>
            <h1>Waterloo</h1>
            <p className="battle-deck">{waterloo.summary}</p>
            <div className="panel-tabs">
              <button className={panel === 'story' ? 'active' : ''} onClick={() => setPanel('story')}>Story</button>
              <button className={panel === 'forces' ? 'active' : ''} onClick={() => setPanel('forces')}>Forces</button>
            </div>
            {panel === 'story' ? (
              <>
                <div className="event-card">
                  <span className="event-time">{currentEvent.time} · CURRENT EVENT</span>
                  <h2>{currentEvent.title}</h2>
                  <p>{currentEvent.description}</p>
                </div>
                <div className="event-list">
                  {waterloo.events.map((event) => (
                    <button key={event.id} className={Math.abs(event.at - currentEvent.at) < 1 ? 'active' : ''} onClick={() => { setProgress(event.at); setPlaying(false) }}>
                      <span>{event.time}</span><b>{event.title}</b>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="forces-panel">
                <h3><Users size={16} /> Commanders</h3>
                {waterloo.commanders.map((commander) => (
                  <div className="commander" key={commander.name}>
                    <span className={commander.side}>{commander.monogram}</span>
                    <p><b>{commander.name}</b><small>{commander.role}</small></p>
                  </div>
                ))}
                <h3><Swords size={16} /> Strength</h3>
                <p className="force-stat">{waterloo.forces}</p>
              </div>
            )}
            <div className="impact-card">
              <BookOpen size={18} />
              <span><small>HISTORICAL IMPACT</small><b>Napoleon's final defeat ended twenty-three years of near-continuous war in Europe.</b></span>
            </div>
          </div>
        </aside>
        <section className="map-area">
          <TacticalMap progress={progress} selectedUnit={selectedUnit} onSelectUnit={setSelectedUnit} />
          <Timeline
            progress={progress}
            playing={playing}
            onProgress={(value) => { setProgress(value); setPlaying(false) }}
            onToggle={() => {
              if (progress >= 100) setProgress(0)
              setPlaying((value) => !value)
            }}
          />
          <button className="restart-button" onClick={() => { setProgress(0); setPlaying(false) }}><RotateCcw size={14} /> Restart</button>
        </section>
      </div>
    </main>
  )
}

function App() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const updatePath = () => setPath(window.location.pathname)
    window.addEventListener('popstate', updatePath)
    return () => window.removeEventListener('popstate', updatePath)
  }, [])
  return path.startsWith('/battles/waterloo') ? <BattlePage /> : <HomePage />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
