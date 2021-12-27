//inlines ,blocks 設定
import { Editor, Text, Element, Transforms } from 'slate';

const CustomEditor = {
    isBlockActive(editor, format) {
        const { selection } = editor;
        if (!selection) return false;
        const [match] = Array.from(
            Editor.nodes(editor, {
                match: (n) => Element.isElement(n) && n.type === format,
            }),
        );

        return !!match;
    },
    isFormatActive(editor, format) {
        const [match] = Editor.nodes(editor, {
            match: (n) => n[format] === true,
            mode: 'all',
        });
        return !!match;
    },
    List_TYPES: ['numbered-list', 'bulleted-list'],
    //文字樣式
    toggleFormat(editor, format) {
        const isActive = CustomEditor.isFormatActive(editor, format);
        Transforms.setNodes(editor, { [format]: isActive ? null : true }, { match: Text.isText, split: true });
    },
    //block區塊樣式
    toggleBlock(editor, format) {
        const isActive = CustomEditor.isBlockActive(editor, format);
        const isList = CustomEditor.List_TYPES.includes(format);
        Transforms.unwrapNodes(editor, {
            match: (n) => !Editor.isEditor(n) && Element.isElement(n) && CustomEditor.List_TYPES.includes(n.type),
            split: true,
        });
        const newProperties: Partial<Element> = {
            type: isActive ? 'paragraph' : isList ? 'list-item' : format,
        };
        Transforms.setNodes<Element>(editor, newProperties);

        if (!isActive && isList) {
            const block = { type: format, children: [] };
            Transforms.wrapNodes(editor, block);
        }
    },
};

export default CustomEditor;
