import React, { Ref, PropsWithChildren } from 'react';
import { useSlate } from 'slate-react';
import CustomEditor from './utils/customSettings';
interface BaseProps {
    className: string;
    [key: string]: unknown;
}
type OrNull<T> = T | null;

const ButtonSTY = (active, reversed) => {
    return { color: reversed ? (active ? 'white' : '#aaa') : active ? '#17a884' : 'white' };
};
export const Button = React.forwardRef(
    (
        {
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
