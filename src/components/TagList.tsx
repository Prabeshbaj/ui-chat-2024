import React from 'react';
import './TagList.css';

interface TagsListProps {
  tags: string[];
  onTagClick: (tag: string) => void;
}

const TagsList: React.FC<TagsListProps> = ({ tags, onTagClick }) => {
  return (
    <div className="tags-list">
      <h3>Tags</h3>
      <ul>
        {tags.map((tag, index) => (
          <li key={index} onClick={() => onTagClick(tag)}>
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TagsList;
