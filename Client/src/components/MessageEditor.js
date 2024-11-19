import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button, message } from 'antd';

const MessageEditor = ({ onSave }) => {
  const [messageTemplate, setMessageTemplate] = useState('');

  useEffect(() => {
    // Load saved template from local storage on component mount
    const savedTemplate = localStorage.getItem('messageTemplate');
    if (savedTemplate) {
      setMessageTemplate(savedTemplate);
    }
  }, []);

  const handleSave = () => {
    if (!messageTemplate) {
      message.error('Please enter a message template');
      return;
    }
    localStorage.setItem('messageTemplate', messageTemplate); // Save to local storage
    message.success('Message template saved');
  };

  const handleUseTemplate = () => {
    const savedTemplate = localStorage.getItem('messageTemplate');
    if (savedTemplate) {
      setMessageTemplate(savedTemplate);
      onSave(savedTemplate);
      message.success('Template applied');
    } else {
      message.error('No template found');
    }
  };

  return (
    <div>
      <h2>Custom Message Editor</h2>
      <ReactQuill
        value={messageTemplate}
        onChange={setMessageTemplate}
        placeholder="Write your message template here. Use placeholders like {{name}}, {{number}}, etc."
      />
      <Button type="primary" onClick={handleSave} style={{ marginTop: 16, marginRight: 8 }}>
        Save Template
      </Button>
      <Button onClick={handleUseTemplate} style={{ marginTop: 16 }}>
        Use Template
      </Button>
    </div>
  );
};

export default MessageEditor;