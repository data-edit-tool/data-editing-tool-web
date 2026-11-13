import { DndProvider as _DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

//DndProvider is a wrapper component that provides the React DnD context that React DnD needs to work properly.
//We need to wrap our App component with this provider component.
//We also need to pass the HTML5Backend as a prop to the DndProvider component.
//The HTML5Backend is a default backend that uses the HTML5 drag and drop API to do the work.

interface DndProviderProps {
  children: React.ReactNode;
}

// Dbd Provider
export default function DndProvider({ children }: DndProviderProps) {
  return <_DndProvider backend={HTML5Backend}>{children}</_DndProvider>;
}
