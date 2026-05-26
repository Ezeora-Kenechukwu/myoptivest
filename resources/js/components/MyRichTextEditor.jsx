import JoditEditor from 'jodit-react';
import React, { useMemo, useRef } from 'react'

const MyRichTextEditor = ({setValue, initialHtmlString}) => {

const editorRef = useRef()
const options =['bold',
    'italic',
    'underline',
    'strikethrough',
    'eraser',
    'ul',
    'ol',
    'font',
    'fontsize',
    'paragraph',
    'lineHeight',
    'superscript',
    'subscript',
    'classSpan',
    'file',
    'image',
    'video',
    'spellcheck',
    'speechRecognize',
    'cut',
    'copy',
    'paste',
    'selectall',
    'copyformat',
    'hr',
    'table',
    'link',
    'symbols',
    'ai-commands',
    'ai-assistant',
    'indent',
    'outdent',
    'left',
    'brush',
    'undo',
    'redo',
    'find',
    'source',
    'fullsize',
    'preview',
    'print',
    'about',
]
    const config = useMemo(
        () => ({
        readonly: false,
        placeholder: '',
        defaultActionOnPaste: 'insert_as_html',
        defaultLineHeight: 1.5,
        enter: 'div',
       // options that we defined in above step.
        buttons: options,
        buttonsMD: options,
        buttonsSM: options,
        buttonsXS: options,
        statusbar: false,
        sizeLG: 900,
        sizeMD: 700,
        sizeSM: 400,
        toolbarAdaptive: false,
        }),
        [],
       );
  return (
    <div>
        <JoditEditor
 ref={editorRef}
 value={initialHtmlString || ''}
 config={config}
 onChange={(htmlString) => setValue(htmlString)}
/>
    </div>
  )
}

export default MyRichTextEditor
