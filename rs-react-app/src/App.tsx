import { useState } from 'react';
import Modal from './components/modal/modal';
import './App.css';
import UncontrolledForm from './components/uncontrolledForm/uncontrolledForm';
import HookForm from './components/hookForm/hookForm';

function App() {
  const [activeModal, setActiveModal] = useState<
    'uncontrolled' | 'react-hook-form' | null
  >(null);

  const closeModal = (): void => {
    setActiveModal(null);
  };

  return (
    <main>
      <h1>React Forms</h1>

      <div className="buttons">
        <button type="button" onClick={() => setActiveModal('uncontrolled')}>
          Open Uncontrolled Form
        </button>

        <button type="button" onClick={() => setActiveModal('react-hook-form')}>
          Open React Hook Form
        </button>
      </div>

      {activeModal === 'uncontrolled' && (
        <Modal title="Uncontrolled Form" onClose={closeModal}>
          <UncontrolledForm onSuccess={closeModal} />
        </Modal>
      )}

      {activeModal === 'react-hook-form' && (
        <Modal title="React Hook Form" onClose={closeModal}>
          <HookForm onSuccess={closeModal} />
        </Modal>
      )}
    </main>
  );
}

export default App;
