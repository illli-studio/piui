import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { CanvasElement, ProjectState } from '../types';

const initialState: ProjectState = {
  canvasWidth: 1280,
  canvasHeight: 720,
  elements: [],
  selectedIds: [],
  zoom: 0.5,
  history: [[]],
  historyIndex: 0,
};

export function useCanvas() {
  const [state, setState] = useState<ProjectState>(initialState);
  const [tool, setTool] = useState<'select' | 'text' | 'rect' | 'circle' | 'image'>('select');

  const pushHistory = useCallback((elements: CanvasElement[]) => {
    setState((prev: ProjectState) => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push([...elements]);
      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState((prev: ProjectState) => {
      if (prev.historyIndex <= 0) return prev;
      const newIndex = prev.historyIndex - 1;
      return {
        ...prev,
        elements: [...prev.history[newIndex]],
        historyIndex: newIndex,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((prev: ProjectState) => {
      if (prev.historyIndex >= prev.history.length - 1) return prev;
      const newIndex = prev.historyIndex + 1;
      return {
        ...prev,
        elements: [...prev.history[newIndex]],
        historyIndex: newIndex,
      };
    });
  }, []);

  const setCanvasSize = useCallback((width: number, height: number) => {
    setState((prev: ProjectState) => ({ ...prev, canvasWidth: width, canvasHeight: height }));
  }, []);

  const addElement = useCallback((element: Omit<CanvasElement, 'id'>) => {
    const newElement: CanvasElement = { ...element, id: uuidv4() };
    setState((prev: ProjectState) => {
      const newElements = [...prev.elements, newElement];
      pushHistory(newElements);
      return {
        ...prev,
        elements: newElements,
        selectedIds: [newElement.id],
      };
    });
    return newElement.id;
  }, [pushHistory]);

  const addElements = useCallback((elements: Omit<CanvasElement, 'id'>[]) => {
    const newElements = elements.map((el) => ({ ...el, id: uuidv4() }));
    setState((prev: ProjectState) => {
      const allElements = [...prev.elements, ...newElements];
      pushHistory(allElements);
      return {
        ...prev,
        elements: allElements,
        selectedIds: newElements.map(el => el.id),
      };
    });
  }, [pushHistory]);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setState((prev: ProjectState) => {
      const newElements = prev.elements.map((el: CanvasElement) => 
        el.id === id ? { ...el, ...updates } : el
      );
      pushHistory(newElements);
      return { ...prev, elements: newElements };
    });
  }, [pushHistory]);

  const deleteElements = useCallback((ids: string[]) => {
    setState((prev: ProjectState) => {
      const newElements = prev.elements.filter((el: CanvasElement) => !ids.includes(el.id));
      pushHistory(newElements);
      return {
        ...prev,
        elements: newElements,
        selectedIds: prev.selectedIds.filter((id: string) => !ids.includes(id)),
      };
    });
  }, [pushHistory]);

  const selectElement = useCallback((id: string, addToSelection = false) => {
    setState((prev: ProjectState) => ({
      ...prev,
      selectedIds: addToSelection 
        ? [...prev.selectedIds, id]
        : [id],
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState((prev: ProjectState) => ({ ...prev, selectedIds: [] }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState((prev: ProjectState) => ({ ...prev, zoom: Math.max(0.1, Math.min(4, zoom)) }));
  }, []);

  const clearCanvas = useCallback(() => {
    setState((prev: ProjectState) => {
      pushHistory([]);
      return {
        ...prev,
        elements: [],
        selectedIds: [],
      };
    });
  }, [pushHistory]);

  const loadTemplate = useCallback((elements: Omit<CanvasElement, 'id'>[]) => {
    const newElements = elements.map((el) => ({ ...el, id: uuidv4() }));
    setState((prev: ProjectState) => {
      pushHistory(newElements);
      return {
        ...prev,
        elements: newElements,
        selectedIds: [],
      };
    });
  }, [pushHistory]);

  return {
    state,
    tool,
    setTool,
    setCanvasSize,
    addElement,
    addElements,
    updateElement,
    deleteElements,
    selectElement,
    clearSelection,
    setZoom,
    undo,
    redo,
    clearCanvas,
    loadTemplate,
  };
}
