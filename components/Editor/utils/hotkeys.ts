import isHotkey from 'is-hotkey';
import CustomEditor from '@components/Editor/utils/customSettings';
import { Element, Path, Transforms } from 'slate';
import locatePath from 'locate-path';

export const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
};

export const keycommand = (e, editor) => {
    for (const hotkey in HOTKEYS) {
        if (isHotkey(hotkey, e as any)) {
            e.preventDefault();
            const mark = HOTKEYS[hotkey];
            CustomEditor.toggleFormat(editor, mark);
        }
    }
};
