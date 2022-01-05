import { Transforms, Element, Node, BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';
import { ParagraphElement, TitleElement } from '@components/Editor/types';
//各段落樣式設定
const Normalized = {
    //預設Layout ,強制內文必須包含H1 title
    withLayout(editor: BaseEditor & ReactEditor & HistoryEditor) {
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
                    //限制若為'title',重設為p type
                    const resetType = (type) => {
                        if (Element.isElement(child) && child.type === 'title') {
                            const newProperties: Partial<Element> = { type };
                            Transforms.setNodes<Element>(editor, newProperties, {
                                at: childPath,
                            });
                        }
                    };

                    // noinspection FallThroughInSwitchStatementJS
                    switch (slateIndex) {
                        case 0:
                            type = 'title';
                            enforceType(type);
                            break;
                        default:
                            type = 'paragraph';
                            resetType(type);
                            break;
                    }
                }
            }
            return normalizeNode([node, path]);
        };
        return editor;
    },
};

export default Normalized;
