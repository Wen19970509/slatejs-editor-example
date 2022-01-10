import isHotkey from 'is-hotkey';
import CustomEditor from '@components/Editor/utils/customSettings';
import { Editor, Transforms, Node } from 'slate';
import { ParagraphElement } from '@components/Editor/types';

export const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
};

export const keycommand = (e, editor) => {
    //shift + enter =>  soft break
    if (e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        editor.insertText('\n');
        return;
    }
    if (!e.shiftKey && e.key === 'Enter') {
        const currentNode = Editor.node(editor, editor.selection);
        const isNumberList = CustomEditor.isBlockActive(editor, 'numbered-list');
        const isBulletedList = CustomEditor.isBlockActive(editor, 'bulleted-list');
        const [text] = currentNode;

        if (!Node.string(text)) {
            //如果list_item內容為空、重置為paragraph
            if (isNumberList) {
                e.preventDefault();
                CustomEditor.toggleBlock(editor, 'numbered-list');
            }
            if (isBulletedList) {
                e.preventDefault();
                CustomEditor.toggleBlock(editor, 'bulleted-list');
            }
        }
        //若為Head_Types,其斷行時不繼承原先屬性,回復為paragraph
        for (let i of CustomEditor.Head_TYPES) {
            if (CustomEditor.isBlockActive(editor, i)) {
                e.preventDefault();
                const paragraph: ParagraphElement = {
                    type: 'paragraph',
                    children: [{ text: '' }],
                };
                Transforms.insertNodes(editor, paragraph);
            }
        }
    }

    // ctrl/cmd + backspace => delete hole block
    if (e.metaKey || e.ctrlKey) {
        if (e.key === 'Backspace') {
            e.preventDefault();
            editor.deleteBackward('block');
            return;
        }
    }
    if (e.key === 'Backspace') {
        const currentNode = Editor.node(editor, editor.selection);
        const [text] = currentNode;
        //獲得現在的format
        const findFormat = (formats: string[]) => {
            for (let i = 0; i < formats.length; i++) {
                if (CustomEditor.isBlockActive(editor, formats[i])) {
                    return formats[i];
                }
            }
            return null;
        };
        const formats = ['block-quote', 'title', 'numbered-list', 'bulleted-list', 'heading-two', 'heading-three'];
        const currentFormat = findFormat(formats);
        if (!!currentFormat && !Node.string(text)) {
            //若block內無文字，有format狀態，先回復為paragraph
            e.preventDefault();
            CustomEditor.toggleBlock(editor, currentFormat);
        }
    }
    for (const hotkey in HOTKEYS) {
        if (isHotkey(hotkey, e as any)) {
            e.preventDefault();
            const mark = HOTKEYS[hotkey];
            CustomEditor.toggleFormat(editor, mark);
        }
    }
};
