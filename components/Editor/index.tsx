import { createEditor, Descendant, Text } from 'slate';
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
import { withEmbeds } from './elements/Embed';
import { withHtml } from './elements/InsertHTML';
import SearchHighlighting from './elements/SearchHighlighting';
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
    if (!editorRef.current)
        editorRef.current = withLayout(withHtml(withEmbeds(withEditableCards(withLinks(withImages(withHistory(withReact(createEditor()))))))));
    const editor = editorRef.current;

    //CustomElement 切換 ，使用useCallback減少FC多餘呼叫
    const renderElement = React.useCallback((props) => <CustomElement {...props} />, []);
    //Format text style控制
    const renderLeaf = React.useCallback((props) => <Leaf {...props} />, []);

    // search bar的相關設定
    const [search, setSearch] = React.useState<string | undefined>();
    const decorate = React.useCallback(
        ([node, path]) => {
            const ranges = [];
            if (search && Text.isText(node)) {
                const { text } = node;
                const parts = text.split(search);
                // console.log('parts', parts); // ['雄獅資訊']
                let offset = 0;

                parts.forEach((part, i) => {
                    // console.log('part', part); // 未被選到的字
                    // console.log('i', i); // 有幾個詞或字與搜尋bar的一樣
                    if (i !== 0) {
                        ranges.push({
                            anchor: { path, offset: offset - search.length },
                            focus: { path, offset },
                            highlight: true,
                        });
                    }
                    offset = offset + part.length + search.length;
                });
            }

            return ranges;
        },
        [search],
    );

    return (
        <Slate
            editor={editor}
            value={value}
            onChange={(newValue) => {
                setValue(newValue);
                console.log('newValue', newValue);
                console.log('editor.operations', editor.operations);

                // 將變更的資料用Json形式預存至LocalStorage內
                // 除了type是'set_selection'以外的，都會被存到localStorage裡面
                const isAstChange = editor.operations.some((op) => 'set_selection' !== op.type);
                console.log('isAstChange', isAstChange);

                if (isAstChange) {
                    const content = JSON.stringify(newValue);
                    typeof window !== 'undefined' && localStorage.setItem('content', content);
                }
            }}
        >
            <SideToolbar />
            <HoverToolbar />
            <SearchHighlighting setSearch={setSearch} />
            <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                autoFocus
                spellCheck={false}
                decorate={decorate}
                onKeyDown={(e) => {
                    keycommand(e, editor);
                }}
            />
        </Slate>
    );
};

export default SlateEditor;
