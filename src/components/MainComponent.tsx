import React, { useState } from 'react';
import './dialog.css';

const MainComponent = () => {
  const [dialogType, setDialogType] = useState<string | null>(null);

  const handleMenuClick = (type:string) => {
    setDialogType(type);
  };

  const handleClose = () => {
    setDialogType(null);
  };

  return (
    <div>
      <button onClick={() => handleMenuClick('menu')}>Open Menu</button>

      {/* Main Menu Dialog */}
      {dialogType === 'menu' && (
        <div>
          <div className="overlay" onClick={handleClose}></div>
          <div className="dialog">
            <div className="dialog-title">Menu</div>
            <div className="dialog-content">
              <button onClick={() => handleMenuClick('create')}>Create Label</button>
              <button onClick={() => handleMenuClick('delete')}>Delete</button>
              <button onClick={() => handleMenuClick('rename')}>Rename</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Label Dialog */}
      {dialogType === 'create' && (
        <div>
          <div className="overlay" onClick={handleClose}></div>
          <div className="dialog">
            <div className="dialog-title">Create Label</div>
            <div className="dialog-content">
              <p>Here you can create a new label.</p>
            </div>
            <div className="dialog-actions">
              <button onClick={handleClose}>Cancel</button>
              <button onClick={handleClose}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {dialogType === 'delete' && (
        <div>
          <div className="overlay" onClick={handleClose}></div>
          <div className="dialog">
            <div className="dialog-title">Delete</div>
            <div className="dialog-content">
              <p>Here you can delete an item.</p>
            </div>
            <div className="dialog-actions">
              <button onClick={handleClose}>Cancel</button>
              <button onClick={handleClose}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Dialog */}
      {dialogType === 'rename' && (
        <div>
          <div className="overlay" onClick={handleClose}></div>
          <div className="dialog">
            <div className="dialog-title">Rename</div>
            <div className="dialog-content">
              <p>Here you can rename an item.</p>
            </div>
            <div className="dialog-actions">
              <button onClick={handleClose}>Cancel</button>
              <button onClick={handleClose}>Rename</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainComponent;
