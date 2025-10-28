// app/notes/[id]/page.tsx
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from '@/app/notes/[id]/NoteDetails.client';
import NoteModal from '@/components/NoteModal/NoteModal';
interface Props {
  params: Promise<{ id: string }>;
}

const NotePage = async ({ params }: Props) => {
  const { id } = await params;

  fetchNoteById(id);

  return (
    <NoteModal>
      <NoteDetailsClient />
    </NoteModal>
  );
};

export default NotePage;
