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
    //加入相片時即跳出alt輸入框，且強制輸入
    const [show, setShow] = React.useState(false);
    React.useEffect(() => {
        if (!element.alt) {
            // use prompt
            // let altInput;
            // while (!altInput) {
            //     altInput = window.prompt('請輸入alt,此為必填選項');
            // }
            // CustomEditor.setAlt(editor, element.url, altInput, path);
            setShow(true);
        }
    }, []);
    const handleEditAlt = () => {
        //use prompt
        // if (typeof window !== 'undefined') {
        //     let altInput;
        //     while (!altInput) {
        //         altInput = window.prompt('修改Alt內容，不可為空', element.alt);
        //     }
        //     CustomEditor.setAlt(editor, element.url, altInput, path);
        // }
        setShow(true);
    };
    //alt 輸入框
    const InputBox = () => {
        let altInput = React.useRef(element.alt);
        const style = {
            display: show ? 'block' : 'none',
        } as React.CSSProperties;
        const handleChange = (e) => {
            altInput.current = e.target.value;
        };
        const handleSubmit = (e) => {
            e.preventDefault();
            if (typeof window !== 'undefined' && !altInput.current) {
                alert('ALT為必填!!!');
            } else {
                CustomEditor.setAlt(editor, element.url, altInput.current, path);
                setShow(false);
            }
        };
        const handleKeyDown = (e) => {
            if (e.which === 13) {
                handleSubmit(e);
            }
        };
        return (
            <div className='fixed z-50 left-0 top-0 bottom-0 right-0 bg-black bg-opacity-40 ' style={style}>
                <div className='absolute left-1/2 top-1/3 -translate-x-1/2 transform'>
                    <div className='grid grid-flow-col  '>
                        <input
                            key='input'
                            autoFocus
                            placeholder={'請輸入alt'}
                            className='text-xl text-black rounded-l-md py-1 pl-2  border-none  border-collapse border-r-none outline-none'
                            onChange={handleChange}
                            defaultValue={altInput.current}
                            onKeyDown={handleKeyDown}
                        />
                        <div className='bg-green-500 text-white flex p-3 hover:bg-green-600 transform duration-300 cursor-pointer' onClick={handleSubmit}>
                            <span className='material-icons  justify-center self-center'>done</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div {...attributes}>
            {children}
            <div contentEditable={false} className='relative'>
                <img src={element.url} className='block max-w-full max-h-20em' style={imgSTY} alt={element.alt} />
                <DeleButton active onClick={() => Transforms.removeNodes(editor, { at: path })} style={btnSTY}>
                    <Icon>delete</Icon>
                </DeleButton>
                <AltButton active onClick={handleEditAlt} style={btnSTY}>
                    <Icon>mode_edit</Icon>
                </AltButton>
                <InputBox />
            </div>
        </div>
    );
};
