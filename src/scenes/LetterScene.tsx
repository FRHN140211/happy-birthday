import { birthdayContent } from '../config/content';
import { FlowerMark, HeartSeal, TinyStar } from '../components/Decor';

export function LetterScene({ opened, onOpenEnvelope, onOpenLetter }: {
  opened: boolean;
  onOpenEnvelope: () => void;
  onOpenLetter: () => void;
}) {
  return (
    <section className="scene scene-letter" aria-labelledby="opening-title">
      <div className="scene-kicker"><span>01</span><i /> A NOTE FOR TODAY</div>
      <div className="letter-composition">
        <div className="letter-copy">
          <p className="eyebrow-script">for the day</p>
          <h1 id="opening-title">{birthdayContent.openingTitle}</h1>
          <p className="intro-copy">{birthdayContent.openingSubtitle}</p>
          <div className="flower-note"><FlowerMark /><span>picked for<br />your day</span></div>
        </div>
        <div className={`envelope-stage ${opened ? 'is-open' : ''}`}>
          <span className="orbit orbit-one" aria-hidden="true">✿</span>
          <span className="orbit orbit-two" aria-hidden="true">♡</span>
          <TinyStar className="envelope-star star-one" />
          <TinyStar className="envelope-star star-two" />
          <button className={`envelope-button ${opened ? 'is-open' : ''}`} type="button" onClick={onOpenEnvelope} aria-label={opened ? 'Envelope opened' : 'Open the birthday envelope'} aria-expanded={opened}>
            <span className="envelope-letter">
              <span className="letter-topline">birthday note</span>
              <span className="letter-script">for<br />{birthdayContent.name}</span>
              <span className="letter-flower">✿</span>
            </span>
            <span className="envelope-body"><span className="envelope-fold" /></span>
            <span className="envelope-flap" />
            <span className="envelope-heart"><HeartSeal /></span>
            <span className="envelope-to">To: {birthdayContent.name} <span aria-hidden="true">♡</span></span>
          </button>
          <p className="tap-hint">{opened ? 'the note is ready' : 'tap to open'}</p>
        </div>
        <div className="postage-stamp" aria-label="Birthday card">
          <span className="stamp-flower">✿</span><span>BIRTHDAY<br />NOTE</span><small>♡ {birthdayContent.birthdayDate} ♡</small>
        </div>
      </div>
      <div className="scene-footer-note"><span>FOR {birthdayContent.name.toUpperCase()}</span><span className="footer-star">✳</span><span>{birthdayContent.birthdayDate}</span></div>
      {opened && <div className="open-letter-action"><button type="button" className="pill-button" onClick={onOpenLetter}>Open the letter <span aria-hidden="true">→</span></button></div>}
    </section>
  );
}
