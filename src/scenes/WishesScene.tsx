import { birthdayContent } from '../config/content';
import { FlowerMark, TinyStar } from '../components/Decor';

const cardColors = ['rose', 'cream', 'blush', 'ivory', 'pink', 'paper'];
const cardNotes = ['good health', 'steady rhythm', 'good company', 'clear direction', 'small joys', 'peace'];

export function WishesScene() {
  return (
    <section className="scene scene-wishes" aria-labelledby="wishes-title">
      <div className="scene-kicker"><span>03</span><i /> BIRTHDAY WISHES</div>
      <div className="wishes-heading">
        <p className="eyebrow-script">a quiet wish</p>
        <h1 id="wishes-title">Wishes<br /><em>For Diva</em></h1>
        <p>May this year bring a steady rhythm and a few good surprises.</p>
      </div>
      <div className="wish-cards">
        {birthdayContent.wishes.map((wish, index) => (
          <article className={`wish-card wish-${cardColors[index]}`} key={wish}>
            <span className="wish-number">0{index + 1}</span>
            <span className="wish-note">{cardNotes[index]}</span>
            <p>{wish}</p>
            <span className="wish-doodle" aria-hidden="true">{index % 2 === 0 ? <FlowerMark /> : <TinyStar />}</span>
          </article>
        ))}
      </div>
      <aside className="blessing-note">
        <span className="blessing-heart" aria-hidden="true">♡</span>
        <p>{birthdayContent.blessing}</p>
        <span className="blessing-flower" aria-hidden="true">✿</span>
      </aside>
    </section>
  );
}
