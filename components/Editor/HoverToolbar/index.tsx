import React from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { Range, Editor } from 'slate';
import { FormatButton } from '../components';

const HoverToolbar = () => {
    const ref = React.useRef<HTMLDivElement | null>();
    const editor = useSlate();

    React.useEffect(() => {
        const el = ref.current;
        const { selection } = editor;

        if (!el) {
            return;
        }

        if (!selection || !ReactEditor.isFocused(editor) || Range.isCollapsed(selection) || Editor.string(editor, selection) === '') {
            el.removeAttribute('style');
            return;
        }

        const domSelection = window.getSelection();
        const domRange = domSelection.getRangeAt(0);
        const rect = domRange.getBoundingClientRect();
        // el.classList.toggle('hidden');
        el.style.opacity = '1';
        el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
        el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`;
    });

    return (
        <div ref={ref} className=' py-1 px-1 absolute z-10  bg-black rounded transition-opacity opacity-0 -top-10000 -left-10000'>
            <FormatButton format='bold' icon='format_bold' />
            <FormatButton format='italic' icon='format_italic' />
            <FormatButton format='underline' icon='format_underlined' />
            <FormatButton format='strikethrough' icon='format_strikethrough' />
            <FormatButton format='code' icon='code' />
        </div>
    );
};

export default HoverToolbar;
