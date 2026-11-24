import type { ReactNode } from 'react';
import ScrollReveal from './ScrollReveal';

/**
 * The one way every main page opens (About, Projects, Contact, Explore): a big lowercase word with a brand-coloured
 * full stop, then one line of context. Same size, colour, spacing and alignment everywhere.
 */
const PageIntro = ({ word, lead, action, above }: { word: string; lead?: ReactNode; action?: ReactNode; above?: ReactNode }) => (
  <ScrollReveal>
    <header className="mb-10 md:mb-14">
      {above}
      <h1 className="text-[clamp(3rem,11vw,7.5rem)] font-bold tracking-tighter leading-[0.9] break-words">
        {word.toLocaleLowerCase()}<span className="text-primary">.</span>
      </h1>
      {(lead || action) && (
        <div className="mt-5 md:mt-6 grid md:grid-cols-[minmax(0,1fr)_auto] gap-5 items-end">
          {lead && <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">{lead}</p>}
          {action && <div className="justify-self-start md:justify-self-end">{action}</div>}
        </div>
      )}
    </header>
  </ScrollReveal>
);

export default PageIntro;
