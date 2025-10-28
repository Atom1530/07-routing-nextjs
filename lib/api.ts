// src/services/noteService.ts
import axios, { type AxiosInstance } from "axios";
import type { Note, NoteCreateInput} from "../types/note";

const NOTEHUB_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN as string;

const api: AxiosInstance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: { Authorization: `Bearer ${NOTEHUB_TOKEN}` },
});

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}



// запит для отримання колекції нотаток
export async function fetchNotes(search: string, page: number, tag?: string): Promise<NotesResponse> {
  const params:Record<string, string | number> = { perPage: 12, search, page, sortBy: "created" };
    if (tag) {
    params.tag = tag;
  }
  const { data } = await api.get<NotesResponse>("/notes", { params });
  return data;
}

// запит для створення нової нотатки
export async function createNote(input: NoteCreateInput): Promise<Note> {
  const { data } = await api.post<Note>("/notes", input);
  return data;
}

//запит для видалення нотатки
export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}


//запит за одною нотаткою
export async function fetchNoteById(id: string): Promise<Note> {
    const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
} 