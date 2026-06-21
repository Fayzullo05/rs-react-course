'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type SelectionContextValue = {
  selectedIds: number[];
  toggleSelectedId: (id: number) => void;
  clearSelectedIds: () => void;
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

type Props = {
  children: ReactNode;
};

export function SelectionProvider({ children }: Props) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelectedId = (id: number) => {
    setSelectedIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((currentId) => currentId !== id)
        : [...currentIds, id]
    );
  };

  const clearSelectedIds = () => {
    setSelectedIds([]);
  };

  const value = useMemo(
    () => ({
      selectedIds,
      toggleSelectedId,
      clearSelectedIds,
    }),
    [selectedIds]
  );

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);

  if (!context) {
    throw new Error('useSelection must be used inside SelectionProvider');
  }

  return context;
}
