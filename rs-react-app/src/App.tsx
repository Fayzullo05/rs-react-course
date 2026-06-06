import { useState } from 'react';
import Modal from './components/modal/modal';
import './App.css';

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

      <div>
        <button type="button" onClick={() => setActiveModal('uncontrolled')}>
          Open Uncontrolled Form
        </button>

        <button type="button" onClick={() => setActiveModal('react-hook-form')}>
          Open React Hook Form
        </button>
      </div>

      {activeModal === 'uncontrolled' && (
        <Modal title="Uncontrolled Form" onClose={closeModal}>
          <p>Uncontrolled form.</p>
          <button type="button" onClick={closeModal}>
            Close
          </button>
        </Modal>
      )}

      {activeModal === 'react-hook-form' && (
        <Modal title="React Hook Form" onClose={closeModal}>
          <p>React Hook Form.</p>
          <button type="button" onClick={closeModal}>
            Close
          </button>
        </Modal>
      )}
    </main>
  );
}

export default App;
