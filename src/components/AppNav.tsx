import AureliaBrand from './AureliaBrand'
import './AppNav.css'

export type AppView = 'operations' | 'invoice-control-center'

const NAV_ITEMS: { view: AppView; label: string }[] = [
  { view: 'operations', label: 'Operations' },
  { view: 'invoice-control-center', label: 'Invoice Control Center' },
]

interface AppNavProps {
  activeView: AppView
  onNavigate: (view: AppView) => void
}

function AppNav({ activeView, onNavigate }: AppNavProps) {
  return (
    <nav className="app-nav" aria-label="Aurelia AI">
      <span className="app-nav-brand">
        <AureliaBrand size={22} />
        Aurelia AI
      </span>
      <div className="app-nav-links">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.view}
            type="button"
            className={`app-nav-link${activeView === item.view ? ' app-nav-link--active' : ''}`}
            aria-current={activeView === item.view ? 'page' : undefined}
            onClick={() => onNavigate(item.view)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default AppNav
