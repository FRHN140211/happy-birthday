import { birthdayContent } from '../config/content';
import { FlowerMark, Tape } from '../components/Decor';

export function BirthdayScene() {
  const [greetingLead, greetingName] = birthdayContent.greetingTitle.split(', ');
  const [salutation, ...letterParagraphs] = birthdayContent.letter.split('\n\n');

  return (
    <section className="scene scene-birthday" aria-labelledby="birthday-title">
      <div className="scene-kicker"><span>02</span><i /> A DAY FOR YOU</div>
      <div className="birthday-layout">
        <div className="birthday-heading">
          <p className="eyebrow-script">today is yours</p>
          <h1 id="birthday-title">{greetingLead},<br /><em>{greetingName}</em></h1>
          <p className="birthday-subtitle">{birthdayContent.greetingSubtitle}</p>
          <div className="birthday-mark"><span>08</span><i>·</i><span>NOV</span><small>YOUR DAY<br />TODAY</small></div>
        </div>
        <article className="letter-paper">
          <Tape className="tape-top" />
          <div className="paper-corner flower-corner"><FlowerMark /></div>
          <div className="paper-stamp">A<br />NOTE<br /><small>♡</small></div>
          <p className="letter-salutation">{salutation}</p>
          <div className="letter-body-copy">
            {letterParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <p className="letter-signoff">Enjoy your day <span>♡</span></p>
          <div className="letter-lines" aria-hidden="true" />
        </article>
      </div>
      <div className="small-handwritten birthday-aside">your day<br />starts here <span>✿</span></div>
    </section>
  );
}
