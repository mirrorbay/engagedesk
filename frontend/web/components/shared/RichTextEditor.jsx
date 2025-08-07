import React, { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Link,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import styles from "../../styles/shared/richTextEditor.module.css";

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Enter your content here...",
}) => {
  const editorRef = useRef(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleInput();
  };

  const handleKeyDown = (e) => {
    // Handle tab key for indentation
    if (e.key === "Tab") {
      e.preventDefault();
      execCommand("insertHTML", "&nbsp;&nbsp;&nbsp;&nbsp;");
    }
  };

  const handleLinkInsert = () => {
    if (linkUrl && linkText) {
      execCommand(
        "insertHTML",
        `<a href="${linkUrl}" target="_blank">${linkText}</a>`
      );
      setIsLinkModalOpen(false);
      setLinkUrl("");
      setLinkText("");
    }
  };

  const openLinkModal = () => {
    const selection = window.getSelection();
    if (selection.toString()) {
      setLinkText(selection.toString());
    }
    setIsLinkModalOpen(true);
  };

  return (
    <div className={styles.richTextEditor}>
      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => execCommand("bold")}
          title="Bold"
        >
          <Bold size={16} />
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => execCommand("italic")}
          title="Italic"
        >
          <Italic size={16} />
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => execCommand("underline")}
          title="Underline"
        >
          <Underline size={16} />
        </button>

        <div className={styles.separator}></div>

        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => execCommand("justifyLeft")}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => execCommand("justifyCenter")}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => execCommand("justifyRight")}
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>

        <div className={styles.separator}></div>

        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => execCommand("insertUnorderedList")}
          title="Bullet List"
        >
          <List size={16} />
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => execCommand("insertOrderedList")}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>

        <div className={styles.separator}></div>

        <button
          type="button"
          className={styles.toolbarButton}
          onClick={openLinkModal}
          title="Insert Link"
        >
          <Link size={16} />
        </button>

        <select
          className={styles.formatSelect}
          onChange={(e) => execCommand("formatBlock", e.target.value)}
          defaultValue=""
        >
          <option value="">Format</option>
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
        </select>
      </div>

      <div
        ref={editorRef}
        className={styles.editor}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      {isLinkModalOpen && (
        <div className={styles.linkModal}>
          <div className={styles.linkModalContent}>
            <h3>Insert Link</h3>
            <div className={styles.linkInputGroup}>
              <label>Link Text:</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Enter link text"
              />
            </div>
            <div className={styles.linkInputGroup}>
              <label>URL:</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className={styles.linkModalActions}>
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLinkInsert}
                className={styles.insertButton}
                disabled={!linkUrl || !linkText}
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
