import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchLabels, setSelectedSection, setSelectedLabel, selectLabels, selectPins, selectRecents, selectSelectedSection, selectSelectedLabel, selectStatus } from '../store/labelSlice';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const labels = useAppSelector(selectLabels);
  const pins = useAppSelector(selectPins);
  const recents = useAppSelector(selectRecents);
  const selectedSection = useAppSelector(selectSelectedSection);
  const selectedLabel = useAppSelector(selectSelectedLabel);
  const status = useAppSelector(selectStatus);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchLabels());
    }
  }, [status, dispatch]);

  const handleSectionClick = (section: 'pin' | 'recent' | 'label') => {
    dispatch(setSelectedSection(section));
  };

  const handleLabelClick = (label: (Label:any)) => {
    dispatch(setSelectedLabel(label));
    dispatch(setSelectedSection('label'));
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <h2>Solana Trader ChatGPT</h2>
        <div>
          <button onClick={() => handleSectionClick('pin')}>Pin</button>
          <button onClick={() => handleSectionClick('recent')}>Recent</button>
          <button onClick={() => handleSectionClick('label')}>Labels</button>
        </div>
        <div>
          {selectedSection === 'pin' && (
            <ul>
              {pins.map((pin) => (
                <li key={pin.id}>{pin.name}</li>
              ))}
            </ul>
          )}
          {selectedSection === 'recent' && (
            <ul>
              {recents.map((recent, index) => (
                <li key={index}>{recent}</li>
              ))}
            </ul>
          )}
          {selectedSection === 'label' && (
            <ul>
              {labels.map((label) => (
                <li key={label.id} onClick={() => handleLabelClick(label)}>
                  {label.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {selectedSection && (
        <div className="sidebar-details">
          {selectedSection === 'pin' && (
            <div>
              <h3>Pin Topics</h3>
              {pins.flatMap((pin) => pin.tags).map((tag, index) => (
                <div key={index}>{tag}</div>
              ))}
            </div>
          )}
          {selectedSection === 'recent' && (
            <div>
              <h3>Recent Conversations</h3>
              {recents.map((recent, index) => (
                <div key={index}>{recent}</div>
              ))}
            </div>
          )}
          {selectedSection === 'label' && selectedLabel && (
            <div>
              <h3>{selectedLabel.name} Topics</h3>
              {selectedLabel.tags.map((tag, index) => (
                <div key={index}>{tag}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
