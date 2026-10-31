import type { MDXProps } from 'mdx/types';
import { useEffect, useRef, useState, type ComponentType } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mdxComponents } from '../components/mdx';
import { Badge, Mascot, ReadAloudButton } from '../components/ui';
import { getConcepts, loadConcept } from '../lib/content';
import { useClassification } from './ClassificationLayout';
import NotFound from './NotFound';

export default function ConceptPage() {
  const { concept: slug = '' } = useParams();
  const { contentPath, base, colors, theme } = useClassification();
  const concepts = getConcepts(contentPath);
  const index = concepts.findIndex((c) => c.slug === slug);
  const meta = concepts[index];
  const next = concepts[index + 1];
  const loader = loadConcept(contentPath, slug);
  const [Content, setContent] = useState<ComponentType<MDXProps> | null>(null);
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let alive = true;
    setContent(null);
    loader?.().then((C) => alive && setContent(() => C));
    return () => {
      alive = false;
    };
  }, [loader]);

  if (!meta || !loader) return <NotFound />;

  return (
    <article className="mx-auto max-w-3xl">
      <header className="mb-6 flex items-start justify-between gap-3">
        <div>
          <p className={`font-display text-base font-semibold uppercase tracking-wide ${colors.text}`}>Lesson {index + 1}</p>
          <h2 className="text-4xl font-bold leading-tight md:text-5xl">
            {meta.emoji} {meta.title}
          </h2>
          {meta.standard && <Badge className="mt-2 bg-white text-ink-soft">Standard {meta.standard}</Badge>}
        </div>
        {theme.readAloud && <ReadAloudButton text={() => articleRef.current?.innerText ?? ''} label="Read this lesson to me" />}
      </header>

      <section
        ref={articleRef}
        className="space-y-5 rounded-[2rem] border-4 border-ink/10 bg-white p-5 text-xl leading-relaxed shadow-chunky md:p-8 md:text-2xl"
      >
        {Content ? <Content components={mdxComponents} /> : <p className="animate-pulse text-ink-soft">Loading…</p>}
      </section>

      <div className="mt-8 flex flex-col gap-4 rounded-[2rem] border-4 border-ink/10 bg-gradient-to-br from-yellow-100 to-orange-100 p-5 md:flex-row md:items-center md:justify-between">
        {theme.showMascot ? <Mascot size={64}>Ready? Let's try it!</Mascot> : <p className="font-display text-2xl">Ready to try it?</p>}
        <div className="flex flex-wrap gap-3">
          <Link to={`${base}/practice?concept=${meta.slug}`} className={`inline-flex min-h-14 items-center rounded-full border-4 border-ink/15 px-6 font-display text-xl font-semibold text-white shadow-chunky-sm ${colors.solid} ${colors.solidHover}`}>
            🎯 Practice
          </Link>
          {next && (
            <Link to={`${base}/concepts/${next.slug}`} className="inline-flex min-h-14 items-center rounded-full border-4 border-ink/15 bg-white px-6 font-display text-xl font-semibold shadow-chunky-sm">
              Next lesson →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
