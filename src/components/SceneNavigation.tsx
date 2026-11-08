type SceneInfo = { id: number; shortLabel: string; title: string };

export function SceneNavigation({
  scenes, current, maxUnlocked, brandName, onSelect, onBack, onNext, canContinue = true,
}: {
  scenes: SceneInfo[];
  current: number;
  maxUnlocked: number;
  brandName: string;
  onSelect: (index: number) => void;
  onBack: () => void;
  onNext: () => void;
  canContinue?: boolean;
}) {
  return (
    <>
      <header className="site-header">
        <div className="brand-mark" aria-label={`Birthday page for ${brandName}`}>
          <span className="brand-flower" aria-hidden="true">✿</span>
          <span className="brand-wordmark">for <em>{brandName}</em></span>
        </div>
        <div className="header-note">birthday page for {brandName} <span aria-hidden="true">♡</span></div>
        <nav className="progress-nav" aria-label="Birthday story scenes">
          {scenes.map((scene, index) => (
            <button
              key={scene.id}
              className={`progress-dot ${index === current ? 'is-active' : ''} ${index < current ? 'is-complete' : ''}`}
              type="button"
              aria-label={`Scene ${index + 1}: ${scene.title}${index === current ? ', current scene' : ''}`}
              aria-current={index === current ? 'step' : undefined}
              aria-disabled={index > maxUnlocked}
              title={scene.shortLabel}
              onClick={() => index <= maxUnlocked && onSelect(index)}
            >
              <span className="sr-only">{scene.shortLabel}</span>
            </button>
          ))}
          <span className="progress-count">{String(current + 1).padStart(2, '0')} <i>/</i> {String(scenes.length).padStart(2, '0')}</span>
        </nav>
      </header>
      <div className="scene-nav-row">
        <button className="text-button back-button" onClick={onBack} type="button" disabled={current === 0}>
          <span aria-hidden="true">←</span> Back
        </button>
        <span className="scene-nav-label">{scenes[current].shortLabel}</span>
        {current < scenes.length - 1 ? (
          <button className="text-button next-button" onClick={onNext} type="button" disabled={!canContinue}>
            Next <span aria-hidden="true">→</span>
          </button>
        ) : <span className="scene-nav-end">End <span aria-hidden="true">♡</span></span>}
      </div>
    </>
  );
}
