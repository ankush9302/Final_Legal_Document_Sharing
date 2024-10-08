import React, { useState, useEffect } from 'react';
import { List } from 'antd';

const DocumentLinks = () => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch('/api/document-links');
        const data = await response.json();
        setLinks(data);
      } catch (error) {
        console.error('Error fetching document links:', error);
      }
    };

    fetchLinks();
  }, []);

  return (
    <List
      header={<div>Document Links</div>}
      bordered
      dataSource={links}
      renderItem={(item, index) => (
        <List.Item>
          <a href={item} target="_blank" rel="noopener noreferrer">
            Page {index + 1}
          </a>
        </List.Item>
      )}
    />
  );
};

export default DocumentLinks;