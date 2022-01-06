import { ReactEditor, useFocused, useSelected, useSlateStatic } from 'slate-react';
import { DeleButton, Icon, AltButton } from '../components';
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
        const alt = null;
        if (files && files.length > 0) {
            for (const file of files) {
                const reader = new FileReader();
                const [mime] = file.type.split('/');

                if (mime === 'image') {
                    reader.addEventListener('load', () => {
                        const url = reader.result;

                        CustomEditor.insertImage(editor, url, alt);
                    });

                    reader.readAsDataURL(file);
                }
            }
        } else if (CustomEditor.isImageUrl(text)) {
            CustomEditor.insertImage(editor, text, alt);
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

    //alt 控制
    const [alt, setAlt] = React.useState(null);
    React.useEffect(() => {
        if (!element.alt) {
            let altInput;
            while (!altInput) {
                altInput = window.prompt('請輸入alt,此為必填選項');
            }
            CustomEditor.setAlt(editor, element.url, altInput, path);
        }
    }, []);
    const editAlt = () => {
        if (typeof window !== 'undefined') {
            let altInput;
            while (!altInput) {
                altInput = window.prompt('修改Alt內容，不可為空', element.alt);
            }
            CustomEditor.setAlt(editor, element.url, altInput, path);
        }
    };

    return (
        <div {...attributes}>
            {children}
            <div contentEditable={false} className='relative'>
                <img src={element.url} className='block max-w-full max-h-20em' style={imgSTY} alt={element.alt} />
                <DeleButton active onClick={() => Transforms.removeNodes(editor, { at: path })} style={btnSTY}>
                    <Icon>delete</Icon>
                </DeleButton>
                <AltButton active onClick={editAlt} style={btnSTY}>
                    <Icon>mode_edit</Icon>
                </AltButton>
            </div>
        </div>
    );
};
