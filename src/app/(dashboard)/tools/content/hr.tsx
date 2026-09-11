import {
  A,
  Callout,
  Code,
  Figure,
  Ol,
  P,
  Planned,
  Pre,
  Section,
  StatusTable,
  Sub,
  type TocEntry,
  Ul,
  Video,
  VideoSlot,
} from "@/components/docs";

const lang = "hr" as const;

export const meta = {
  title: "Alati — MatSek",
  description:
    "Čemu služe MatSekovi AI alati, kako se koriste Šuma, tutor i pisač blogova, te kako zajednička knjižnica ostaje legalna i besplatna.",
  heading: "Alati za dijeljenje razumijevanja",
  lede: "Mala obitelj AI alata koji rade na tvom računalu i zajednička knjižnica koju svi zajedno šire. Ovo je netehnički vodič.",
  tocTitle: "Na ovoj stranici",
};

export const toc: TocEntry[] = [
  { id: "vision", label: "1 · Vizija" },
  { id: "usage", label: "2 · Kako se koristi" },
  { id: "forest", label: "Šuma — digest, ask, grow", depth: 2 },
  { id: "tutor", label: "Tutor", depth: 2 },
  { id: "blog-writer", label: "Pisač blogova", depth: 2 },
  { id: "also", label: "Još u paketu", depth: 2 },
  { id: "website", label: "Web-stranica", depth: 2 },
  { id: "technical", label: "3 · Ispod haube" },
  { id: "copyright", label: "Autorska prava", depth: 2 },
  { id: "no-server", label: "Bez servera", depth: 2 },
  { id: "formats", label: "Formati", depth: 2 },
  { id: "data-loop", label: "Petlja podataka", depth: 2 },
  { id: "repos", label: "Repozitoriji i stanje" },
];

