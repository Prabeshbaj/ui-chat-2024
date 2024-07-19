import React, { useState } from 'react';
import './Label.css';

interface LabelProps {
  label: { id: string; name: string; tags: string[] };
  addTag: (labelId: string, tag: string) => void;
  isExpanded: boolean;
}

const Label: React.FC<LabelProps> = ({ label, addTag, isExpanded }) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(label.id, newTag);
      setNewTag('');
    }
  };

  return (
    <div className={`label ${isExpanded ? 'expanded' : ''}`}>
      <div className="label-header">
        <span>{label.name}</span>
        <button onClick={handleAddTag}>Tag</button>
      </div>
      {isExpanded && (
        <div className="label-content">
          {label.tags.map((tag) => (
            <div key={tag} className="tag">{tag}</div>
          ))}
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
          />
          <button onClick={handleAddTag}>Add Tag</button>
        </div>
      )}
    </div>
  );
};

export default Label;
