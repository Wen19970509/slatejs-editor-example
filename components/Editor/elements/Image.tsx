import { ReactEditor, useFocused, useSelected, useSlateStatic } from 'slate-react';
import { DeleButton, Icon } from '../components';
import { BaseEditor, Transforms } from 'slate';
import React from 'react';
import { HistoryEditor } from 'slate-history';
import CustomEditor from '../utils/customSettings';
export const withImages = (editor: BaseEditor & ReactEditor & HistoryEditor) => {
    const { insertData, isVoid } = editor;

    editor.isVoid = (element) => {
        return element.type === 'image' ? true : isVoid(element);
    };

    editor.insertData = (data) => {
        const text = data.getData('text/plain');
        const { files } = data;

        if (files && files.length > 0) {
            for (const file of files) {
                const reader = new FileReader();
                const [mime] = file.type.split('/');

                if (mime === 'image') {
                    reader.addEventListener('load', () => {
                        const url = reader.result;
                        CustomEditor.insertImage(editor, url);
                    });

                    reader.readAsDataURL(file);
                }
            }
        } else if (CustomEditor.isImageUrl(text)) {
            CustomEditor.insertImage(editor, text);
        } else {
            insertData(data);
        }
    };
    return editor;
};

export const Image = ({ attributes, children, element }) => {
    const editor = useSlateStatic();
    const path = ReactEditor.findPath(editor, element);

    const selected = useSelected();
    const focused = useFocused();
    const imgSTY = {
        boxShadow: selected && focused ? '0 0 0 3px #B4D5FF' : 'none',
    } as React.CSSProperties;
    const btnSTY = {
        display: selected && focused ? 'inline' : 'none',
    } as React.CSSProperties;

    return (
        <div {...attributes}>
            {children}
            <div contentEditable={false} className='relative'>
                <img src={element.url} className='block max-w-full max-h-20em' style={imgSTY} />

                <DeleButton active onClick={() => Transforms.removeNodes(editor, { at: path })} style={btnSTY}>
                    <Icon>delete</Icon>
                </DeleButton>
            </div>
        </div>
    );
};
