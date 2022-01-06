import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import React from 'react';
import CustomElement from './elements/CustomElement';
import Leaf from './elements/Leaf';
import { keycommand } from './utils/hotkeys';
import HoverToolbar from './HoverToolbar';
import SideToolbar from '@components/Editor/SideToolbar';
import { withImages } from './elements/Image';
import { withLinks } from './elements/Link';
import { withEditableCards } from './elements/EditableCard';
import Normalize from '@components/Editor/utils/normalize';
const SlateEditor = () => {
    //段落設定
    const { withLayout } = Normalize;
    //初始參數
    const initialValue: Descendant[] = [
        {
            type: 'title',
            children: [{ text: '在此輸入標題' }],
        },
        {
            type: 'paragraph',
            children: [{ text: '開始寫作吧!' }],
        },
    ];
    //value 讀取LocalStorage 是否有內容，若無則調用初始設定
    const [value, setValue] = React.useState<Descendant[]>(JSON.parse(typeof window !== 'undefined' && localStorage.getItem('content')) || initialValue);
    //(JSON.parse(typeof window !== 'undefined' && localStorage.getItem('content')) || initialValue)
    //讀取LocalStorage
    // 初始editor 設定，使用官方提供的useMemo 撰寫，在熱開發狀態會報錯
    const editorRef = React.useRef<any>();
    if (!editorRef.current) editorRef.current = withLayout(withEditableCards(withLinks(withImages(withHistory(withReact(createEditor()))))));
    const editor = editorRef.current;

    //CustomElement 切換 ，使用useCallback減少FC多餘呼叫
    const renderElement = React.useCallback((props) => <CustomElement {...props} />, []);
    //Format text style控制
    const renderLeaf = React.useCallback((props) => <Leaf {...props} />, []);

    //Image
    return (
        <Slate
            editor={editor}
            value={value}
            onChange={(newValue) => {
                setValue(newValue);
                // 將變更的資料用Json形式預存至LocalStorage內
                const isAstChange = editor.operations.some((op) => 'set_selection' !== op.type);
                if (isAstChange) {
                    const content = JSON.stringify(newValue);
                    typeof window !== 'undefined' && localStorage.setItem('content', content);
                }
            }}
        >
            <SideToolbar />
            <HoverToolbar />
            <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                autoFocus
                spellCheck={false}
                onKeyDown={(e) => {
                    keycommand(e, editor);
                }}
            />
        </Slate>
    );
};

export default SlateEditor;
