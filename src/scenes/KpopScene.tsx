import { useEffect, useState } from 'react';
import { birthdayContent, type PhotoAsset } from '../config/content';
import { AssetPhoto } from '../components/AssetPhoto';
import { TinyStar } from '../components/Decor';

function GroupCard({ name, src, members, theme, onOpen }: { name: string; src: string; members: PhotoAsset[]; theme: 'lngshot' | 'cortis'; onOpen: (asset: PhotoAsset) => void; }) {
  const groupAsset = { src, label: `${name} group photo`, caption: `${name} official group photo` } satisfies PhotoAsset;

  return (
    <article className={`fan-page fan-page-${theme}`}>
      <div className="fan-page-topline"><span>{name} COLLECTION</span><span>♡ 01 / 02</span></div>
      <div className="fan-title-row">
        <div><p className="micro-label">FAN FAVORITES</p><h2>{name}</h2></div>
        <span className="fan-sticker">{theme === 'lngshot' ? 'GROUP\nPHOTOS' : 'MEMBER\nCOLLECTION'}</span>
      </div>
      <div className="fan-collage">
        <button type="button" className="group-photo-wrap" onClick={() => onOpen(groupAsset)} aria-label={`Open ${name} group photo`}>
          <span className="photo-tag">GROUP PHOTOS · {name}</span>
          <AssetPhoto asset={groupAsset} className="group-photo" alt={`${name} official group photo`} />
          <span className="group-caption">{theme === 'lngshot' ? 'LNGSHOT Collection' : 'CORTIS Collection'}</span>
        </button>
        <div className="fan-notes">
          <span className="fan-note-mark">FAVORITES</span>
          <p className="fan-handwritten">{theme === 'lngshot' ? birthdayContent.kpop.lngshot.tagline : birthdayContent.kpop.cortis.tagline}</p>
          <span className="fan-postmark">FOR<br />DIVA <span>♡</span></span>
          <TinyStar className="fan-star" />
        </div>
      </div>
      <div className="member-cards" aria-label={`${name} member photo collection`}>
        {members.map((member, index) => (
          <button type="button" className={`member-card member-card-${index + 1}`} key={member.src} onClick={() => onOpen(member)} aria-label={`Open ${member.caption ?? member.label}`}>
            <div className="member-photo-frame"><AssetPhoto asset={member} className="member-photo" alt={`${name} ${member.label}`} /></div>
            <span>{member.label}</span>
          </button>
        ))}
      </div>
      <div className="fan-page-footer"><span>NO. {theme === 'lngshot' ? '01' : '02'} — {name}</span><span>GROUP / MEMBER</span></div>
    </article>
  );
}

export function KpopScene() {
  const [active, setActive] = useState<PhotoAsset | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null);
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.classList.add('lightbox-open');
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('lightbox-open');
    };
  }, [active]);

  return (
    <section className="scene scene-kpop" aria-labelledby="kpop-title">
      <div className="scene-kicker"><span>04</span><i /> K-POP COLLECTION</div>
      <div className="kpop-heading">
        <p className="eyebrow-script">favorite groups</p>
        <h1 id="kpop-title">{birthdayContent.kpop.lngshot.name} &<br /><em>{birthdayContent.kpop.cortis.name}</em></h1>
        <p>Group photos, member collection, and favorite moments.</p>
      </div>
      <div className="fan-pages">
        <GroupCard name={birthdayContent.kpop.lngshot.name} src={birthdayContent.kpop.lngshot.groupPhoto} members={birthdayContent.kpop.lngshot.members} theme="lngshot" onOpen={setActive} />
        <GroupCard name={birthdayContent.kpop.cortis.name} src={birthdayContent.kpop.cortis.groupPhoto} members={birthdayContent.kpop.cortis.members} theme="cortis" onOpen={setActive} />
      </div>
      {active && (
        <div className="lightbox-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setActive(null)}>
          <div className="lightbox-panel" role="dialog" aria-modal="true" aria-label={active.caption ?? active.label}>
            <button className="lightbox-close" type="button" onClick={() => setActive(null)} aria-label="Close photo">×</button>
            <img src={active.src} alt={active.caption ?? active.label} />
            <p>{active.caption ?? active.label}</p>
          </div>
        </div>
      )}
    </section>
  );
}
