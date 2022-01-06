import React, { Ref, PropsWithChildren } from 'react';
import { useSlate, useSlateStatic } from 'slate-react';
import CustomEditor from './utils/customSettings';
interface BaseProps {
    className: string;
    [key: string]: unknown;
}
type OrNull<T> = T | null;

const ButtonSTY = (active: boolean, reversed: boolean, disabled: boolean) => {
    return { color: reversed ? (disabled ? 'rgba(241, 241, 241,25%)' : active ? '#6cb387' : '#c4c4c4') : active ? '#6cb387' : 'white' };
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
                disabled: boolean;
                active: boolean;
                reversed: boolean;
            } & BaseProps
        >,
        ref: Ref<OrNull<HTMLSpanElement>>,
    ) => <span {...props} ref={ref} className='cursor-pointer' style={ButtonSTY(active, reversed, disabled)} />,
);
export const DeleButton = React.forwardRef(({ ...props }: PropsWithChildren<{} & BaseProps>, ref: Ref<OrNull<HTMLSpanElement>>) => (
    <span {...props} ref={ref} className='cursor-pointer text-red-600  absolute  top-2 left-2' />
));
export const AltButton = React.forwardRef(({ ...props }: PropsWithChildren<{} & BaseProps>, ref: Ref<OrNull<HTMLSpanElement>>) => (
    <span {...props} ref={ref} className='cursor-pointer text-blue-600  absolute  top-2 left-10' />
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
            disabled={CustomEditor.isFormatDisabled(editor, format)}
            onMouseDown={(event) => {
                event.preventDefault();
                //disabled
                if (CustomEditor.isFormatDisabled(editor, format)) return;
                CustomEditor.toggleFormat(editor, format);
            }}
        >
            <Icon>{icon}</Icon>
        </Button>
    );
};
export const BlockButton = ({ format, icon, title }) => {
    const editor = useSlate();
    return (
        <Button
            data-title={title}
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
            data-title={'使用相片連結'}
            onMouseDown={(event) => {
                event.preventDefault();
                const url = window.prompt('加入相片連結:');
                const alt = null;
                if (url && !CustomEditor.isImageUrl(url)) {
                    alert('必須填入正確連結');
                    return;
                }
                if (!url) return;
                CustomEditor.insertImage(editor, url, alt);
            }}
        >
            <BlockIcon>image</BlockIcon>
        </Button>
    );
};
//上傳照片
export const UploadImageButton = () => {
    const editor = useSlateStatic();
    const uploaderRef = React.useRef(null);
    const ImageUploader = () => {
        const handleInputClick = (e) => {
            e.stopPropagation();
        };
        const handleInputChange = (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                const file = files[0];
                const reader = new FileReader();

                reader.readAsDataURL(file);
                reader.onload = (e) => {
                    const url = e.target.result as string;
                    const alt = null;
                    if (!url) return;
                    CustomEditor.insertImage(editor, url, alt);
                };
            }
        };
        return (
            <input
                ref={uploaderRef}
                className='fixed z-30 left-10 top-5 hidden'
                type='file'
                accept='image/*'
                onClick={handleInputClick}
                onChange={handleInputChange}
                multiple={false}
            />
        );
    };
    return (
        <Button
            data-title={'上傳相片'}
            onMouseDown={(event) => {
                event.preventDefault();
                if (uploaderRef.current) uploaderRef.current.click();
            }}
        >
            <ImageUploader />
            <BlockIcon>drive_folder_upload</BlockIcon>
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
            data-title={'新增自訂區塊'}
            onMouseDown={(event) => {
                event.preventDefault();
                CustomEditor.insertEditableCard(editor);
            }}
        >
            <BlockIcon>add</BlockIcon>
        </Button>
    );
};
