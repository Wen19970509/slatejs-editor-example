// @refresh reset
import { BaseEditor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

export type ParagraphElement = {
    type: 'paragraph';
    children: CustomText[];
};

export type CodeElement = {
    type: 'code';
    children: CustomText[];
};

export type CustomElement = CodeElement | ParagraphElement;
export type CustomText = { text: string; bold?: boolean };

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor;
        Element: CustomElement;
        Text: CustomText;
    }
}
