import { BaseEditor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor, useSelected } from 'slate-react';
import isUrl from 'is-url';
import CustomEditor from '../utils/customSettings';

export const withLinks = (editor: BaseEditor & ReactEditor & HistoryEditor) => {
    const { insertData, insertText, isInline } = editor;

    editor.isInline = (element) => ['link', 'button'].includes(element.type) || isInline(element);

    editor.insertText = (text) => {
        if (text && isUrl(text)) {
            CustomEditor.wrapLink(editor, text);
        } else {
            insertText(text);
        }
    };

    editor.insertData = (data) => {
        const text = data.getData('text/plain');

        if (text && isUrl(text)) {
            CustomEditor.wrapLink(editor, text);
        } else {
            insertData(data);
        }
    };

    return editor;
};

//LinkElement
const InlineChromiumBugfix = () => (
    <span contentEditable={false} style={{ fontSize: 0 }}>
        ${String.fromCodePoint(160) /* Non-breaking space */}
    </span>
);

export const LinkComponent = ({ attributes, children, element }) => {
    const selected = useSelected();
    const STY = {
        boxShadow: selected ? '0 0 0 3px #ddd' : '',
    };
    return (
        <a {...attributes} href={element.url} style={STY} data-title={element.url}>
            <InlineChromiumBugfix />
            {children}
            <InlineChromiumBugfix />
        </a>
    );
};
