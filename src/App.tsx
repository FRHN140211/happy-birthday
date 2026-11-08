import { useState } from 'react';
import { SceneNavigation } from './components/SceneNavigation';
import { MusicToggle } from './components/MusicToggle';
import { birthdayContent } from './config/content';
import { BirthdayScene } from './scenes/BirthdayScene';
import { KpopScene } from './scenes/KpopScene';
import { LetterScene } from './scenes/LetterScene';
import { WishesScene } from './scenes/WishesScene';
import { PhotoBooth } from './features/photobooth/PhotoBooth';

const scenes = [
  { id: 1, shortLabel: 'Letter', title: 'Open the letter' },
  { id: 2, shortLabel: 'Birthday', title: 'Birthday' },
  { id: 3, shortLabel: 'Wishes', title: 'Birthday wishes' },
  { id: 4, shortLabel: 'K-pop', title: 'LNGSHOT Collection' },
  { id: 5, shortLabel: 'Photobooth', title: 'Birthday photobooth' },
];

export default function App() {
  const [current, setCurrent] = useState(0);
  const [maxUnlocked, setMaxUnlocked] = useState(0);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  const moveTo = (index: number) => {
    setCurrent(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const goTo = (index: number) => {
    if (index < 0 || index >= scenes.length || index > maxUnlocked) return;
    moveTo(index);
  };
  const next = () => {
    if (current === 0) return;
    const destination = Math.min(current + 1, scenes.length - 1);
    setMaxUnlocked((previous) => Math.max(previous, destination));
    moveTo(destination);
  };
  const openLetter = () => {
    setMaxUnlocked((previous) => Math.max(previous, 1));
    moveTo(1);
  };

  return (
    <div className="site-shell">
      <div className="paper-grain" aria-hidden="true" />
      <SceneNavigation
        scenes={scenes}
        current={current}
        maxUnlocked={maxUnlocked}
        brandName={birthdayContent.name}
        onSelect={goTo}
        onBack={() => goTo(current - 1)}
        onNext={next}
        canContinue={current !== 0}
      />
      <main className="story-stage" aria-live="polite" aria-atomic="false">
        <div className="story-inner" key={current}>
          {current === 0 && <LetterScene opened={envelopeOpened} onOpenEnvelope={() => setEnvelopeOpened(true)} onOpenLetter={openLetter} />}
          {current === 1 && <BirthdayScene />}
          {current === 2 && <WishesScene />}
          {current === 3 && <KpopScene />}
          {current === 4 && <PhotoBooth birthdayDate={birthdayContent.birthdayDate} name={birthdayContent.name} />}
        </div>
      </main>
      <footer className="site-footer"><span>BIRTHDAY PAGE FOR {birthdayContent.name.toUpperCase()}</span><span className="footer-heart">♡</span><span>{birthdayContent.birthdayDate} · THIS YEAR</span></footer>
      <MusicToggle src={birthdayContent.music.src} title={birthdayContent.music.title} />
    </div>
  );
}
