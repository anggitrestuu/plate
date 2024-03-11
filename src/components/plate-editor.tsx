'use client';

import React, { useRef } from 'react';
import { cn } from '@udecode/cn';
import { CommentsProvider } from '@udecode/plate-comments';
import {
  createPlateEditor,
  Plate,
  PlateStoreProvider,
} from '@udecode/plate-common';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { serializeHtml } from '@udecode/plate-serializer-html';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { serialize as serializeMarkdown } from 'remark-slate';

import { commentsUsers, myUserId } from '@/lib/plate/comments';
import { MENTIONABLES } from '@/lib/plate/mentionables';
import { plugins } from '@/lib/plate/plate-plugins';
import { CommentsPopover } from '@/components/plate-ui/comments-popover';
import { CursorOverlay } from '@/components/plate-ui/cursor-overlay';
import { Editor } from '@/components/plate-ui/editor';
import { FixedToolbar } from '@/components/plate-ui/fixed-toolbar';
import { FixedToolbarButtons } from '@/components/plate-ui/fixed-toolbar-buttons';
import { FloatingToolbar } from '@/components/plate-ui/floating-toolbar';
import { FloatingToolbarButtons } from '@/components/plate-ui/floating-toolbar-buttons';
import { MentionCombobox } from '@/components/plate-ui/mention-combobox';

import { serializePlateToMarkdown } from '../utils/serializer-md/serializer/serializePlateToMarkdown';

export default function PlateEditor() {
  const containerRef = useRef(null);
  const [editorValue, setEditorValue] = React.useState<any | null>(null);

  const [mdValue, setMdValue] = React.useState<any | null>(null);

  const initialValue = [
    {
      id: '1',
      type: ELEMENT_PARAGRAPH,
      children: [{ text: 'Hello, World!' }],
    },
  ];

  const excludedSelectionPlugin = plugins?.filter(
    (plugin) => plugin?.key !== 'blockSelection'
  );

  const editor = createPlateEditor({ plugins: excludedSelectionPlugin });

  const handleChange = (value: any) => {
    setEditorValue(value);

    // try {
    //   if (value) {
    //     const html = serializeHtml(editor, {
    //       nodes: value,
    //       dndWrapper: (props) => (
    //         <DndProvider backend={HTML5Backend} {...props} />
    //       ),
    //     });

    //     console.log('html', html);
    //   }
    // } catch (error) {
    //   console.log('error', error);
    // }
  };

  // make handle copy editorValue to clipboard
  const handleCopyEditorValue = () => {
    navigator.clipboard.writeText(JSON.stringify(editorValue));
  };

  const handleCopyHtml = () => {
    if (editorValue !== null) {
      const html = serializeHtml(editor, {
        nodes: editorValue,
        dndWrapper: (props) => (
          <DndProvider backend={HTML5Backend} {...props} />
        ),
      });

      navigator.clipboard.writeText(html);
    } else {
      console.log('editorValue is null');
    }
  };

  const handleCopyMarkdown = () => {
    if (editorValue !== null) {
      let mdText = '';

      console.log('editorValue', editorValue);

      try {
        mdText = serializePlateToMarkdown({
          nodes: editorValue,
        });
      } catch (error) {
        console.log('error', error);
      }

      console.log('mdText', mdText);

      navigator.clipboard.writeText(mdText);
    } else {
      console.log('editorValue is null');
    }
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <PlateStoreProvider>
          <CommentsProvider users={commentsUsers} myUserId={myUserId}>
            <Plate
              value={editorValue}
              plugins={plugins}
              initialValue={initialValue}
              onChange={handleChange}
            >
              <div
                ref={containerRef}
                className={cn(
                  'relative',
                  // Block selection
                  '[&_.slate-start-area-left]:!w-[64px] [&_.slate-start-area-right]:!w-[64px] [&_.slate-start-area-top]:!h-4'
                )}
              >
                <FixedToolbar>
                  <FixedToolbarButtons />
                </FixedToolbar>

                <Editor
                  className="px-[96px] py-16"
                  autoFocus
                  focusRing={false}
                  variant="ghost"
                  size="md"
                />

                <FloatingToolbar>
                  <FloatingToolbarButtons />
                </FloatingToolbar>

                <MentionCombobox items={MENTIONABLES} />

                <CommentsPopover />

                <CursorOverlay containerRef={containerRef} />
              </div>

              {/* <Serialized /> */}
            </Plate>
          </CommentsProvider>
        </PlateStoreProvider>
      </DndProvider>

      <button
        className="mt-4 p-2 bg-blue-500 text-white"
        onClick={handleCopyEditorValue}
      >
        Copy editorValue
      </button>

      <button
        className="mt-4 p-2 bg-blue-500 text-white"
        onClick={handleCopyHtml}
      >
        Copy HTML
      </button>
      <button
        className="mt-4 p-2 bg-blue-500 text-white"
        onClick={handleCopyMarkdown}
      >
        Copy Markdown
      </button>
    </>
  );
}
