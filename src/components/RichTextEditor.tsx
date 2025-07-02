'use client';

import { useState, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  title?: string;
  disableAutoSave?: boolean;
}

export default function RichTextEditor({ value, onChange, placeholder, title, disableAutoSave = false }: RichTextEditorProps) {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // Auto-save functionality (disabled when parent handles auto-save)
  useEffect(() => {
    if (!disableAutoSave && value && value.trim().length > 0) {
      setAutoSaveStatus('unsaved');
      
      const autoSaveTimer = setTimeout(() => {
        setAutoSaveStatus('saving');
        
        // Save to localStorage as draft
        const draft = {
          content: value,
          timestamp: new Date().toISOString(),
          wordCount: getWordCount().words
        };
        
        localStorage.setItem('blogDraft', JSON.stringify(draft));
        
        setTimeout(() => {
          setAutoSaveStatus('saved');
          setLastSaved(new Date());
        }, 500);
      }, 2000); // Auto-save after 2 seconds of inactivity
      
      return () => clearTimeout(autoSaveTimer);
    }
  }, [value, disableAutoSave]);

  // Load draft on component mount (disabled when parent handles auto-save)
  useEffect(() => {
    if (!disableAutoSave) {
      const savedDraft = localStorage.getItem('blogDraft');
      if (savedDraft && !value) {
        try {
          const draft = JSON.parse(savedDraft);
          if (confirm('A draft was found. Would you like to restore it?')) {
            onChange(draft.content);
            setLastSaved(new Date(draft.timestamp));
          }
        } catch (error) {
          console.error('Error loading draft:', error);
        }
      }
    }
  }, [disableAutoSave]);

  // Handle paste events for better formatting
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text/plain');
    
    // Clean up common formatting issues
    const cleanedText = pastedText
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\u2018|\u2019/g, "'") // Replace smart quotes
      .replace(/\u201c|\u201d/g, '"') // Replace smart double quotes
      .replace(/\u2013|\u2014/g, '-') // Replace em/en dashes
      .replace(/\u2026/g, '...'); // Replace ellipsis
    
    if (cleanedText !== pastedText) {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newValue = value.substring(0, start) + cleanedText + value.substring(end);
      handleContentChange(newValue);
      
      // Reset cursor position
      setTimeout(() => {
        textarea.setSelectionRange(start + cleanedText.length, start + cleanedText.length);
      }, 0);
    }
  };

  // Clear draft
  const clearDraft = () => {
    localStorage.removeItem('blogDraft');
    setLastSaved(null);
    setAutoSaveStatus('saved');
  };

  // Add to history for undo/redo
  const addToHistory = (newValue: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newValue);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Handle content change with history
  const handleContentChange = (newValue: string) => {
    onChange(newValue);
    addToHistory(newValue);
  };

  // Undo function
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  // Redo function
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  // Keyboard shortcuts handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          formatBold();
          break;
        case 'i':
          e.preventDefault();
          formatItalic();
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          break;
        case 'y':
          e.preventDefault();
          redo();
          break;
      }
    }
  };

  // Calculate word and character count
  const getWordCount = () => {
    if (!value) return { words: 0, characters: 0 };
    const words = value.trim() ? value.trim().split(/\s+/).length : 0;
    const characters = value.length;
    return { words, characters };
  };

  // Open preview in new tab using actual blog page
  const openPreview = () => {
    const previewTitle = title || 'Blog Preview';
    const encodedContent = encodeURIComponent(value);
    const encodedTitle = encodeURIComponent(previewTitle);
    
    const previewUrl = `/admin/preview?content=${encodedContent}&title=${encodedTitle}`;
    window.open(previewUrl, '_blank');
  };

  // Format text with bold
  const formatBold = () => {
    const textarea = document.querySelector('.rich-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (selectedText) {
      const newText = textarea.value.substring(0, start) + 
                     `**${selectedText}**` + 
                     textarea.value.substring(end);
      onChange(newText);
      
      // Reset cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 2, end + 2);
      }, 0);
    }
  };

  // Format text with italic
  const formatItalic = () => {
    const textarea = document.querySelector('.rich-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (selectedText) {
      const newText = textarea.value.substring(0, start) + 
                     `*${selectedText}*` + 
                     textarea.value.substring(end);
      onChange(newText);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 1, end + 1);
      }, 0);
    }
  };

  // Add H1 header
  const addH1Header = () => {
    const textarea = document.querySelector('.rich-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || 'Main Header';
    
    const newText = textarea.value.substring(0, start) + 
                   `# ${selectedText}` + 
                   textarea.value.substring(end);
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, start + 2 + selectedText.length);
    }, 0);
  };

  // Add H2 header
  const addH2Header = () => {
    const textarea = document.querySelector('.rich-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || 'Sub Header';
    
    const newText = textarea.value.substring(0, start) + 
                   `## ${selectedText}` + 
                   textarea.value.substring(end);
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 3, start + 3 + selectedText.length);
    }, 0);
  };

  // Add bullet list
  const addBulletList = () => {
    const textarea = document.querySelector('.rich-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (selectedText) {
      // Convert selected text to bullet points
      const lines = selectedText.split('\n').filter(line => line.trim().length > 0);
      const bulletPoints = lines.map(line => `- ${line.trim()}`).join('\n');
      
      const newText = textarea.value.substring(0, start) + 
                     bulletPoints + 
                     textarea.value.substring(end);
      onChange(newText);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + bulletPoints.length);
      }, 0);
    } else {
      // Add new bullet points
      const newText = textarea.value.substring(0, start) + 
                     '- Your bullet point\n- Another bullet point' + 
                     textarea.value.substring(start);
      onChange(newText);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 2, start + 18);
      }, 0);
    }
  };

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        const imageUrl = result.url;
        
        // Add to uploaded images list
        setUploadedImages(prev => [imageUrl, ...prev]);
        
        // Insert into editor
        insertImageUrl(imageUrl);
      } else {
        alert('Failed to upload image. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Insert image URL
  const insertImageUrl = (url: string) => {
    const textarea = document.querySelector('.rich-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const newText = textarea.value.substring(0, start) + 
                   `\n![Image](${url})\n` + 
                   textarea.value.substring(start);
    onChange(newText);
    setImageUrl('');
    setIsImageDialogOpen(false);
    
    setTimeout(() => {
      textarea.focus();
    }, 0);
  };

  // Insert image from URL
  const insertImage = () => {
    if (imageUrl) {
      insertImageUrl(imageUrl);
    }
  };

  // Insert link
  const insertLink = () => {
    if (linkUrl && linkText) {
      const textarea = document.querySelector('.rich-editor-textarea') as HTMLTextAreaElement;
      if (!textarea) return;
      
      const start = textarea.selectionStart;
      const newText = textarea.value.substring(0, start) + 
                     `[${linkText}](${linkUrl})` + 
                     textarea.value.substring(start);
      onChange(newText);
      setLinkUrl('');
      setLinkText('');
      setIsLinkDialogOpen(false);
      
      setTimeout(() => {
        textarea.focus();
      }, 0);
    }
  };

  // Convert markdown-like syntax to HTML for preview
  const getPreviewHtml = (text: string) => {
    return text
      // H1 Headers
      .replace(/^# (.+)$/gm, '<h1 class="blog-preview-h1">$1</h1>')
      // H2 Headers
      .replace(/^## (.+)$/gm, '<h2 class="blog-preview-h2">$1</h2>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong class="blog-preview-bold">$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em class="blog-preview-italic">$1</em>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="blog-preview-image" />')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="blog-preview-link">$1</a>')
      // Bullet lists
      .replace(/^- (.+)$/gm, '<li class="blog-preview-list-item">$1</li>')
      .replace(/(<li class="blog-preview-list-item">.*<\/li>)/gs, '<ul class="blog-preview-list">$1</ul>')
      // Paragraphs
      .replace(/^(?!<[hul]|<li)(.+)$/gm, '<p class="blog-preview-paragraph">$1</p>')
      // Line breaks
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="rich-text-editor">
      {/* Modern Toolbar */}
      <div className="toolbar" style={{
        border: '1px solid #e5e7eb',
        borderBottom: 'none',
        borderRadius: '12px 12px 0 0',
        background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
        padding: '12px 16px',
        display: 'flex',
        gap: '4px',
        flexWrap: 'wrap',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Undo/Redo */}
        <button
          type="button"
          onClick={undo}
          disabled={historyIndex <= 0}
          className="toolbar-btn"
          title="Undo (Ctrl+Z)"
          style={{
            padding: '8px 10px',
            border: 'none',
            borderRadius: '8px',
            background: historyIndex <= 0 ? '#f3f4f6' : '#ffffff',
            cursor: historyIndex <= 0 ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            color: historyIndex <= 0 ? '#9ca3af' : '#374151',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.15s ease',
            minWidth: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ↶
        </button>
        
        <button
          type="button"
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="toolbar-btn"
          title="Redo (Ctrl+Y)"
          style={{
            padding: '8px 10px',
            border: 'none',
            borderRadius: '8px',
            background: historyIndex >= history.length - 1 ? '#f3f4f6' : '#ffffff',
            cursor: historyIndex >= history.length - 1 ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            color: historyIndex >= history.length - 1 ? '#9ca3af' : '#374151',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.15s ease',
            minWidth: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ↷
        </button>
        
        {/* Separator */}
        <div style={{ width: '1px', height: '24px', background: '#e5e7eb', margin: '6px 4px' }}></div>
        
        <button
          type="button"
          onClick={formatBold}
          className="toolbar-btn"
          title="Bold (Ctrl+B)"
          style={{
            padding: '8px 10px',
            border: 'none',
            borderRadius: '8px',
            background: '#ffffff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.15s ease',
            minWidth: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <strong>B</strong>
        </button>
        
        <button
          type="button"
          onClick={formatItalic}
          className="toolbar-btn"
          title="Italic (Ctrl+I)"
          style={{
            padding: '8px 10px',
            border: 'none',
            borderRadius: '8px',
            background: '#ffffff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.15s ease',
            minWidth: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <em style={{ fontStyle: 'italic', fontWeight: '500' }}>I</em>
        </button>
        
        <button
          type="button"
          onClick={addH1Header}
          className="toolbar-btn"
          title="Add Main Header"
          style={{
            padding: '8px 10px',
            border: 'none',
            borderRadius: '8px',
            background: '#ffffff',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '700',
            color: '#374151',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.15s ease',
            minWidth: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          H1
        </button>
        
        <button
          type="button"
          onClick={addH2Header}
          className="toolbar-btn"
          title="Add Sub Header"
          style={{
            padding: '8px 10px',
            border: 'none',
            borderRadius: '8px',
            background: '#ffffff',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '700',
            color: '#374151',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.15s ease',
            minWidth: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          H2
        </button>
        
        <button
          type="button"
          onClick={addBulletList}
          className="toolbar-btn"
          title="Bullet List"
          style={{
            padding: '8px 10px',
            border: 'none',
            borderRadius: '8px',
            background: '#ffffff',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            color: '#374151',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.15s ease',
            minWidth: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: '1'
          }}
        >
          • List
        </button>
        
        <button
          type="button"
          onClick={() => setIsImageDialogOpen(true)}
          className="toolbar-btn"
          title="Insert Image"
          style={{
            padding: '8px 10px',
            border: 'none',
            borderRadius: '8px',
            background: '#ffffff',
            cursor: 'pointer',
            fontSize: '10px',
            fontWeight: '600',
            color: '#374151',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.15s ease',
            minWidth: '60px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Upload Image
        </button>
        
        <button
          type="button"
          onClick={() => setIsLinkDialogOpen(true)}
          className="toolbar-btn"
          title="Insert Link"
          style={{
            padding: '8px 10px',
            border: 'none',
            borderRadius: '8px',
            background: '#ffffff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.15s ease',
            minWidth: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          🔗
        </button>
        
        {/* Separator */}
        <div style={{ width: '1px', height: '24px', background: '#e5e7eb', margin: '6px 4px' }}></div>
        
        {/* Preview Button */}
        <button
          type="button"
          onClick={openPreview}
          className="toolbar-btn"
          title="Preview in New Tab"
          style={{
            padding: '8px 10px',
            border: 'none',
            borderRadius: '8px',
            background: '#D959B3',
            cursor: 'pointer',
            fontSize: '10px',
            fontWeight: '600',
            color: '#ffffff',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.15s ease',
            minWidth: '50px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Preview
        </button>
      </div>

      {/* Simple Textarea Editor */}
      <div>
        <textarea
          className="rich-editor-textarea"
          value={value}
          onChange={(e) => handleContentChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder || "Start writing your blog post...\n\nKeyboard shortcuts:\n- Ctrl+B for bold\n- Ctrl+I for italic\n- Ctrl+Z for undo\n- Ctrl+Y for redo\n\nMarkdown syntax:\n- **bold text** for bold\n- *italic text* for italic\n- # Main Header for H1\n- ## Sub Header for H2\n- ![Image](url) for images\n- [Link Text](url) for links"}
          style={{
            width: '100%',
            minHeight: '400px',
            border: '1px solid #d1d5db',
            borderRadius: '0 0 8px 8px',
            padding: '16px',
            background: '#fff',
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: '1.1rem',
            lineHeight: '1.7',
            color: '#09090A',
            outline: 'none',
            resize: 'vertical'
          }}
        />
        
        {/* Word Count and Status Display */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 16px',
          background: '#f8fafc',
          border: '1px solid #e5e7eb',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>{getWordCount().words} words • {getWordCount().characters} characters</span>
            
            {/* Auto-save status (only show when not disabled) */}
            {!disableAutoSave && (
              <>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: autoSaveStatus === 'saved' ? '#10b981' : autoSaveStatus === 'saving' ? '#f59e0b' : '#6b7280'
                }}>
                  {autoSaveStatus === 'saved' && '✓ Draft saved'}
                  {autoSaveStatus === 'saving' && '⏳ Saving...'}
                  {autoSaveStatus === 'unsaved' && '• Unsaved changes'}
                </span>
                
                {lastSaved && (
                  <span>
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </span>
                )}
              </>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>Shortcuts: Ctrl+B (bold), Ctrl+I (italic), Ctrl+Z (undo)</span>
            {!disableAutoSave && lastSaved && (
              <button
                onClick={clearDraft}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '11px',
                  textDecoration: 'underline'
                }}
              >
                Clear Draft
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Image Dialog */}
      {isImageDialogOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '8px',
            width: '400px',
            maxWidth: '90vw'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Insert Image</h3>
            
            {/* Upload Section */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: isUploading ? 'not-allowed' : 'pointer'
                }}
              />
              {isUploading && (
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Uploading...</div>
              )}
            </div>
            
            {/* Image Library */}
            {uploadedImages.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Recent Uploads</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', maxHeight: '120px', overflowY: 'auto' }}>
                  {uploadedImages.map((img, index) => (
                    <div
                      key={index}
                      style={{
                        cursor: 'pointer',
                        border: '2px solid #d1d5db',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        aspectRatio: '1'
                      }}
                      onClick={() => insertImageUrl(img)}
                    >
                      <img
                        src={img}
                        alt="Uploaded"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Or enter URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setIsImageDialogOpen(false)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertImage}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  background: '#D959B3',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Dialog */}
      {isLinkDialogOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '8px',
            width: '400px',
            maxWidth: '90vw'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Insert Link</h3>
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Link text..."
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                marginBottom: '12px',
                fontSize: '14px'
              }}
            />
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL..."
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                marginBottom: '16px',
                fontSize: '14px'
              }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setIsLinkDialogOpen(false)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertLink}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  background: '#D959B3',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .toolbar-btn:hover {
          background: #f3f4f6 !important;
        }
        
        .rich-editor-textarea:focus {
          border-color: #D959B3 !important;
          box-shadow: 0 0 0 2px rgba(217, 89, 179, 0.1) !important;
        }
        
        .blog-content-preview h1 {
          font-family: var(--font-gowun-batang);
          font-size: 2.5rem !important;
          font-weight: 300 !important;
          color: #09090A !important;
          margin-top: 2rem !important;
          margin-bottom: 1rem !important;
          line-height: 1.2 !important;
        }
        
        .blog-content-preview h2 {
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 1.5rem !important;
          font-weight: 700 !important;
          color: #09090A !important;
          margin-top: 1.25rem !important;
          margin-bottom: 0.75rem !important;
          line-height: 1.3 !important;
        }
        
        .blog-content-preview p {
          margin-bottom: 1.5rem !important;
          font-size: 1.1rem !important;
          line-height: 1.7 !important;
          color: #09090A !important;
        }
        
        .blog-content-preview ul {
          margin: 1.5rem 0 !important;
          padding-left: 1.5rem !important;
          list-style-type: disc !important;
          list-style-position: outside !important;
        }
        
        .blog-content-preview li {
          margin-bottom: 0.5rem !important;
          font-size: 1.1rem !important;
          line-height: 1.6 !important;
          display: list-item !important;
          list-style-type: disc !important;
        }
        
        .blog-content-preview img {
          border-radius: 16px !important;
          margin: 2rem 0 !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          max-width: 100% !important;
        }
        
        .blog-content-preview a {
          color: #D959B3 !important;
          text-decoration: underline !important;
        }
        
        .blog-content-preview strong {
          font-weight: 600 !important;
        }
        
        .blog-content-preview em {
          font-style: italic !important;
        }
        
        .blog-preview-h1 {
          font-family: var(--font-gowun-batang);
          font-size: 2.5rem !important;
          font-weight: 300 !important;
          color: #09090A !important;
          margin-top: 2rem !important;
          margin-bottom: 1rem !important;
          line-height: 1.2 !important;
        }
        
        .blog-preview-h2 {
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 1.5rem !important;
          font-weight: 700 !important;
          color: #09090A !important;
          margin-top: 1.25rem !important;
          margin-bottom: 0.75rem !important;
          line-height: 1.3 !important;
        }
        
        .blog-preview-paragraph {
          margin-bottom: 1.5rem !important;
          font-size: 1.1rem !important;
          line-height: 1.7 !important;
          color: #09090A !important;
        }
        
        .blog-preview-bold {
          font-weight: 600 !important;
        }
        
        .blog-preview-italic {
          font-style: italic !important;
        }
        
        .blog-preview-list {
          margin: 1.5rem 0 !important;
          padding-left: 1.5rem !important;
          list-style-type: disc !important;
          list-style-position: outside !important;
        }
        
        .blog-preview-list-item {
          margin-bottom: 0.5rem !important;
          font-size: 1.1rem !important;
          line-height: 1.6 !important;
          display: list-item !important;
          list-style-type: disc !important;
        }
        
        .blog-preview-image {
          border-radius: 16px !important;
          margin: 2rem 0 !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          max-width: 100% !important;
        }
        
        .blog-preview-link {
          color: #D959B3 !important;
          text-decoration: underline !important;
        }
        
        .blog-preview-link:hover {
          color: #B8479E !important;
        }
      `}</style>
    </div>
  );
}