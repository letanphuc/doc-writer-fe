import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Define a type for the component props
interface MarkdownDisplayProps {
  markdownText: string;
}

const MarkdownDisplay: React.FC<MarkdownDisplayProps> = ({markdownText}) => {
  return (
    <ReactMarkdown children={markdownText} remarkPlugins={[remarkGfm]}/>
  );
};

export default MarkdownDisplay;
