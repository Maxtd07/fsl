import ActionLink from "../components/ActionLink.jsx";
import PageHero from "../components/PageHero.jsx";
import PlaceholderImage from "../components/PlaceholderImage.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

const focusAreas = [
  {
    label: "laborum proident Duis",
    text: "reprehenderit est laborum esse culpa sed sunt cupidatat anim esse nostrud qui ullamco nisi nisi magna minim occaecat. consectetur non mollit sint id ullamco esse pariatur voluptate velit sed Duis in ut pariatur sunt exercitation ea minim.",
    tone: "primary",
  },
  {
    label: "adipiscing dolore sit",
    text: "proident commodo ea minim ullamco proident cupidatat fugiat nisi sint ipsum incididunt anim sit cupidatat aliquip eiusmod ut exercitation non.",
    tone: "secondary",
  },
  {
    label: "ad sunt est sunt in",
    text: "mollit laborum do sit sit eiusmod nostrud elit reprehenderit ipsum incididunt sint aliquip aute culpa sed. fugiat nostrud qui incididunt consequat voluptate fugiat consequat in voluptate laboris anim aliquip dolor occaecat officia culpa esse.",
    tone: "accent",
  },
];

const serviceCards = [
  {
    title: "mollit eiu",
    text: "est quis cillum Duis elit mollit consectetur nostrud est incididunt nulla irure dolore laboris aliqua ex voluptate amet Duis commodo adipiscing sint culpa reprehenderit sed anim sint aliquip.",
    tone: "secondary",
  },
  {
    title: "do aliquip do",
    text: "proident laborum adipiscing amet sit officia elit ea eu anim exercitation ut dolore exercitation non cupidatat id. anim ut proident aliquip occaecat aliquip consequat quis culpa dolor aliquip sed lorem do laborum minim sint amet.",
    tone: "accent",
  },
];

const collaborationAreas = [
  {
    title: "aliquip proident tempor",
    meta: "anim cillum",
    description:
      "aute esse magna aliqua elit laborum minim occaecat ea consectetur sunt reprehenderit adipiscing fugiat cupidatat magna quis. Duis reprehenderit lorem anim consequat irure ex cillum sit nisi sint deserunt fugiat veniam exercitation sint fugiat. do nulla sit ut sit aliqua esse qui culpa minim quis dolore deserunt laboris qui deserunt sit incididunt irure.",
  },
  {
    title: "cillum nulla magna",
    meta: "aute sint",
    description:
      "officia eu nostrud commodo commodo cillum ex in in quis est laborum ipsum Duis ullamco adipiscing eiusmod magna. amet laboris ad consequat eu ea eu dolor aliquip cillum est labore quis eu pariatur nisi. qui ipsum ad culpa fugiat ea est consectetur adipiscing officia laboris incididunt est nulla mollit cillum sed.",
  },
  {
    title: "anim minim cillum",
    meta: "nostrud consequat velit proident",
    description:
      "occaecat dolor fugiat fugiat sint elit consectetur dolor sint eiusmod incididunt consequat laborum adipiscing cillum esse ad aliquip mollit. culpa nulla do qui adipiscing nisi id laborum consequat id irure voluptate aliqua voluptate irure dolor consequat. enim nulla Duis sit aliquip Duis enim ex magna dolor ut est non sit sit commodo sint.",
  },
];

const areaStyles = {
  primary: "border-primary/12 bg-base",
  secondary: "border-secondary/20 bg-secondary/10",
  accent: "border-accent/30 bg-accent/18",
};

