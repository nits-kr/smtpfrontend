// components/RichTextEditor.jsx
import React, { useState, useEffect, useRef } from "react";
import {
    FiBold,
    FiItalic,
    FiUnderline,
    FiList,
    FiAlignLeft,
    FiAlignCenter,
    FiAlignRight,
    FiAlignJustify,
    FiLink,
    FiImage,
    FiMinus,
    FiRotateCcw,
    FiRotateCw,
    FiX,
    FiCheck,
    FiTrash2,
    FiCode,
    FiType,
    FiDroplet,
    FiCornerUpLeft,
    FiCornerUpRight,
    FiMoreHorizontal
} from "react-icons/fi";
import { FaStrikethrough } from "react-icons/fa";

const RichTextEditor = ({ value, onChange, onClose }) => {
    const iframeRef = useRef(null);
    const [viewSource, setViewSource] = useState(false);
    const [sourceCode, setSourceCode] = useState(value || "");

    // Initialize iframe content
    useEffect(() => {
        const iframe = iframeRef.current;
        if (iframe && !viewSource) {
            const doc = iframe.contentDocument || iframe.contentWindow.document;

            doc.designMode = "on";
            doc.open();
            doc.write(value || "");
            doc.close();

            // Ensure decent default styling for the editable area so it doesn't look broken
            if (!doc.querySelector("style")) {
                const style = doc.createElement("style");
                style.textContent = `
          body { font-family: -apple-system, system-ui, sans-serif; padding: 1rem; color: #333; line-height: 1.5; }
          a { color: #2563eb; text-decoration: underline; }
          ul, ol { margin-left: 20px; }
          img { max-width: 100%; height: auto; }
          blockquote { border-left: 4px solid #ccc; padding-left: 10px; margin-left: 0; color: #666; }
`;
                doc.head.appendChild(style);
            }

            const handleInput = () => {
                const content = doc.documentElement.outerHTML;
                onChange(content);
                setSourceCode(content); // Keep sync
            };

            doc.body.addEventListener("input", handleInput);
            doc.body.addEventListener("keyup", handleInput);
            doc.body.addEventListener("click", handleInput);

            return () => {
                if (doc.body) {
                    doc.body.removeEventListener("input", handleInput);
                    doc.body.removeEventListener("keyup", handleInput);
                    doc.body.removeEventListener("click", handleInput);
                }
            };
        }
    }, [viewSource]); // Re-init when switching back from source view

    const execCmd = (command, value = null) => {
        const iframe = iframeRef.current;
        if (iframe && !viewSource) {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            doc.execCommand(command, false, value);

            const event = new Event('input', { bubbles: true });
            doc.body.dispatchEvent(event);
            onChange(doc.documentElement.outerHTML);
        }
    };

    const handleSourceChange = (e) => {
        setSourceCode(e.target.value);
        onChange(e.target.value);
    };

    const insertLink = () => {
        const url = prompt("Enter link URL:", "https://");
        if (url) execCmd("createLink", url);
    };

    const insertImage = () => {
        const url = prompt("Enter image URL:", "https://");
        if (url) execCmd("insertImage", url);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden border border-gray-200">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50/80 backdrop-blur-sm shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <FiType />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Professional Email Editor</h3>
                            <p className="text-xs text-gray-500">Design beautiful, responsive HTML emails</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Toolbar - Only visible in Design Mode */}
                {!viewSource && (
                    <div className="bg-white text-gray-600 border-b border-gray-200 p-2 flex flex-wrap gap-1 items-center shrink-0 shadow-sm z-10">

                        <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2 mr-1">
                            <select
                                onChange={(e) => execCmd("formatBlock", e.target.value)}
                                className="h-8 text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 px-1 bg-gray-50 hover:bg-white cursor-pointer"
                                defaultValue=""
                            >
                                <option value="" disabled>Format</option>
                                <option value="p">Paragraph</option>
                                <option value="h1">Heading 1</option>
                                <option value="h2">Heading 2</option>
                                <option value="h3">Heading 3</option>
                                <option value="pre">Code Block</option>
                                <option value="blockquote">Quote</option>
                            </select>
                        </div>

                        <div className="flex gap-0.5 border-r border-gray-200 pr-2 mr-1">
                            <ToolbarButton icon={<FiBold />} onClick={() => execCmd("bold")} label="Bold (Ctrl+B)" />
                            <ToolbarButton icon={<FiItalic />} onClick={() => execCmd("italic")} label="Italic (Ctrl+I)" />
                            <ToolbarButton icon={<FiUnderline />} onClick={() => execCmd("underline")} label="Underline (Ctrl+U)" />
                            <ToolbarButton icon={<FaStrikethrough />} onClick={() => execCmd("strikeThrough")} label="Strikethrough" />
                        </div>

                        <div className="flex gap-0.5 border-r border-gray-200 pr-2 mr-1">
                            <div className="relative group">
                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Text Color">
                                    <FiDroplet size={18} />
                                    <span className="sr-only">Color</span>
                                </button>
                                <input
                                    type="color"
                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                    onChange={(e) => execCmd("foreColor", e.target.value)}
                                    title="Text Color"
                                />
                            </div>
                            <div className="relative group">
                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Background Color">
                                    <div className="w-4 h-4 bg-yellow-200 border border-gray-300 rounded-sm mx-0.5"></div>
                                </button>
                                <input
                                    type="color"
                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                    onChange={(e) => execCmd("hiliteColor", e.target.value)}
                                    title="Highlight Color"
                                />
                            </div>
                        </div>

                        <div className="flex gap-0.5 border-r border-gray-200 pr-2 mr-1">
                            <ToolbarButton icon={<FiAlignLeft />} onClick={() => execCmd("justifyLeft")} label="Align Left" />
                            <ToolbarButton icon={<FiAlignCenter />} onClick={() => execCmd("justifyCenter")} label="Align Center" />
                            <ToolbarButton icon={<FiAlignRight />} onClick={() => execCmd("justifyRight")} label="Align Right" />
                            <ToolbarButton icon={<FiAlignJustify />} onClick={() => execCmd("justifyFull")} label="Justify" />
                        </div>

                        <div className="flex gap-0.5 border-r border-gray-200 pr-2 mr-1">
                            <ToolbarButton icon={<FiList />} onClick={() => execCmd("insertUnorderedList")} label="Bullet List" />
                            <ToolbarButton icon={<FiMoreHorizontal />} onClick={() => execCmd("insertOrderedList")} label="Numbered List" />
                            <ToolbarButton icon={<FiCornerUpLeft />} onClick={() => execCmd("outdent")} label="Decrease Indent" />
                            <ToolbarButton icon={<FiCornerUpRight />} onClick={() => execCmd("indent")} label="Increase Indent" />
                        </div>

                        <div className="flex gap-0.5 border-r border-gray-200 pr-2 mr-1">
                            <ToolbarButton icon={<FiLink />} onClick={insertLink} label="Insert Link" />
                            <ToolbarButton icon={<FiImage />} onClick={insertImage} label="Insert Image" />
                            <ToolbarButton icon={<FiMinus />} onClick={() => execCmd("insertHorizontalRule")} label="Horizontal Line" />
                        </div>

                        <div className="flex gap-0.5">
                            <ToolbarButton icon={<FiRotateCcw />} onClick={() => execCmd("undo")} label="Undo (Ctrl+Z)" />
                            <ToolbarButton icon={<FiRotateCw />} onClick={() => execCmd("redo")} label="Redo (Ctrl+Y)" />
                            <ToolbarButton icon={<FiTrash2 />} onClick={() => execCmd("removeFormat")} label="Clear Formatting" />
                        </div>

                    </div>
                )}

                {/* Content Area */}
                <div className="flex-1 bg-gray-100 relative overflow-hidden flex flex-col">
                    {viewSource ? (
                        <textarea
                            className="w-full h-full p-4 font-mono text-xs text-gray-300 bg-[#1e1e1e] resize-none focus:outline-none"
                            value={sourceCode}
                            onChange={handleSourceChange}
                            spellCheck={false}
                        />
                    ) : (
                        <div className="w-full h-full bg-white relative">
                            <iframe
                                ref={iframeRef}
                                title="wysiwyg-editor"
                                className="w-full h-full border-0 block"
                            />
                        </div>
                    )}
                </div>

                {/* Footer actions */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setViewSource(!viewSource)}
                            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewSource
                                ? "bg-slate-800 text-white shadow-md ring-2 ring-slate-400"
                                : "bg-white text-slate-700 border border-gray-300 hover:bg-gray-100"
                                } `}
                        >
                            <FiCode className="w-4 h-4" />
                            {viewSource ? "Switch to Visual Editor" : "View Source Code"}
                        </button>

                        <div className="text-xs text-gray-500 hidden md:block">
                            {viewSource ? "Editing HTML source directly." : "WYSIWYG Mode enabled."}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                if (window.confirm("Clear all content? This cannot be undone.")) {
                                    if (viewSource) {
                                        setSourceCode("");
                                        onChange("");
                                    } else {
                                        const iframe = iframeRef.current;
                                        iframe.contentDocument.body.innerHTML = "";
                                        onChange("");
                                    }
                                }
                            }}
                            className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                        >
                            Clear
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm font-medium flex items-center gap-2"
                        >
                            <FiCheck className="w-4 h-4" />
                            Save & Exit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ToolbarButton = ({ icon, onClick, label }) => (
    <button
        type="button"
        onClick={onClick}
        title={label}
        className="p-1.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-all active:scale-95"
    >
        {React.cloneElement(icon, { size: 18 })}
    </button>
);

export default RichTextEditor;