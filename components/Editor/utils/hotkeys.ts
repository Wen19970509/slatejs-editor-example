import isHotkey from 'is-hotkey';
import CustomEditor from '@components/Editor/utils/customSettings';
import { Editor, Element, Path, Transforms, Node } from 'slate';

export const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
};

export const keycommand = (e, editor) => {
    // ctrl/cmd + backspace => delete hole block
    if (e.metaKey || e.ctrlKey) {
        if (e.key === 'Backspace') {
            e.preventDefault();
            editor.deleteBackward('block');
        }
    }
    //shift + enter =>  soft break
    if (e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        editor.insertText('\n');
    }
    for (const hotkey in HOTKEYS) {
        if (isHotkey(hotkey, e as any)) {
            e.preventDefault();
            const mark = HOTKEYS[hotkey];
            CustomEditor.toggleFormat(editor, mark);
        }
    }
};
