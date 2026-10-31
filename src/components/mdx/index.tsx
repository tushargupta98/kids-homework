import type { MDXComponents } from 'mdx/types';
import { ReadAloudButton } from '../ui';
import { Callout } from './Callout';
import { CarryAddition, TensOnes } from './CarryAddition';
import { Counters } from './Counters';
import { NumberLine } from './NumberLine';
import { TenFrame } from './TenFrame';

/** Widgets available in every .mdx lesson without importing, plus kid-friendly typography. */
export const mdxComponents: MDXComponents = {
  TenFrame,
  NumberLine,
  Counters,
  CarryAddition,
  TensOnes,
  Callout,
  ReadAloud: ReadAloudButton,
  h1: (p) => <h2 className="text-3xl font-bold md:text-4xl" {...p} />,
  h2: (p) => <h3 className="pt-2 text-2xl font-bold md:text-3xl" {...p} />,
  h3: (p) => <h4 className="text-xl font-bold md:text-2xl" {...p} />,
  p: (p) => <p {...p} />,
  ul: (p) => <ul className="list-disc space-y-1 pl-8" {...p} />,
  ol: (p) => <ol className="list-decimal space-y-1 pl-8" {...p} />,
  strong: (p) => <strong className="font-bold text-orange-700" {...p} />,
  a: (p) => <a className="font-semibold text-sky-700 underline underline-offset-4" {...p} />,
};
