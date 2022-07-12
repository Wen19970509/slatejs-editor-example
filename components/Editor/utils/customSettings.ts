//inlines ,blocks 設定
import { Editor, Text, Element, Transforms, Range, BaseEditor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import { CustomElement, EditableCardElement, EmbedElement, ImageElement, LinkElement, ParagraphElement } from '../types';
import isUrl from 'is-url';
import imageExtensions from 'image-extensions';

const CustomEditor = {
    isBlockActive(editor: BaseEditor & ReactEditor & HistoryEditor, format: any, blockType = 'type') {
        const { selection } = editor;
        if (!selection) return false;
        const [match] = Array.from(
            Editor.nodes(editor, {
                match: (n) => Element.isElement(n) && n.type === format && n[blockType] === format,
            }),
        );
        return !!match;
    },
    isFormatActive(editor: BaseEditor & ReactEditor & HistoryEditor, format: any) {
        const [match] = Editor.nodes(editor, {
            match: (n) => n[format] === true,
            mode: 'all',
        });
        return !!match;
    },
    isFormatDisabled(editor: BaseEditor & ReactEditor & HistoryEditor, format: undefined) {
        const [disabled] = Array.from(
            Editor.nodes(editor, {
                match: (n) => {
                    if (Element.isElement(n)) {
                        const isHead = CustomEditor.Head_TYPES.includes(n.type);
                        const isList = CustomEditor.List_TYPES.includes(n.type);
                        if (isHead) {
                            return true;
                        }
                        if (isList) {
                            switch (format) {
                                case 'code':
                                    return true;
                                case 'strikethrough':
                                    return true;
                                default:
                                    return false;
                            }
                        }
                        return false;
                    }
                },
            }),
        );
        return disabled;
    },
    Head_TYPES: ['title', 'heading-two', 'heading-three', 'block-quote'],
    List_TYPES: ['numbered-list', 'bulleted-list'],
    Text_Align_Types: ['left', 'center', 'right', 'justify'],

    //文字樣式
    toggleFormat(editor: BaseEditor & ReactEditor & HistoryEditor, format: any) {
        const isActive = CustomEditor.isFormatActive(editor, format);
        Transforms.setNodes(editor, { [format]: isActive ? null : true }, { match: Text.isText, split: true });
    },
    //block區塊樣式
    toggleBlock(editor: BaseEditor & ReactEditor & HistoryEditor, format: any) {
        const isActive = CustomEditor.isBlockActive(editor, format, CustomEditor.Text_Align_Types.includes(format) ? 'align' : 'type');
        const isList = CustomEditor.List_TYPES.includes(format);
        Transforms.unwrapNodes(editor, {
            match: (n) =>
                !Editor.isEditor(n) && Element.isElement(n) && CustomEditor.List_TYPES.includes(n.type) && !CustomEditor.Text_Align_Types.includes(format),
            split: true,
        });
        let newProperties: Partial<Element>;
        if (CustomEditor.Text_Align_Types.includes(format)) {
            newProperties = {
                align: isActive ? undefined : format,
            };
        } else {
            newProperties = { type: isActive ? 'paragraph' : isList ? 'list-item' : format };
        }
        Transforms.setNodes<Element>(editor, newProperties);

        if (!isActive && isList) {
            const block = { type: format, children: [] };
            Transforms.wrapNodes(editor, block);
        }
    },
    //Link
    isLinkActive(editor: BaseEditor & ReactEditor & HistoryEditor) {
        const [link] = Editor.nodes(editor, {
            match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
        });
        return !!link;
    },
    unwrapLink(editor: BaseEditor & ReactEditor & HistoryEditor) {
        Transforms.unwrapNodes(editor, {
            match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
        });
    },
    wrapLink(editor: BaseEditor & ReactEditor & HistoryEditor, url: string) {
        if (CustomEditor.isLinkActive(editor)) {
            CustomEditor.unwrapLink(editor);
        }

        const { selection } = editor;
        const isCollapsed = selection && Range.isCollapsed(selection);
        console.log('selection', selection);

        console.log('isCollapsed', isCollapsed);

        const link: LinkElement = {
            type: 'link',
            url,
            children: isCollapsed ? [{ text: url }] : [],
        };

        if (isCollapsed) {
            console.log('有');

            Transforms.insertNodes(editor, link);
        } else {
            console.log('沒有');
            Transforms.wrapNodes(editor, link, { split: true });
            Transforms.collapse(editor, { edge: 'end' });
        }
    },
    insertLink(editor: BaseEditor & ReactEditor & HistoryEditor, url: string) {
        if (editor.selection) {
            CustomEditor.wrapLink(editor, url);
        }
    },

    //image
    insertImage(editor: BaseEditor & ReactEditor & HistoryEditor, url: any, alt: any) {
        const text = { text: '' };
        const image: ImageElement = { type: 'image', url, alt, children: [text] };

        const paragraph: ParagraphElement = {
            type: 'paragraph',
            children: [{ text: '' }],
        };
        Transforms.insertNodes(editor, image);
        //預留一個p element
        Transforms.insertNodes(editor, paragraph);
    },
    setAlt(editor, url: any, alt: any, path) {
        const text = { text: '' };
        const image: ImageElement = { type: 'image', url, alt, children: [text] };
        Transforms.setNodes(editor, image, { at: path });
    },
    isImageUrl(url: string) {
        if (!url) return false;
        if (!isUrl(url)) return false;
        const ext = new URL(url).pathname.split('.').pop();
        return imageExtensions.includes(ext);
    },

    // 嵌入連結邏輯
    embed(editor: BaseEditor & ReactEditor & HistoryEditor) {
        const text = { text: '' };
        const embedNode: EmbedElement = {
            type: 'embed',
            url: '',
            children: [text],
        };
        const paragraph: ParagraphElement = {
            type: 'paragraph',
            children: [{ text: '' }],
        };
        // Transforms.insertNodes(editor, videoNode);
        Transforms.wrapNodes(editor, embedNode, { split: true });
        Transforms.insertNodes(editor, paragraph);
    },

    // 插入區塊邏輯
    insertEditableCard(editor: BaseEditor & ReactEditor & HistoryEditor) {
        const voidNode: EditableCardElement = {
            type: 'editable-card',
            children: [{ text: '' }],
        };
        const paragraph: ParagraphElement = {
            type: 'paragraph',
            children: [{ text: '' }],
        };
        Transforms.insertNodes(editor, voidNode);
        //預留一個p element
        Transforms.insertNodes(editor, paragraph);
    },
};

export default CustomEditor;
