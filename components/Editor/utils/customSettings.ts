//inlines ,blocks 設定
import { Editor, Text, Element, Transforms } from 'slate';
const CustomEditor = {
    isCodeBlockActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: (n) => Element.isElement(n) && n.type === 'code',
        });

        return !!match;
    },
    isFormatActive(editor, format) {
        const [match] = Editor.nodes(editor, {
            match: (n) => n[format] === true,
            mode: 'all',
        });
        return !!match;
    },

    toggleFormat(editor, format) {
        const isActive = CustomEditor.isFormatActive(editor, format);
        Transforms.setNodes(editor, { [format]: isActive ? null : true }, { match: Text.isText, split: true });
    },
    toggleCodeBlock(editor) {
        const isActive = CustomEditor.isCodeBlockActive(editor);
        Transforms.setNodes(editor, { type: isActive ? null : 'code' }, { match: (n) => Editor.isBlock(editor, n) });
    },
};

export default CustomEditor;
