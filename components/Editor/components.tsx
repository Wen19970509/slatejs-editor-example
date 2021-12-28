import React, { Ref, PropsWithChildren } from 'react';
import { useSlate, useSlateStatic } from 'slate-react';
import CustomEditor from './utils/customSettings';
interface BaseProps {
    className: string;
    [key: string]: unknown;
}
type OrNull<T> = T | null;

const ButtonSTY = (active, reversed) => {
    return { color: reversed ? (active ? 'white' : '#aaaaaa') : active ? '#17a884' : 'white' };
};
export const Button = React.forwardRef(
    (
        {
            disabled,
            active,
            reversed,
            ...props
        }: PropsWithChildren<
            {
                active: boolean;
                reversed: boolean;
            } & BaseProps
        >,
        ref: Ref<OrNull<HTMLSpanElement>>,
    ) => <span {...props} ref={ref} className='cursor-pointer' style={ButtonSTY(active, reversed)} />,
);
export const DeleButton = React.forwardRef(({ ...props }: PropsWithChildren<{} & BaseProps>, ref: Ref<OrNull<HTMLSpanElement>>) => (
    <span {...props} ref={ref} className='cursor-pointer absolute bg-white top-2 left-2' />
));

export const Icon = React.forwardRef(({ ...props }: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLSpanElement>>) => (
    <span {...props} ref={ref} className='material-icons  text-2xl align-text-bottom mx-1' />
));
export const BlockIcon = React.forwardRef(({ ...props }: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLSpanElement>>) => (
    <span {...props} ref={ref} className='material-icons  text-3xl align-text-bottom mx-1 my-1' />
));

export const FormatButton = ({ format, icon }) => {
    const editor = useSlate();
    return (
        <Button
            reversed
            active={CustomEditor.isFormatActive(editor, format)}
            onMouseDown={(event) => {
                event.preventDefault();
                CustomEditor.toggleFormat(editor, format);
            }}
        >
            <Icon>{icon}</Icon>
        </Button>
    );
};
export const BlockButton = ({ format, icon }) => {
    const editor = useSlate();
    return (
        <Button
            active={CustomEditor.isBlockActive(editor, format)}
            onMouseDown={(event) => {
                event.preventDefault();
                CustomEditor.toggleBlock(editor, format);
            }}
        >
            <BlockIcon>{icon}</BlockIcon>
        </Button>
    );
};

export const InsertImageButton = () => {
    const editor = useSlateStatic();
    return (
        <Button
            onMouseDown={(event) => {
                event.preventDefault();
                const url = window.prompt('加入相片連結:');
                if (url && !CustomEditor.isImageUrl(url)) {
                    alert('必須填入正確連結');
                    return;
                }
                if (!url) return;
                CustomEditor.insertImage(editor, url);
            }}
        >
            <BlockIcon>image</BlockIcon>
        </Button>
    );
};
export const AddLinkButton = () => {
    const editor = useSlate();
    return (
        <Button
            reversed
            active={CustomEditor.isLinkActive(editor)}
            onMouseDown={(event) => {
                event.preventDefault();
                const url = window.prompt('輸入超連結網址:');
                if (!url) {
                    alert('請輸入正確超連結!');
                    return;
                }
                CustomEditor.insertLink(editor, url);
            }}
        >
            <Icon>link</Icon>
        </Button>
    );
};

export const RemoveLinkButton = () => {
    const editor = useSlate();
    return (
        <Button
            reversed
            active={CustomEditor.isLinkActive(editor)}
            onMouseDown={(event) => {
                if (CustomEditor.isLinkActive(editor)) {
                    CustomEditor.unwrapLink(editor);
                }
            }}
        >
            <Icon>link_off</Icon>
        </Button>
    );
};

export const InsertEditableCardButton = () => {
    const editor = useSlateStatic();
    return (
        <Button
            onMouseDown={(event) => {
                event.preventDefault();
                CustomEditor.insertEditableCard(editor);
            }}
        >
            <BlockIcon>add</BlockIcon>
        </Button>
    );
};