export default function Content() {
  return (
    <>
      <Callout>
        Sve označeno s <Planned lang={lang} /> opisano je zato što oblikuje
        dizajn, ali još nije napravljeno. Sve ostalo možeš koristiti danas.
        Isti vodič na engleskom je na GitHubu:{" "}
        <A href="https://github.com/matsek-fer">github.com/matsek-fer</A>.
      </Callout>

      <Section id="vision" title="1 · Vizija">
        <P>
          Cilj je skup AI alata koji olakšava <strong>suradnju i dijeljenje
          razumijevanja</strong> — ne chatbot koji odgovara na pitanja, nego
          alati koji nakon svake upotrebe nešto ostave za sobom, tako da
          sljedeća osoba kreće od dalje.
        </P>
        <P>
          Podatkovna struktura ispod svega je <strong>šuma</strong>. Šuma nije
          zamišljena za čitanje od korice do korice kao udžbenik; ona je{" "}
          <em>obogaćenje</em> običnog nastavnog materijala — blogova, bilježaka
          s predavanja, poglavlja knjige. Svaka definicija, teorem, dokaz,
          primjer i zadatak postaje svoje malo, adresirano <em>stablo</em>, a
          stabla su povezana onim što prvo moraš razumjeti. Blog ostaje blog;
          šuma je ono što alatu omogućuje da nađe točno onaj teorem na koji se
          blog oslanja, dva dokaza koja za njega postoje i tri zadatka koja ga
          provjeravaju.
        </P>
        <P>
          Dugoročni cilj je da ta reprezentacija bude dovoljno izražajna i
          dobro strukturirana da član koji želi istražiti neku vezu u
          matematici može <strong>opisati što misli</strong>, a model dohvati
          sve što se o tome trenutačno zna i predstavi to na način koji se može
          pratiti: prvo pregled dosadašnjeg rada, sa specijaliziranim smjerovima
          koji se otvaraju na zahtjev, i s precizno korisnim zadacima utkanima
          na pravoj dubini.
        </P>
        <P>
          Za to šuma ne može ostati jedan statični monolit, što je danas. Mora
          postati velik objekt pojmova <em>i relacija među pojmovima</em> — pri
          čemu je i relacija stablo, pa postoje i relacije među relacijama, i
          tako dalje. Model koji odgovara na upit mora raditi dvije stvari
          odjednom: <strong>učinkovito širiti knjižnicu</strong> (što god je
          izračunao postaje stablo koje sljedeći upit može iskoristiti) i{" "}
          <strong>držati potrošnju po upitu niskom</strong> (što šuma više već
          sadrži, to manje treba generirati).
        </P>
        <Figure
          name="forest-structure"
          lang={lang}
          alt="Šuma: jedno stablo po objektu (definicija, teorem, dokaz, zadatak, intuicija), bridovi ovisnosti među njima, dokazi kao zasebna stabla i stabla-poveznice koja povezuju druga stabla — u budućnosti i druge poveznice."
          caption={
            <>
              Jedno stablo po objektu, više vrsta bridova. Dokaz je zasebno
              stablo koje <Code>proves</Code> (dokazuje) tvrdnju. Stablo{" "}
              <Code>connection</Code> povezuje dva druga stabla — a u planu su i
              poveznice među poveznicama.
            </>
          }
        />
      </Section>

      <Section id="usage" title="2 · Kako se koristi">
        <P>
          Alata je više i međusobno su povezani. Svaki je plugin za{" "}
          <A href="https://claude.com/claude-code">Claude Code</A> — vještina
          koju model slijedi — i svi čitaju i pišu iste datoteke, pa se mogu
          međusobno koristiti.
        </P>
        <P>
          <strong>Instalacija</strong> su dvije naredbe unutar Claude Codea,
          jednom:
        </P>
        <Pre>{`/plugin marketplace add matsek-fer/plugins
/plugin install forest@matsek        # ili tutor, blog-writer, problemset, submit`}</Pre>
        <P>
          Ažuriranja stižu sama. Većina alata svoj rad prikazuje kao Markdown
          datoteke koje se renderiraju u{" "}
          <A href="https://obsidian.md">Obsidianu</A> — besplatnoj aplikaciji za
          bilješke — pa otvori Obsidian u drugom prozoru, a terminal drži u
          prvom.
        </P>
        <Figure
          name="ecosystem"
          lang={lang}
          alt="Ekosustav: na tvom računalu — Šuma, Tutor, Pisač blogova, Zbirka zadataka i lokalni trezor; zajedničko na GitHubu — globalna šuma, knjižnica i web-stranica. Strelice pokazuju kako se alati međusobno hrane."
          caption="Sve lijevo radi na tvom računalu; sve desno su obične datoteke na GitHubu."
        />

        <Sub id="forest" title="2.1 · Šuma — /digest, /ask, /grow">
          <P>
            Glavni alat za istraživanje proizvoljnog pojma je{" "}
            <strong>Forest reader</strong>. Daš mu dokument — članak, poglavlje,
            bilješke s predavanja; više od otprilike{" "}
            <strong>50 stranica odjednom ne preporučuje se</strong> — i{" "}
            <Code>/digest</Code> proizvede <em>šumsku reprezentaciju</em>{" "}
            dokumenta: mapu (<strong>trezor</strong>) u kojoj je svaka
            definicija, teorem, dokaz, primjer i zadatak zasebno stablo, napisano
            modelovim riječima, s pokazivačem na stranicu s koje potječe.
          </P>
          <P>
            Formalno, šuma je graf s nešto dodatne strukture — više vrsta
            bridova (<em>depends</em>, <em>proves</em>, <em>digested from</em>),
            neki bridovi koji su i sami čvorovi (stablo <em>connection</em>) i
            mali skup vrsta stabala (<em>taksoni</em>). Još{" "}
            <strong>nije strogo definirana</strong> i namjerno će se nadograđivati
            usput; dosad se pokazala korisnom u stvarnoj mjeri — probava cijelog
            poglavlja udžbenika algebre prošla je nasumično neprijateljsko
            uzorkovanje bez ijedne krive tvrdnje.
          </P>
          <Figure
            name="digest-flow"
            lang={lang}
            alt="Tijek probave: dokument → /digest → lokalni trezor → čitaj u Obsidianu ili pregledniku, pitaj s /ask, objavi s /grow u globalnu šumu."
          />
          <P>Što možeš s trezorom:</P>
          <Ul>
            <li>
              <strong>Čitati ga</strong> u Obsidianu ili otvoriti{" "}
              <Code>views/forest.html</Code> u pregledniku: interaktivnu kartu
              djela. Svako stablo je kartica; stablo je označeno kao{" "}
              <em>spremno za čitanje</em> čim je sve o čemu ovisi označeno kao
              savladano, pa je redoslijed čitanja onaj koji ti preduvjeti
              dopuštaju, a ne redoslijed stranica.
            </li>
            <li>
              <strong>
                <Code>/ask</Code>
              </strong>{" "}
              — pitanje dok učiš. Odgovor dolazi prvo iz <em>tvojih</em> stabala,
              s njihovim id-jevima, a tek onda iz općeg znanja modela, jasno
              označeno. Ako odgovor vrijedi zadržati, alat nudi da ga uzgoji u
              novo stablo u tvom trezoru.
            </li>
            <li>
              <strong>
                <Code>/grow</Code>
              </strong>{" "}
              — uzgoj stabla u <strong>globalnu šumu</strong>, zajedničku šumu
              na GitHub Pagesu:{" "}
              <A href="https://matsek-fer.github.io/library/forest/">
                matsek-fer.github.io/library/forest
              </A>
              . Alat usporedi tvoje stablo s onim što već postoji, pričvrsti ga
              na pravo mjesto (alternativni dokaz visi na postojećem teoremu;
              poveznica spaja dva postojeća stabla), pita te odakle sadržaj
              dolazi i otvori pull request koji pregleda čovjek.
            </li>
          </Ul>
          <Video
            name="forest-graph"
            label="Snimka zaslona: prikaz globalne šume u pregledniku"
            caption="Globalna šuma u pregledniku: otvori stablo, pretraži, označi kao savladano — stabla koja su o njemu ovisila zasvijetle kao spremna."
          />
          <P>
            <Planned lang={lang} /> Kad drugi član počne probavljati djelo koje
            je netko već probavio i uzgojio, <Code>/digest</Code> ga preusmjeri
            na postojeća stabla umjesto da posao radi ponovno. Danas{" "}
            <Code>/digest</Code> provjerava samo zajednički{" "}
            <em>registar pojmova</em> da se imena poklope.
          </P>
          <VideoSlot>
            Snimka zaslona <Code>/digest</Code> sesije stiže — to je članova
            vlastita sesija u terminalu, pa se mora snimiti ručno.
          </VideoSlot>
        </Sub>

        <Sub id="tutor" title="2.2 · Tutor — /tutor">
          <P>
            Tutor služi za <strong>specijalizirano učenje</strong> jedne teme.
            Kažeš mu što želiš razumjeti i on počne zadacima, da vidi koliko toga
            već imaš. Iz toga izgradi <strong>DAG tema</strong> — plan učenja s
            redoslijedom — i cijelu sesiju zrcali u Markdown bilješku koja se
            uživo osvježava u Obsidianu: plan kao graf, LaTeX, dijagrami.
          </P>
          <Figure
            name="tutor-flow"
            lang={lang}
            alt="Tijek tutora: ispitivanje zadacima, plan kao DAG, zatim učenje u jednom od tri načina — prati čvorove, traži zadatke ili istraži (u planu)."
          />
          <P>Odatle biraš kako nastaviti:</P>
          <Ol>
            <li>
              <strong>Prati.</strong> Čitaj čvorove jedan po jedan, redom kojim
              plan kaže. Prekini bilo kad — pitaj zašto čvor 3 ovisi o čvoru 2,
              skreni, vrati se.
            </li>
            <li>
              <strong>Zadaci.</strong> Traži zadatke prave težine. Danas alat{" "}
              <Code>problemset</Code> pretražuje zadatke knjižnice po temi i
              težini; <Planned lang={lang} /> tutor izravno dohvaća
              specijalizirane zadatke iz globalne šume.
            </li>
            <li>
              <strong>Istraži.</strong> <Planned lang={lang} /> Tutor sakrije
              sve kutije osim nužnih definicija, a ti pokušaš izgraditi ostatak
              sam, dok model procjenjuje tvoje razmišljanje i daje upute prema
              skrivenim kutijama. Ako je tvoj pristup nešto što globalna šuma
              nema, upravo tako šuma dobije novo stablo.
            </li>
          </Ol>
          <P>
            Ako učiš unutar trezora Šume, sesija živi u mapi{" "}
            <Code>sessions/</Code> tog trezora — jedan Obsidian prozor po
            djelu.
          </P>
          <VideoSlot>
            Snimka zaslona <Code>/tutor</Code> sesije uz njezinu Obsidian
            bilješku stiže.
          </VideoSlot>
        </Sub>

        <Sub id="blog-writer" title="2.3 · Pisač blogova">
          <P>
            Pomoćnik za pisanje blogova. Intervjuira te o temi i publici,
            pogleda što knjižnica već ima i pomaže ti strukturirati tekst tako
            da <strong>svaki odjeljak uči točno jedan pojam</strong> s
            provjerom na kraju. Rezultat je <em>bundle</em> — blog plus male
            datoteke koje ga čine pronalazivim i ponovno upotrebljivim: engleska
            anotacija za pretragu, pojmovi koje uči i zahtijeva, te{" "}
            <strong>tutor stub</strong> koji čitatelju omogućuje da u{" "}
            <Code>/tutor</Code> nastavi točno ondje gdje je blog stao.
          </P>
          <P>
            Danas pisač u prave odjeljke linka zadatke iz knjižnice.{" "}
            <Planned lang={lang} /> Izravno ugrađivanje postojećih stabala iz
            globalne šume — da blog može transkludirati teorem koji mu treba
            umjesto da ga prepričava, i da pomoćnik drugog člana, koji piše
            drugi blog, može iskoristiti ono što tvoj sadrži.
          </P>
        </Sub>

        <Sub id="also" title="2.4 · Još u paketu">
          <Ul>
            <li>
              <strong>Zbirka zadataka (problemset)</strong> — fino pretraživanje
              knjižnice: „ljestvica zadataka rastuće težine o djelovanju grupe na
              kosete podgrupe”, „pripremi me za Lagrangeov teorem”. Iskrena o
              rupama — prazan rezultat je točan odgovor.
            </li>
            <li>
              <strong>Submit</strong> — svaki alat sesiju završava pisanjem{" "}
              <Code>experience.md</Code>: što si radio, gdje je zapinjalo, što
              bi moglo bolje. <Code>/submit</Code> od toga napravi osobni
              izvještaj o boljem korištenju alata i, samo uz tvoj izričit
              pristanak na točan konačni tekst, očišćenu prijavu u knjižnicu.
              Održavatelji čitaju nakupljena iskustva da poboljšaju alate;
              vještine je jeftino mijenjati.
            </li>
          </Ul>
        </Sub>

        <Sub id="website" title="Web-stranica">
          <P>
            Ova stranica prikazuje knjižnicu kao <strong>statične stranice</strong>:
            svaki blog, zadatak, dokaz i stablo, s pretragom. Interaktivni
            dijelovi — usmjeravanje koje vodi tutor, provjere — događaju se{" "}
            <strong>lokalno</strong>, kad član isti blog otvori u vlastitim
            alatima s vlastitom pretplatom. Nikad nije bila namjera pokretati AI
            za anonimne čitatelje stranice.
          </P>
        </Sub>
      </Section>

      <Section id="technical" title="3 · Ispod haube">
        <P>
          Kratko i običnim riječima; obvezujuće verzije su u{" "}
          <A href="https://github.com/matsek-fer/spec/blob/main/DECISIONS.md">
            spec/DECISIONS.md
          </A>
          .
        </P>

        <Sub id="copyright" title="Autorska prava — tvrdo pravilo">
          <P>
            Trezor probavljen iz knjige pod autorskim pravom je{" "}
            <strong>izvedeno djelo</strong>. U redu je da ga imaš — to je tvoja
            kopija za učenje — ali se nikad ne smije dijeliti, a „probava”
            cijelog udžbenika je upravo ono zbog čega se projekti gase. Zato
            alati provode tri razine:
          </P>
          <Figure
            name="copyright-tiers"
            lang={lang}
            alt="Tri razine: izvor pod autorskim pravom daje izvedeni trezor koji ostaje lokalno; GFDL ili CC BY-SA izvor daje trezor koji se dijeli samo pod uvjetima izvora; CC BY izvor ili vlastiti rad daje trezor koji može u knjižnicu. Ispred knjižnice je firewall; jedina vrata kroz njega su stablo koje si sam napisao."
          />
          <Ul>
            <li>
              Trezor iz izvora <strong>pod autorskim pravom</strong> označen je
              kao <Code>derivative</Code> i nosi obavijest: <em>LOKALNO — ostaje
              na tvom računalu</em>. <Code>/grow</Code> odbija objaviti bilo
              što iz njega što je napisala probava.
            </li>
            <li>
              Trezor iz <strong>share-alike</strong> izvora (GFDL, CC BY-SA)
              smije se dijeliti pod uvjetima izvora, ali nikad u knjižnicu —
              share-alike nije CC BY.
            </li>
            <li>
              Trezor iz <strong>CC BY</strong> izvora ili iz{" "}
              <strong>tvog vlastitog</strong> materijala može u knjižnicu, a
              navođenje autora putuje sa svakim stablom.
            </li>
            <li>
              Jedina vrata kroz firewall iz izvedenog trezora su stablo koje
              probava <em>nije</em> napisala: nešto što si ti ili tvoj pomoćnik
              napisao unutar trezora (<Code>origin: member</Code> /{" "}
              <Code>agent</Code>). <Code>/grow</Code> provjeri da takvo stablo
              potiho ne reproducira izvor i traži da navedeš njegovu
              provenijenciju prije nego što se otvori pull request.
            </li>
          </Ul>
          <P>
            Globalna šuma i knjižnica su{" "}
            <strong>CC BY 4.0, samo izvorni sadržaj</strong>. Kôd alata je MIT.
          </P>
        </Sub>

        <Sub id="no-server" title="Bez servera">
          <P>
            Ciljani trošak infrastrukture je <strong>0 € mjesečno</strong>,
            namjerno. Knjižnica je git repozitorij; spajanje u <Code>main</Code>{" "}
            ponovno izgradi stranicu, stranice stabala i indeks za pretragu, a
            GitHub Pages ih poslužuje kao statične datoteke. Svaki alat koji
            pretražuje knjižnicu preuzme taj indeks i pretražuje ga lokalno,
            malim višejezičnim modelom za ugrađivanja koji radi na tvom računalu
            — bez API-ja za pretragu, bez ključeva na serveru, bez troška po
            upitu za sekciju.
          </P>
        </Sub>

        <Sub id="formats" title="Formati">
          <P>Dva ugovora na disku, oba običan Markdown s YAML zaglavljem:</P>
          <Ul>
            <li>
              <strong>Bundleovi</strong> — jedna mapa po artefaktu (
              <Code>problems/…</Code>, <Code>proofs/…</Code>,{" "}
              <Code>blogs/…</Code>): sadržaj, manifest s pojmovima koje uči i
              zahtijeva, engleska anotacija i provenijencija. Definirano u{" "}
              <A href="https://github.com/matsek-fer/spec/blob/main/bundles.md">
                spec/bundles.md
              </A>
              , a validator ga provjerava u CI-ju na svakom pull requestu.
            </li>
            <li>
              <strong>Trezori Šume</strong> — <Code>forest.json</Code> plus
              jedna datoteka po stablu, id-jevi s prefiksom vrste (
              <Code>def-</Code>, <Code>thm-</Code>, <Code>prf-</Code>,{" "}
              <Code>exr-</Code>, <Code>con-</Code>, …), popis{" "}
              <Code>depends</Code>, neobvezno sidro <Code>proves</Code>, jezik po
              stablu i gornja polja o autorskim pravima. Definirano u{" "}
              <A href="https://github.com/matsek-fer/reader/blob/main/docs/forest-format.md">
                reader/docs/forest-format.md
              </A>
              ; nacrt, očekuju se promjene.
            </li>
          </Ul>
          <P>
            U knjižnici su <strong>stabla sloj u koji se stvari spajaju</strong>;
            blogovi su prezentacija — kurirane staze koje upućuju na stabla.
            Stariji blogovi ostaju kanonski dok se ne probave, a njihova stabla
            pokazuju natrag na njih pa je zastarjelost vidljiva, a ne tiha.
          </P>
        </Sub>

        <Sub id="data-loop" title="Petlja podataka">
          <P>
            Sustav se poboljšava iz podataka na dva konkretna načina.{" "}
            <em>Stabla:</em> svaki odgovor vrijedan čuvanja postaje stablo, svako
            stablo koje napusti trezor uspoređuje se sa šumom, pa se šuma
            deduplicira na granularnosti na kojoj je „postoji li ovo već?”
            pitanje koje stroj može provjeriti. <em>Iskustva:</em> datoteke{" "}
            <Code>experience.md</Code> koje članovi dobrovoljno pošalju
            nakupljaju se, a agent koji radi na repozitoriju alata pročita ih
            prije nego što promijeni vještinu.
          </P>
        </Sub>
      </Section>

      <Section id="repos" title="Repozitoriji i stanje">
        <Ul>
          <li>
            <A href="https://github.com/matsek-fer/plugins">plugins</A> —
            marketplace. Odavde se instalira sve.
          </li>
          <li>
            <A href="https://github.com/matsek-fer/reader">reader</A> — Šuma:{" "}
            <Code>/digest</Code>, <Code>/ask</Code>, <Code>/grow</Code>, format
            trezora, prikaz u pregledniku.
          </li>
          <li>
            <A href="https://github.com/matsek-fer/AI_instructor">AI_instructor</A>{" "}
            — tutor, kao Claude Code vještina i kao Python CLI nad istim
            datotekama sesije.
          </li>
          <li>
            <A href="https://github.com/matsek-fer/blog-writer">blog-writer</A>{" "}
            — pomoćnik za pisanje blogova.
          </li>
          <li>
            <A href="https://github.com/matsek-fer/library">library</A> —
            zajednička knjižnica i globalna šuma, objavljene na{" "}
            <A href="https://matsek-fer.github.io/library/">
              matsek-fer.github.io/library
            </A>
            .
          </li>
          <li>
            <A href="https://github.com/matsek-fer/spec">spec</A> — odluke,
            politika provenijencije, format bundlea, validator, skup upita za
            evaluaciju pretrage.
          </li>
          <li>
            <A href="https://github.com/matsek-fer/MatSekApp">MatSekApp</A> —
            ova web-stranica.
          </li>
        </Ul>
        <StatusTable
          head={["", ""]}
          labels={{ live: "radi", planned: "u planu" }}
          rows={[
            { what: "Šuma: digest, ask, grow, prikaz u pregledniku, globalna šuma na stranici", state: "live" },
            { what: "Tutor: ispitivanje → plan → učenje, sesije unutar trezora", state: "live" },
            { what: "Pisač blogova s tutor stubovima; zbirka zadataka; slanje iskustava", state: "live" },
            { what: "Preusmjeravanje probave na postojeću probavu istog djela", state: "planned" },
            { what: "Tutor dohvaća zadatke iz globalne šume; način istraživanja", state: "planned" },
            { what: "Blogovi kao izvorna stabla (transkluzija šume)", state: "planned" },
            { what: "Sučelje označi-i-pitaj nad šumom", state: "planned" },
          ]}
        />
        <P>
          Doprinosi su dobrodošli i pregledava ih čovjek: otvori pull request na{" "}
          <Code>library</Code> ili se javi sekciji.
        </P>
      </Section>
    </>
  );
}
