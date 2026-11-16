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

const lang = "en" as const;

export const meta = {
  title: "Tools",
  description:
    "What the MatSek AI tools are for, how to use the Forest, the tutor and the blog writer, and how the shared library stays legal and free.",
  heading: "Tools for sharing understanding",
  lede: "A small family of AI tools that run on your own computer, and a shared library they all grow. This is the non-technical guide.",
  tocTitle: "On this page",
};

export const toc: TocEntry[] = [
  { id: "vision", label: "1 · The vision" },
  { id: "usage", label: "2 · How to use it" },
  { id: "forest", label: "Forest — digest, ask, grow", depth: 2 },
  { id: "bridge", label: "Ask from the browser", depth: 2 },
  { id: "tutor", label: "Tutor", depth: 2 },
  { id: "blog-writer", label: "Blog writer", depth: 2 },
  { id: "also", label: "Also in the box", depth: 2 },
  { id: "website", label: "The website", depth: 2 },
  { id: "technical", label: "3 · Under the hood" },
  { id: "copyright", label: "Copyright", depth: 2 },
  { id: "no-server", label: "No server", depth: 2 },
  { id: "no-model", label: "Why the browser never talks to a model", depth: 2 },
  { id: "formats", label: "Formats", depth: 2 },
  { id: "data-loop", label: "The data loop", depth: 2 },
  { id: "repos", label: "Repositories & status" },
];

