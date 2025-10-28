// components/Modal/Modal.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from '@/components/Modal/Modal.module.css';

type Props = { children: React.ReactNode };

export default function NoteModal({ children }: Props) {
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && router.back();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router]);

  return (
    <div className={styles.backdrop} onClick={() => router.back()} role="dialog" aria-modal="true">
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={() => router.back()} aria-label="Close">
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
