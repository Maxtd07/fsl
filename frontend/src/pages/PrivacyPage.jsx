import PageHero from '../components/PageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'

const privacySections = [
  {
    eyebrow: 'Lorem section',
    title: 'Dolor sit amet',
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem.',
  },
  {
    eyebrow: 'Data flow',
    title: 'Consectetur adipiscing',
    text:
      'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.',
  },
  {
    eyebrow: 'Usage',
    title: 'Sed do eiusmod',
    text:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
  {
    eyebrow: 'Retention',
    title: 'Tempor incididunt',
    text:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    eyebrow: 'Security',
    title: 'Labore et dolore',
    text:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.',
  },
  {
    eyebrow: 'Rights',
    title: 'Voluptatem accusantium',
    text:
      'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.',
  },
  {
    eyebrow: 'Cookies',
    title: 'Ipsum lorem',
    text:
      'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius.',
  },
  {
    eyebrow: 'Contact',
    title: 'Finibus bonorum',
    text:
      'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.',
  },
]

function PrivacyPage() {
  return (
    <main className="space-y-8">
      <PageHero
        eyebrow="Lorem"
        title="Lorem ipsum dolor sit amet consectetur"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        tone="neutral"
      />

      <section className="rounded-lg border border-primary/20 bg-base p-6 shadow-lg md:p-8">
        <SectionHeading
          eyebrow="Overview"
          title="Lorem ipsum summary"
          description="Consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        />

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {privacySections.map((section) => (
            <article
              key={section.title}
              className="rounded-lg border border-primary/15 bg-background p-5 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                {section.eyebrow}
              </p>
              <h2 className="mt-3 text-xl font-bold text-text">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-text/80">{section.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-secondary/30 bg-secondary/8 p-6 shadow-md md:p-8">
        <SectionHeading
          eyebrow="Contact"
          title="Lorem ipsum contact area"
          description="Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam."
        />

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-primary/15 bg-base p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Email</p>
            <p className="mt-3 text-sm text-text/80">lorem@ipsum.org</p>
          </div>

          <div className="rounded-lg border border-primary/15 bg-base p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Phone</p>
            <p className="mt-3 text-sm text-text/80">+00 000 000 000</p>
          </div>

          <div className="rounded-lg border border-primary/15 bg-base p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Location</p>
            <p className="mt-3 text-sm text-text/80">Lorem ipsum dolor sit amet</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default PrivacyPage