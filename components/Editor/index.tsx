import { createEditor, Descendant, Editor, Transforms, Element, Text } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import React from 'react';
import CodeElement from './elements/CodeElement';
import DefaultElement from './elements/DefaultElement';
import InlineStyles from './elements/InlineStyles';
import CustomEditor from './customSettings';

const SlateEditor = () => {
    // @refresh reset
    //初始參數
    const initialValue: Descendant[] = [
        {
            type: 'paragraph',
            children: [{ text: '' }],
        },
    ];
    const [value, setValue] = React.useState<Descendant[]>(initialValue);

    // 初始editor 設定，使用官方提供的useMemo 撰寫，在熱開發狀態會報錯
    const editorRef = React.useRef<any>();
    if (!editorRef.current) editorRef.current = withHistory(withReact(createEditor()));
    const editor = editorRef.current;

    //Element 切換 ，使用useCallback減少FC多餘呼叫
    const renderElement = React.useCallback((props) => {
        switch (props.element.type) {
            case 'code':
                return <CodeElement {...props} />;
            default:
                return <DefaultElement {...props} />;
        }
    }, []);
    //inline style控制
    const renderLeaf = React.useCallback((props) => {
        return <InlineStyles {...props} />;
    }, []);
    return (
        <React.Fragment>
            <Slate editor={editor} value={value} onChange={(newValue) => setValue(newValue)}>
                <div>
                    <button
                        onMouseDown={(event) => {
                            event.preventDefault();
                            CustomEditor.toggleBoldMark(editor);
                        }}
                    >
                        Bold
                    </button>
                    <br />
                    <button
                        onMouseDown={(event) => {
                            event.preventDefault();
                            CustomEditor.toggleCodeBlock(editor);
                        }}
                    >
                        Code Block
                    </button>
                </div>
                <Editable
                    placeholder={'請輸入文字'}
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    onKeyDown={(e) => {
                        console.log(e.key);
                        if (!e.ctrlKey) {
                            return;
                        }
                        switch (e.key) {
                            case '`': {
                                e.preventDefault();
                                CustomEditor.toggleCodeBlock(editor);
                                break;
                            }
                            case 'b': {
                                e.preventDefault();
                                CustomEditor.toggleBoldMark(editor);
                                break;
                            }
                        }
                    }}
                />
            </Slate>
        </React.Fragment>
    );
};

export default SlateEditor;