export default function Content() {
  return (
    <>
      <Callout>
        Anything marked <Planned lang={lang} /> is described because it shapes
        the design, but it is not built yet. Everything else you can use
        today. The same guide is on GitHub at{" "}
        <A href="https://github.com/matsek-fer">github.com/matsek-fer</A>.
      </Callout>

      <Section id="vision" title="1 · The vision">
        <P>
          The goal is an AI toolset that makes <strong>collaboration and the
          sharing of understanding</strong> easier — not a chatbot that
          answers questions, but a set of tools that leave something behind
          each time they are used, so the next person starts further along.
        </P>
        <P>
          The data structure underneath is the <strong>forest</strong>. A forest
          is not meant to be read cover to cover like a textbook; it is an{" "}
          <em>enrichment</em> of ordinary teaching material — blogs, lecture
          notes, a chapter of a book. Every definition, theorem, proof, example
          and exercise becomes its own small, addressable <em>tree</em>, and the
          trees are linked by what you need to understand first. A blog stays a
          blog; the forest is what lets a tool find the exact theorem the blog
          leans on, the two proofs of it that exist, and the three problems that
          test it.
        </P>
        <P>
          The long-term aim is for that representation to be expressive and
          well-structured enough that a member who wants to explore a connection
          in mathematics can <strong>describe what they are thinking</strong>,
          and the model can fetch everything currently known about it and
          present it in a way that can be followed: an overview of the prior
          work first, with specialised directions that unfold on demand, and
          precisely useful problems woven in at the right depth.
        </P>
        <P>
          For that, the forest cannot stay a single static monolith, which is
          what it is today. It has to become a large object of concepts{" "}
          <em>and relations between concepts</em> — where a relation is itself a
          tree, so there can be relations between relations, and so on. The
          model that answers a query has to do two things at once:{" "}
          <strong>grow the library efficiently</strong> (whatever it worked out
          becomes a tree the next query can reuse) and{" "}
          <strong>keep the compute per query low</strong> (the more the forest
          already holds, the less has to be generated).
        </P>
        <Figure
          name="forest-structure"
          lang={lang}
          alt="A forest: one tree per object (definition, theorem, proof, exercise, intuition), depends edges between them, proofs as separate trees, and connection trees that relate other trees — including, in the future, other connections."
          caption={
            <>
              One tree per object, several kinds of edge. A proof is its own
              tree that <Code>proves</Code> a statement. A{" "}
              <Code>connection</Code> tree relates two other trees — and the
              plan is for connections between connections too.
            </>
          }
        />
      </Section>

      <Section id="usage" title="2 · How to use it">
        <P>
          There are several interconnected tools. Each is a plugin for{" "}
          <A href="https://claude.com/claude-code">Claude Code</A> — a skill the
          model follows — and they all read and write the same files, so they
          can use each other.
        </P>
        <P>
          <strong>Installing</strong> takes two commands inside Claude Code,
          once:
        </P>
        <Pre>{`/plugin marketplace add matsek-fer/plugins
/plugin install forest@matsek        # or tutor, blog-writer, problemset, submit`}</Pre>
        <P>
          Updates arrive automatically. Most of the tools show their work as
          Markdown files that render in{" "}
          <A href="https://obsidian.md">Obsidian</A> — a free note-taking app —
          so open Obsidian in a second window and keep the terminal in the
          first.
        </P>
        <Figure
          name="ecosystem"
          lang={lang}
          alt="The ecosystem: on your machine — Forest, Tutor, Blog writer, Problemset and a local vault; shared on GitHub — the global forest, the library and the website. Arrows show how the tools feed each other."
          caption="Everything on the left runs on your machine; everything on the right is plain files on GitHub."
        />

        <Sub id="forest" title="2.1 · Forest — /digest, /ask, /grow">
          <P>
            The main tool for exploring an arbitrary concept is the{" "}
            <strong>Forest reader</strong>. Give it a document — a paper, a
            chapter, lecture notes; more than about{" "}
            <strong>50 pages at a time is not recommended</strong> — and{" "}
            <Code>/digest</Code> produces the document&apos;s{" "}
            <em>forest representation</em>: a folder (a <strong>vault</strong>)
            in which every definition, theorem, proof, example and exercise is
            its own tree, written in the model&apos;s own words, with a pointer
            back to the page it came from.
          </P>
          <P>
            Formally the forest is a graph with some extra structure — several
            kinds of edge (<em>depends</em>, <em>proves</em>,{" "}
            <em>digested from</em>), some edges that are themselves nodes (a{" "}
            <em>connection</em> tree), and a small set of tree kinds (
            <em>taxa</em>). It is <strong>not yet rigorously defined</strong>{" "}
            and is meant to be upgraded along the way; so far it has proved
            useful to a real extent — a digestion of a whole chapter of an
            algebra textbook came out with zero wrong statements when sampled
            adversarially.
          </P>
          <Figure
            name="digest-flow"
            lang={lang}
            alt="Digest flow: document → /digest → local vault → read it in Obsidian or the browser view, ask questions with /ask, and publish with /grow into the global forest."
          />
          <P>What you can do with a vault:</P>
          <Ul>
            <li>
              <strong>Read it</strong> in Obsidian, or open{" "}
              <Code>views/forest.html</Code> in a browser: an interactive map of
              the work. Each tree shows as a card; a tree is outlined{" "}
              <em>ready to read</em> once everything it depends on is marked as
              learned, so the order in which you read is the order your
              prerequisites allow, not the order of the pages.
            </li>
            <li>
              <strong>
                <Code>/ask</Code>
              </strong>{" "}
              a question while you study. The answer comes from <em>your</em>{" "}
              trees first, citing their ids, and only then from the model&apos;s
              general knowledge, clearly labelled (<em>izvan šume:</em>). If the answer is worth
              keeping, the tool offers to grow it into a new tree in your vault.
            </li>
            <li>
              <strong>
                <Code>/grow</Code>
              </strong>{" "}
              a tree into the <strong>global forest</strong> — the shared forest
              hosted on GitHub Pages at{" "}
              <A href="https://matsek-fer.github.io/library/forest/">
                matsek-fer.github.io/library/forest
              </A>
              . The tool compares your tree against what is already there,
              attaches it in the right place (an alternative proof hangs off
              the existing theorem; a connection joins two existing trees),
              asks you where the content came from, and opens a pull request
              that a person reviews.
            </li>
          </Ul>
          <Video
            name="forest-graph"
            label="Screen recording of the global forest's browser view"
            caption="The global forest in the browser view: open a tree, search, mark it as learned — the trees that depended on it light up as ready."
          />
          <P>
            <Planned lang={lang} /> When a second member starts digesting a
            work that someone has already digested and grown,{" "}
            <Code>/digest</Code> routes them to the existing trees instead of
            re-doing the work. Today <Code>/digest</Code> only checks the shared{" "}
            <em>concept registry</em> so that names line up.
          </P>
          <VideoSlot>
            A screen recording of a <Code>/digest</Code> session is coming — it
            is a member&apos;s own terminal session, so it has to be recorded by
            hand.
          </VideoSlot>
        </Sub>

        <Sub id="bridge" title="Ask from the browser — the bridge">
          <P>
            You do not have to leave the forest view to ask.{" "}
            <Code>/ask --watch</Code> turns your Claude Code session into the
            model half of a reader:
          </P>
          <Ol>
            <li>
              <Code>node scripts/build-views.mjs &lt;vault&gt;</Code> if the view
              is stale.
            </li>
            <li>
              <Code>node scripts/serve-vault.mjs &lt;vault&gt; --open</Code> —
              serves your <Code>forest.html</Code> from <Code>127.0.0.1</Code>;
              the printed URL carries a one-launch token, so don&apos;t share
              it.
            </li>
            <li>
              In a second terminal, inside the vault: <Code>claude</Code>, then{" "}
              <Code>/ask --watch</Code>.
            </li>
          </Ol>
          <P>
            Each tree&apos;s panel now has an ask box. Highlight a passage{" "}
            <em>inside the panel</em>, type a question, <em>Pitaj</em>. The page
            writes the request as a file into the vault&apos;s{" "}
            <Code>.ask/</Code> folder; your Claude Code picks it up, answers the
            way <Code>/ask</Code> always does — your trees first, ids clickable
            — and the answer streams back onto the page with the maths
            rendered. A corner pill shows whether Claude Code is connected. If
            the answer had to go beyond the vault it ends with an offer (
            <Code>Ponuda:</Code>) the page turns into a button, and your click
            is the consent to grow that tree; a second button hands the tree to{" "}
            <Code>/tutor</Code>. You end the mode by interrupting Claude Code.
          </P>
          <Figure
            name="bridge-flow"
            lang={lang}
            alt="The bridge: the browser page, a loopback file-relay server and the member's own Claude Code session, with .ask/ request, status and answer files as the only interface between them."
          />
          <Video
            name="bridge"
            label="Screen recording of the bridge: highlight, ask, answer"
            caption="Highlight, ask, and the answer arrives from your own Claude Code — grounded in the trees it cites."
          />
        </Sub>

        <Sub id="tutor" title="2.2 · Tutor — /tutor">
          <P>
            The tutor is for <strong>specialised learning</strong> of one topic.
            Tell it what you want to understand and it starts by giving you
            problems, to find out how much of it you already have. From that it
            builds a <strong>DAG of topics</strong> — a learning plan with an
            order — and mirrors the whole session into a Markdown note that
            updates live in Obsidian: the plan as a graph, LaTeX, diagrams.
          </P>
          <Figure
            name="tutor-flow"
            lang={lang}
            alt="Tutor flow: probe with problems, plan a DAG, then teach in one of three modes — follow the nodes, ask for problems, or explore (planned)."
          />
          <P>From there you choose how to continue:</P>
          <Ol>
            <li>
              <strong>Follow.</strong> Read the nodes one by one, in the order
              the plan gives. Interrupt any time — ask why node 3 depends on
              node 2, take a detour, come back.
            </li>
            <li>
              <strong>Problems.</strong> Ask for problems at the right
              difficulty. Today the <Code>problemset</Code> tool searches the
              library&apos;s problems by topic and difficulty;{" "}
              <Planned lang={lang} /> the tutor pulls specialised problems from
              the global forest directly.
            </li>
            <li>
              <strong>Explore.</strong> <Planned lang={lang} /> The tutor hides
              every box except the necessary definitions and you try to build
              the rest yourself, while the model evaluates your reasoning and
              drops hints towards the hidden boxes. If your approach is one the
              global forest does not have, that is exactly how the forest grows
              a new tree.
            </li>
          </Ol>
          <P>
            If you are studying inside a Forest vault, the session lives in that
            vault&apos;s <Code>sessions/</Code> folder — one Obsidian window per
            work.
          </P>
          <VideoSlot>
            A screen recording of a <Code>/tutor</Code> session next to its
            Obsidian note is coming.
          </VideoSlot>
        </Sub>

        <Sub id="blog-writer" title="2.3 · Blog writer">
          <P>
            A blog-writing assistant. It interviews you about the topic and the
            audience, looks at what the library already holds, and helps you
            structure the piece so that{" "}
            <strong>each section teaches exactly one concept</strong> with a
            checkpoint at the end. The result is a <em>bundle</em> — the blog
            plus the small files that make it findable and reusable: an English
            annotation for search, the concepts it teaches and requires, and a{" "}
            <strong>tutor stub</strong> that lets a reader continue in{" "}
            <Code>/tutor</Code> exactly where the blog stopped.
          </P>
          <P>
            Today the writer links problems from the library into the right
            sections. <Planned lang={lang} /> Embedding existing trees from the
            global forest directly — so that a blog can transclude the theorem
            it needs rather than restate it, and so that another member&apos;s
            assistant, writing another blog, can reuse what yours contains.
          </P>
        </Sub>

        <Sub id="also" title="2.4 · Also in the box">
          <Ul>
            <li>
              <strong>Problemset</strong> — fine-grained search over the
              library: &ldquo;a ladder of problems of increasing difficulty on
              the action of a group on the cosets of a subgroup&rdquo;,
              &ldquo;prepare me for Lagrange&apos;s theorem&rdquo;. Honest about
              gaps — an empty result is a correct answer.
            </li>
            <li>
              <strong>Submit</strong> — every tool ends a session by writing an{" "}
              <Code>experience.md</Code>: what you did, where it was awkward,
              what could be better. <Code>/submit</Code> turns it into a
              personal report on using the tool better and, only with your
              explicit consent on the exact final text, a scrubbed submission to
              the library. Maintainers read the accumulated experiences to
              improve the tools; skills are cheap to change.
            </li>
          </Ul>
        </Sub>

        <Sub id="website" title="The website">
          <P>
            This site shows the library as <strong>static pages</strong>: every
            blog, problem, proof and tree, with search. The interactive parts —
            the instructor-driven routing, the checkpoints — happen{" "}
            <strong>locally</strong>, when a member opens the same blog in their
            own tools with their own subscription. There was never an intent to
            run AI for anonymous readers of the site.
          </P>
        </Sub>
      </Section>

      <Section id="technical" title="3 · Under the hood">
        <P>
          Kept short and in plain words; the binding versions are in{" "}
          <A href="https://github.com/matsek-fer/spec/blob/main/DECISIONS.md">
            spec/DECISIONS.md
          </A>
          .
        </P>

        <Sub id="copyright" title="Copyright — the hard rule">
          <P>
            A vault digested from a copyrighted book is a{" "}
            <strong>derivative work</strong>. It is fine for you to have it — it
            is your study copy — but it can never be shared, and a
            &ldquo;digest&rdquo; of a whole textbook is exactly the kind of
            thing that gets a project taken down. So the tools enforce three
            tiers:
          </P>
          <Figure
            name="copyright-tiers"
            lang={lang}
            alt="Three tiers: a copyrighted source gives a derivative vault that stays local; a GFDL or CC BY-SA source gives a vault shareable only under the source's terms; a CC BY source or your own work gives a vault eligible for the library. A firewall sits before the library; the one door through it is a tree you wrote yourself."
          />
          <Ul>
            <li>
              A vault from a <strong>copyrighted</strong> source is marked{" "}
              <Code>derivative</Code> and carries a notice: <em>LOKALNO — stays
              on your machine</em>. <Code>/grow</Code> refuses to publish
              anything from it that the digest wrote.
            </li>
            <li>
              A vault from a <strong>share-alike</strong> source (GFDL, CC
              BY-SA) may be shared under the source&apos;s own terms, but never
              into the library — share-alike is not CC BY.
            </li>
            <li>
              A vault from a <strong>CC BY</strong> source, or from{" "}
              <strong>your own</strong> material, is library-eligible, with
              attribution travelling with each tree.
            </li>
            <li>
              The one door through the firewall from a derivative vault is a
              tree the digest did <em>not</em> write: something you or your
              assistant authored inside the vault (<Code>origin: member</Code>{" "}
              / <Code>agent</Code>). <Code>/grow</Code> checks that such a tree
              does not quietly reproduce the source, and asks you to state its
              provenance before the pull request is opened.
            </li>
          </Ul>
          <P>
            The global forest and the library are{" "}
            <strong>CC BY 4.0, original content only</strong>. Tool code is
            MIT.
          </P>
        </Sub>

        <Sub id="no-server" title="No server">
          <P>
            Target infrastructure cost is <strong>$0/month</strong>,
            deliberately. The library is a git repository; merging to{" "}
            <Code>main</Code> rebuilds the site, the tree pages and the search
            index, and GitHub Pages serves them as static files. Every tool
            that searches the library downloads that index and searches it
            locally, with a small multilingual embedding model that runs on
            your machine — no provider API for search, no keys on a server, no
            per-query cost to the section.
          </P>
        </Sub>

        <Sub id="no-model" title="Why the browser never talks to a model">
          <P>
            The Claude Agent SDK is API-key-only and cannot run on a claude.ai
            subscription login, so a page cannot own the model without a key on
            some server — which the whole design refuses. Instead the
            member&apos;s ordinary Claude Code session <em>is</em> the model, its
            permission prompts are the sandbox, and{" "}
            <Code>serve-vault.mjs</Code> is a dumb file relay: loopback only, a
            per-launch token checked on every call together with the
            browser&apos;s origin, request bodies capped, tree ids validated
            against the vault. The member sees every tool call in their own
            terminal. <Code>.ask/</Code> is runtime state — gitignored, ignored
            by the validator, never part of the vault format or of any export —
            and digested tree bodies are treated as untrusted text throughout.
          </P>
        </Sub>

        <Sub id="formats" title="Formats">
          <P>Two on-disk contracts, both plain Markdown with a YAML header:</P>
          <Ul>
            <li>
              <strong>Bundles</strong> — one folder per artifact (
              <Code>problems/…</Code>, <Code>proofs/…</Code>,{" "}
              <Code>blogs/…</Code>): the content, a manifest naming the concepts
              it teaches and requires, an English annotation, and provenance.
              Defined in{" "}
              <A href="https://github.com/matsek-fer/spec/blob/main/bundles.md">
                spec/bundles.md
              </A>
              , checked by a validator that CI runs on every pull request.
            </li>
            <li>
              <strong>Forest vaults</strong> — <Code>forest.json</Code> plus one
              file per tree, ids prefixed by kind (<Code>def-</Code>,{" "}
              <Code>thm-</Code>, <Code>prf-</Code>, <Code>exr-</Code>,{" "}
              <Code>con-</Code>, …), a <Code>depends</Code> list, an optional{" "}
              <Code>proves</Code> anchor, per-tree language, and the copyright
              fields above. Defined in{" "}
              <A href="https://github.com/matsek-fer/reader/blob/main/docs/forest-format.md">
                reader/docs/forest-format.md
              </A>
              ; draft, expected to change.
            </li>
          </Ul>
          <P>
            In the library, <strong>trees are the layer things merge into</strong>;
            blogs are presentation — curated paths that reference trees. Older
            blogs stay canonical until they are digested, and their trees point
            back at them so staleness is visible rather than silent.
          </P>
        </Sub>

        <Sub id="data-loop" title="The data loop">
          <P>
            The system improves from data in two concrete ways.{" "}
            <em>Trees:</em> every answer worth keeping becomes a tree, every
            tree that leaves a vault is matched against the forest, so the
            forest deduplicates at the granularity where &ldquo;does this exist
            already?&rdquo; is a question a machine can check.{" "}
            <em>Experiences:</em> the opt-in <Code>experience.md</Code> files
            accumulate, and the agent working on a tool&apos;s repository reads
            them before changing a skill.
          </P>
        </Sub>
      </Section>

      <Section id="repos" title="Repositories & status">
        <Ul>
          <li>
            <A href="https://github.com/matsek-fer/plugins">plugins</A> — the
            marketplace. Start here to install anything.
          </li>
          <li>
            <A href="https://github.com/matsek-fer/reader">reader</A> — the
            Forest: <Code>/digest</Code>, <Code>/ask</Code> (and the browser
            bridge), <Code>/grow</Code>, the vault format, the browser view.
          </li>
          <li>
            <A href="https://github.com/matsek-fer/AI_instructor">AI_instructor</A>{" "}
            — the tutor, as a Claude Code skill and as a Python CLI over the
            same session files.
          </li>
          <li>
            <A href="https://github.com/matsek-fer/blog-writer">blog-writer</A>{" "}
            — the blog-writing assistant.
          </li>
          <li>
            <A href="https://github.com/matsek-fer/library">library</A> — the
            community library and the global forest, published at{" "}
            <A href="https://matsek-fer.github.io/library/">
              matsek-fer.github.io/library
            </A>
            .
          </li>
          <li>
            <A href="https://github.com/matsek-fer/spec">spec</A> — decisions,
            provenance policy, bundle format, validator, retrieval evaluation
            set.
          </li>
          <li>
            <A href="https://github.com/matsek-fer/MatSekApp">MatSekApp</A> —
            this website.
          </li>
        </Ul>
        <StatusTable
          head={["", ""]}
          labels={{ live: "live", planned: "planned" }}
          rows={[
            { what: "Forest: digest, ask, grow, browser view, global forest on the site", state: "live" },
            { what: "Highlight-and-ask from the browser view — the bridge (/ask --watch)", state: "live" },
            { what: "Tutor: probe → plan → teach, sessions inside vaults", state: "live" },
            { what: "Blog writer with tutor stubs; problemset; experience submission", state: "live" },
            { what: "Digest routing to an existing digestion of the same work", state: "planned" },
            { what: "Tutor pulling problems from the global forest; explore mode", state: "planned" },
            { what: "Blogs as native trees (transcluding the forest)", state: "planned" },
          ]}
        />
        <P>
          Contributions are welcome and reviewed by a person: open a pull
          request on <Code>library</Code>, or write to the section.
        </P>
      </Section>
    </>
  );
}
