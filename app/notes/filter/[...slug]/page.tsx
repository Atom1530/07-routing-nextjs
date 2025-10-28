// app/notes/filter/[...slug]/page.tsx
import { fetchNotes } from '@/lib/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import NotesClient from './Notes.client';
import type { NoteTag } from '@/types/note';
import { NOTES_TAGS } from '@/lib/constants';
import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export default async function Notes({ params }: Props) {
  const { slug } = await params;

  const raw = slug?.[0] ?? 'all';

  const isValid = raw === 'all' || NOTES_TAGS.includes(raw as NoteTag);
  if (!isValid) redirect('/notes/filter/all');

  const tag = raw === 'all' ? undefined : (raw as NoteTag);

  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ['notes', '', 1, tag],
    queryFn: () => fetchNotes('', 1, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient key={tag ?? 'all'} initialTag={tag} />
    </HydrationBoundary>
  );
}
