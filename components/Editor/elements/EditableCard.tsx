import React, { useState } from 'react';
import { BaseEditor, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor, useFocused, useSelected, useSlateStatic } from 'slate-react';
import { DeleButton, Icon } from '../components';
import CustomEditor from '../utils/customSettings';

export const withEditableCards = (editor: BaseEditor & ReactEditor & HistoryEditor) => {
    const { isVoid } = editor;

    editor.isVoid = (element) => {
        return element.type === 'editable-card' ? true : isVoid(element);
    };

    return editor;
};
export const EditableCard = ({ attributes, children, element }) => {
    const [inputValue, setInputValue] = useState('');
    const editor = useSlateStatic();
    const path = ReactEditor.findPath(editor, element);
    const selected = useSelected();
    const focused = useFocused();
    const btnSTY = {
        display: selected && focused ? 'inline' : 'none',
    } as React.CSSProperties;
    const divSTY = {
        boxShadow: selected && focused ? '0 0 0 3px #B4D5FF' : 'none',
    } as React.CSSProperties;

    return (
        // Need contentEditable=false or Firefox has issues with certain input types.
        <div {...attributes} contentEditable={false}>
            <div className='p-2 shadow-sm border border-black relative' style={divSTY}>
                <h4 className='text-center'>元件測試-名稱:</h4>
                <textarea
                    className='my-3 text-input'
                    // type='text'
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                    }}
                />
                {/* <h4>左撇子還右撇子:</h4>
                <input className='w-unset' type='radio' name='handedness' value='left' /> Left
                <br />
                <input className='w-unset' type='radio' name='handedness' value='right' /> Right */}
                <DeleButton active onClick={() => Transforms.removeNodes(editor, { at: path })} style={btnSTY}>
                    <Icon>delete</Icon>
                </DeleButton>
            </div>
            {children}
        </div>
    );
};