function AboutPage() {
  return (
    <main className="space-y-8">
      <PageHero
        eyebrow="ullamco consectetur"
        title="incididunt proident reprehenderit exercitation nisi"
        description="culpa exercitation aliqua est reprehenderit culpa proident esse in ex nostrud id tempor consequat proident adipiscing qui lorem culpa anim"
        tone="primary"
        actions={
          <>
            <ActionLink to="/contatti">Contactum</ActionLink>
            <ActionLink to="/donazioni" variant="secondary">
              Sostienum
            </ActionLink>
          </>
        }
      />

      <section className="grid gap-10 px-6 py-10 md:px-8 md:py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div>
          <SectionHeading
            eyebrow="Operatorum"
            title="sunt do culpa consectetur quis exercitation minim sed elit nisi"
            description="nostrud sint consectetur incididunt id quis labore anim dolore nostrud dolor irure elit consequat cupidatat velit in. laborum ea tempor consequat Duis Duis ut pariatur commodo sunt sunt occaecat Duis proident veniam nulla labore veniam. cupidatat mollit pariatur deserunt commodo sunt ad culpa non sed non magna laboris voluptate et est ipsum."
          />
          <div className="mt-5 md:mt-6 max-w-3xl space-y-3 md:space-y-4 text-xs md:text-sm font-medium leading-7 text-text/85 md:text-text/80">
            <p>
              eu deserunt velit veniam velit ullamco aute id reprehenderit velit
              culpa amet irure ea minim dolor id. sint dolor dolore esse culpa
              non irure Duis ut culpa id dolor id ipsum laboris officia non
              anim. tempor reprehenderit quis voluptate dolore fugiat officia
              Excepteur nisi proident Excepteur tempor lorem nisi proident ad
              esse ex. minim aliquip labore magna lorem dolore eiusmod ullamco
              reprehenderit fugiat est aliquip eiusmod anim nulla cupidatat.
              incididunt aute dolor est commodo labore do occaecat pariatur amet
              esse veniam cillum enim est commodo laboris. ad officia officia
              deserunt Excepteur sint quis id cupidatat sed laboris id do fugiat
              amet reprehenderit.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {focusAreas.map((item) => (
            <article
              key={item.label}
              className={`rounded-[1.5rem] border p-5 shadow-[0_14px_30px_rgba(76,130,169,0.05)] ${areaStyles[item.tone]}`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                {item.label}
              </p>
              <p className="mt-3 text-sm font-medium leading-7 text-text/80 md:text-text/85">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-primary/12 bg-background px-6 py-10 md:px-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(320px,0.92fr)_minmax(0,1.08fr)] lg:items-center">
          <PlaceholderImage
            alt="Attivita e servizi dell'associazione"
            className="aspect-[4/3] w-full"
          />
          <div>
            <SectionHeading
              eyebrow="dolore do Excepteur"
              title="est nisi nisi aliquip"
              description="quis aliqua nostrud proident ad quis do cupidatat eiusmod ad consequat lorem ad aliqua id sunt sit. voluptate et velit est laboris deserunt anim ea proident nostrud Duis exercitation consequat dolore labore anim ea ullamco et."
            />
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {serviceCards.map((item) => (
                <article
                  key={item.title}
                  className={`rounded-[1.4rem] border p-5 shadow-[0_12px_26px_rgba(76,130,169,0.05)] ${areaStyles[item.tone]}`}
                >
                  <p className="mb-2 md:mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                    {item.title}
                  </p>
                  <p className="mt-2 md:mt-3 text-xs md:text-sm leading-6 md:leading-7 text-text/85 md:text-text/80">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-primary/12 px-6 py-10 md:px-8 md:py-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="consectetur dolor anim elit ni"
            title="elit culpa occaecat est mollit esse Duis proident quis velit irure dol"
            description="labore qui eu esse sint quis deserunt ea ipsum veniam incididunt Excepteur enim ut irure qui mollit quis eu nisi sint minim culpa sit mollit labore pariatur laboris in non id ex commodo dolore Duis no"
          />
          <ActionLink to="/contatti" variant="secondary">
            Contactum
          </ActionLink>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {collaborationAreas.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.75rem] border border-primary/12 bg-base p-6 shadow-[0_16px_36px_rgba(76,130,169,0.06)]"
            >
              <p className="mb-2 md:mb-3 inline-flex rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-accent">
                {item.meta}
              </p>
              <h3 className="text-base md:text-lg font-bold tracking-[-0.02em] text-text">
                {item.title}
              </h3>
              <p className="mt-2 md:mt-3 text-xs md:text-sm font-medium leading-6 md:leading-7 text-text/85 md:text-text/80">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default AboutPage;
