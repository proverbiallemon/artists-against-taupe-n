import { forwardRef } from 'react';
import {
  MDXEditor,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  thematicBreakPlugin,
  codeBlockPlugin,
  markdownShortcutPlugin,
  type MDXEditorMethods,
  type MDXEditorProps
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

interface BlogEditorProps extends MDXEditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
}

async function uploadImage(file: File): Promise<string> {
  const token = localStorage.getItem('admin_token');
  
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/images/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload image');
  }
  
  const data = await response.json();
  return data.url;
}

const BlogEditor = forwardRef<MDXEditorMethods, BlogEditorProps>(
  ({ markdown, onChange, ...props }, ref) => {
    return (
      <div className="prose-editor">
        <MDXEditor
          ref={ref}
          markdown={markdown}
          onChange={onChange}
          plugins={[
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  <UndoRedo />
                  <BoldItalicUnderlineToggles />
                </>
              )
            }),
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            imagePlugin({
              imageUploadHandler: uploadImage,
              imageAutocompleteSuggestions: []
            }),
            tablePlugin(),
            thematicBreakPlugin(),
            codeBlockPlugin({
              defaultCodeBlockLanguage: 'javascript'
            }),
            markdownShortcutPlugin()
          ]}
          {...props}
        />
        <style>{`
          .prose-editor {
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            overflow: hidden;
          }
          
          .prose-editor .mdxeditor {
            font-family: inherit;
            background: white;
          }
          
          .prose-editor .mdxeditor-toolbar {
            background: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .prose-editor .mdxeditor-editor-wrapper {
            padding: 1rem;
            min-height: 400px;
          }
          
          .prose-editor .mdxeditor-root-contenteditable {
            outline: none;
          }
          
          .prose-editor .mdxeditor-root-contenteditable h1,
          .prose-editor .mdxeditor-root-contenteditable h2,
          .prose-editor .mdxeditor-root-contenteditable h3 {
            font-weight: 700;
            line-height: 1.25;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
          }
          
          .prose-editor .mdxeditor-root-contenteditable h1 {
            font-size: 2rem;
          }
          
          .prose-editor .mdxeditor-root-contenteditable h2 {
            font-size: 1.5rem;
          }
          
          .prose-editor .mdxeditor-root-contenteditable h3 {
            font-size: 1.25rem;
          }
          
          .prose-editor .mdxeditor-root-contenteditable p {
            margin-bottom: 1rem;
            line-height: 1.75;
          }
          
          .prose-editor .mdxeditor-root-contenteditable img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 1rem 0;
          }
          
          .prose-editor .mdxeditor-root-contenteditable ul,
          .prose-editor .mdxeditor-root-contenteditable ol {
            margin: 1rem 0;
            padding-left: 2rem;
          }
          
          .prose-editor .mdxeditor-root-contenteditable li {
            margin-bottom: 0.25rem;
          }
          
          .prose-editor .mdxeditor-root-contenteditable code {
            background: #f3f4f6;
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
          }
          
          .prose-editor .mdxeditor-root-contenteditable pre {
            background: #1f2937;
            color: #f3f4f6;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1rem 0;
          }
          
          .prose-editor .mdxeditor-root-contenteditable blockquote {
            border-left: 4px solid #4ECDC4;
            padding-left: 1rem;
            margin: 1rem 0;
            font-style: italic;
            color: #6b7280;
          }
        `}</style>
      </div>
    );
  }
);

BlogEditor.displayName = 'BlogEditor';

export default BlogEditor;