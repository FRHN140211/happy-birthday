import { useEffect, useState } from 'react';
import { birthdayContent, type PhotoAsset } from '../config/content';
import { AssetPhoto } from '../components/AssetPhoto';
import { FlowerMark, Tape } from '../components/Decor';

type GalleryAssetView = { asset: PhotoAsset; hasPhoto: boolean };

type GalleryCardProps = {
  asset: PhotoAsset;
  index: number;
  onOpen: (view: GalleryAssetView) => void;
};

function GalleryCard({ asset, index, onOpen }: GalleryCardProps) {
  const [photoState, setPhotoState] = useState<'loading' | 'ready' | 'placeholder'>('loading');
  const hasPhoto = photoState === 'ready';
  const canOpen = photoState !== 'loading';
  return (
    <button
      className={`memory-card memory-card-${index + 1} ${photoState === 'placeholder' ? 'is-placeholder' : ''}`}
      type="button"
      onClick={() => canOpen && onOpen({ asset, hasPhoto })}
      disabled={!canOpen}
      aria-label={hasPhoto ? `Open ${asset.caption}` : `View placeholder for ${asset.caption ?? asset.label}; photo path ${asset.src}`}
    >
      <span className="memory-pin" aria-hidden="true">✦</span>
      <span className="memory-photo">
        <AssetPhoto
          asset={asset}
          className="memory-image"
          onPhotoReady={() => setPhotoState('ready')}
          onPhotoError={() => setPhotoState('placeholder')}
          alt={asset.caption ?? asset.label}
        />
      </span>
      <span className="memory-caption">{asset.caption}</span>
      <span className="memory-index">{String(index + 1).padStart(2, '0')} / 06</span>
    </button>
  );
}

export function GalleryScene() {
  const [active, setActive] = useState<GalleryAssetView | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && setActive(null);
    window.addEventListener('keydown', onKeyDown);
    document.body.classList.add('lightbox-open');
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('lightbox-open');
    };
  }, [active]);

  return (
    <section className="scene scene-gallery" aria-labelledby="gallery-title">
      <div className="scene-kicker"><span>05</span><i /> MEMORY BOARD</div>
      <div className="gallery-heading">
        <div><p className="eyebrow-script">moments worth keeping</p><h1 id="gallery-title">Photos &<br /><em>Memories</em></h1></div>
        <p>Some moments deserve a place to stay.</p>
      </div>
      <div className="gallery-board">
        <Tape className="gallery-tape" />
        <span className="gallery-board-label">DIVA'S MEMORY BOARD <i>♡</i></span>
        <div className="memory-grid">
          {birthdayContent.gallery.map((asset, index) => <GalleryCard key={asset.src} asset={asset} index={index} onOpen={setActive} />)}
        </div>
        <div className="gallery-doodle"><FlowerMark /><span>more to<br />come</span></div>
      </div>
      <p className="gallery-footnote">The photos here are the ones worth keeping.</p>
      {active && (
        <div className="lightbox-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setActive(null)}>
          <div className="lightbox-panel" role="dialog" aria-modal="true" aria-label={active.asset.caption ?? active.asset.label}>
            <button className="lightbox-close" type="button" onClick={() => setActive(null)} aria-label="Close photo">×</button>
            {active.hasPhoto ? (
              <img src={active.asset.src} alt={active.asset.caption ?? active.asset.label} />
            ) : (
              <div className="lightbox-placeholder" role="img" aria-label={`Photo placeholder for ${active.asset.label}`}>
                <span aria-hidden="true">✿</span>
                <p>This frame is waiting for a real photo.</p>
                <code>{active.asset.src}</code>
              </div>
            )}
            <p>{active.asset.caption}</p>
            {!active.hasPhoto && <small>Add a real photo at this path to fill the frame.</small>}
          </div>
        </div>
      )}
    </section>
  );
}
