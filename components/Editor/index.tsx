import { createEditor, Descendant, Transforms, Node, Element, BaseEditor } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { HistoryEditor, withHistory } from 'slate-history';
import React from 'react';
import CustomElement from './elements/CustomElement';
import Leaf from './elements/Leaf';
import CustomEditor from './utils/customSettings';
import { HOTKEYS } from './utils/hotkeys';
import isHotkey from 'is-hotkey';
import HoverToolbar from './HoverToolbar';
import SideToolbar from '@components/Editor/SideToolbar';
import { withImages } from './elements/Image';
import { withLinks } from './elements/Link';
import { withEditableCards } from './elements/EditableCard';
import { ParagraphElement, TitleElement } from './types';

const SlateEditor = () => {
    // @refresh reset
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
    //頁面Layout，強制path(0)必須為Title
    const withLayout = (editor: BaseEditor & ReactEditor & HistoryEditor) => {
        const { normalizeNode } = editor;

        editor.normalizeNode = ([node, path]) => {
            if (path.length === 0) {
                if (editor.children.length < 1) {
                    const title: TitleElement = {
                        type: 'title',
                        children: [{ text: '' }],
                    };
                    Transforms.insertNodes(editor, title, { at: path.concat(0) });
                }

                if (editor.children.length < 2) {
                    const paragraph: ParagraphElement = {
                        type: 'paragraph',
                        children: [{ text: '' }],
                    };
                    Transforms.insertNodes(editor, paragraph, { at: path.concat(1) });
                }

                for (const [child, childPath] of Node.children(editor, path)) {
                    let type: string;
                    const slateIndex = childPath[0];
                    const enforceType = (type) => {
                        if (Element.isElement(child) && child.type !== type) {
                            const newProperties: Partial<Element> = { type };
                            Transforms.setNodes<Element>(editor, newProperties, {
                                at: childPath,
                            });
                        }
                    };

                    switch (slateIndex) {
                        case 0:
                            type = 'title';
                            enforceType(type);
                            break;
                        case 1:
                            type = 'paragraph';
                        default:
                            break;
                    }
                }
            }

            return normalizeNode([node, path]);
        };

        return editor;
    };
    //value 讀取LocalStorage 是否有內容，若無則調用初始設定
    const [value, setValue] = React.useState<Descendant[]>(initialValue);
    //(JSON.parse(typeof window !== 'undefined' && localStorage.getItem('content')) || initialValue)
    //讀取LocalStorage
    // 初始editor 設定，使用官方提供的useMemo 撰寫，在熱開發狀態會報錯
    const editorRef = React.useRef<any>();
    if (!editorRef.current) editorRef.current = withLayout(withEditableCards(withLinks(withImages(withHistory(withReact(createEditor()))))));
    const editor = editorRef.current;

    //CustomElement 切換 ，使用useCallback減少FC多餘呼叫
    const renderElement = React.useCallback((props) => <CustomElement {...props} />, []);
    //Format控制
    const renderLeaf = React.useCallback((props) => <Leaf {...props} />, []);

    //Image
    return (
        <Slate
            editor={editor}
            value={value}
            onChange={(newValue) => {
                setValue(newValue);
                //將變更的資料用Json形式預存至LocalStorage內
                // const isAstChange = editor.operations.some((op) => 'set_selection' !== op.type);
                // if (isAstChange) {
                //     const content = JSON.stringify(newValue);
                //     typeof window !== 'undefined' && localStorage.setItem('content', content);
                // }
            }}
        >
            <SideToolbar />
            <HoverToolbar />
            <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                autoFocus
                spellCheck={false}
                onKeyDown={(event) => {
                    for (const hotkey in HOTKEYS) {
                        if (isHotkey(hotkey, event as any)) {
                            event.preventDefault();
                            const mark = HOTKEYS[hotkey];
                            CustomEditor.toggleFormat(editor, mark);
                        }
                    }
                }}
            />
        </Slate>
    );
};

export default SlateEditor;
