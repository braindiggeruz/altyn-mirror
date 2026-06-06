import { RESULT_KEYS } from '@/lib/results';
import ResultClient from './result-client';

export function generateStaticParams() {
  return RESULT_KEYS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export default function ResultPage({ params }: { params: { slug: string } }) {
  return <ResultClient slug={params.slug} />;
}
