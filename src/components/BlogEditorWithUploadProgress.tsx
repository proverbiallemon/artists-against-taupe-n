import { forwardRef, useState } from 'react';
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
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  Separator,
  InsertCodeBlock,
  type MDXEditorMethods,
  type MDXEditorProps
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

interface BlogEditorWithUploadProgressProps extends MDXEditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
}

const BlogEditorWithUploadProgress = forwardRef<MDXEditorMethods, BlogEditorWithUploadProgressProps>(
  ({ markdown, onChange, ...props }, ref) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    async function uploadImage(file: File): Promise<string> {
      setIsUploading(true);
      setUploadProgress(0);
      
      const token = localStorage.getItem('admin_token');
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        // Simulate progress (since we can't get actual upload progress with fetch)
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        const response = await fetch('/api/images/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
        
        const data = await response.json();
        
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
        
        return data.url;
      } catch (error) {
        setIsUploading(false);
        setUploadProgress(0);
        throw error;
      }
    }

    return (
      <div className="prose-editor relative">
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center rounded-lg">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <p className="text-sm font-medium mb-2">Uploading image...</p>
              <div className="w-64 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center">{uploadProgress}%</p>
            </div>
          </div>
        )}
        <MDXEditor
          ref={ref}
          markdown={markdown}
          onChange={onChange}
          plugins={[
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  <UndoRedo />
                  <Separator />
                  <BoldItalicUnderlineToggles />
                  <Separator />
                  <BlockTypeSelect />
                  <Separator />
                  <ListsToggle />
                  <Separator />
                  <CreateLink />
                  <InsertImage />
                  <Separator />
                  <InsertTable />
                  <InsertThematicBreak />
                  <Separator />
                  <InsertCodeBlock />
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
            position: relative;
          }
          
          .prose-editor .mdxeditor {
            font-family: inherit;
            background: white;
          }
          
          .prose-editor .mdxeditor-toolbar {
            background: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
            padding: 0.5rem;
            gap: 0.25rem;
            flex-wrap: wrap;
          }
          
          .prose-editor .mdxeditor-toolbar button {
            padding: 0.375rem;
            border-radius: 0.375rem;
            transition: all 0.2s;
          }
          
          .prose-editor .mdxeditor-toolbar button:hover {
            background: #e5e7eb;
          }
          
          .prose-editor .mdxeditor-toolbar button[data-state="on"] {
            background: #4ECDC4;
            color: white;
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

BlogEditorWithUploadProgress.displayName = 'BlogEditorWithUploadProgress';

export default BlogEditorWithUploadProgress;