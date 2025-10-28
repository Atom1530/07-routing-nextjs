// app/notes/[...slug]/Notes.client.tsx
'use client';

import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { toast } from 'react-hot-toast';

import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import Pagination from '@/components/Pagination/Pagination';
import css from './Notes.module.css';
import { NoteTag } from '@/types/note';

interface Props {
  initialTag?: NoteTag;
}

export default function NotesClient({ initialTag }: Props) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const tag = initialTag;

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 400);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['notes', search || undefined, page, tag],
    queryFn: () => fetchNotes(search, page, tag),
    placeholderData: keepPreviousData,
    retry: false,
    throwOnError: true,
  });

  const { notes = [], totalPages = 0 } = data ?? {};

  useEffect(() => {
    if (!isLoading && !isError && !isFetching && search.trim() && notes.length === 0) {
      toast.error('No notes found for your request.');
    }
  }, [search, isLoading, isError, isFetching, notes.length]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} defaultValue={search} />
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={(p) => !isFetching && setPage(p)}
          />
        )}
        <button className={css.button} onClick={() => setIsOpen(true)}>
          Create note +
        </button>
      </header>

      {!isLoading && isFetching && (
        <div className={css.thinProgress} role="progressbar" aria-busy="true" />
      )}

      {!isLoading && !isError && !isFetching && notes.length === 0 && (
        <p className={css.status}>No notes found.</p>
      )}

      {notes.length > 0 && <NoteList notes={notes} />}

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <NoteForm onCancel={() => setIsOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
