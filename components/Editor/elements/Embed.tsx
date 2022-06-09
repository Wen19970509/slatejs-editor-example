import { useRouter } from 'next/router';
import React from 'react';
import { BaseEditor, Transforms, createEditor, Element as SlateElement, Descendant } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor, useSelected, useSlateStatic } from 'slate-react';

export const withEmbeds = (editor: BaseEditor & ReactEditor & HistoryEditor) => {
    const { isVoid } = editor;
    editor.isVoid = (element) => (element.type === 'embed' ? true : isVoid(element));
    return editor;
};

export const EmbedElement = ({ attributes, children, element }: any) => {
    const editor = useSlateStatic();
    const { url } = element;
    // 為了將instagram網址轉成固定能嵌入的格式
    console.log('刪除後面字串改成embed', url.replace('?utm_source=ig_web_copy_link', 'embed'));
    const instagram_URL = url.replace('?utm_source=ig_web_copy_link', 'embed');
    //www.instagram.com/p/Cd3ArxrF5sj/?utm_source=ig_web_copy_link

    // const facebook_URL = (
    //     <iframe
    //         src='https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FRealMadridTaiwan%2Fposts%2F443131121149691&show_text=true&width=500'
    //         width='500'
    //         height='558'
    //         style='border:none;overflow:hidden'
    //         scrolling='no'
    //         frameborder='0'
    //         allowfullscreen='true'
    //         allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
    //     ></iframe>
    // );
    // console.log('facebook_URL', facebook_URL.props.src.substr(12, 8)); // string of facebook

    return (
        <div {...attributes}>
            <div contentEditable={false}>
                {/* <div className='w-full h-screen relative'> */}
                <div className='w-full p-64 relative'>
                    {url ? (
                        <iframe
                            // src如果是instagram，後面要有/embed，例如http://instagram.com/p/qbq6fIJMVZ/embed
                            src={url.substr(12, 9) === 'instagram' ? `${instagram_URL}` : `${url}?title=0&byline=0&portrait=0`}
                            frameBorder='0'
                            className='absolute top-0 left-0 w-1/2 h-full  border-2 border-gray border-solid'
                        />
                    ) : (
                        <img src='https://i.imgur.com/EKRnhpn.png' className='absolute top-0 left-0 w-full h-full' />
                    )}
                </div>
                <UrlInput
                    url={url}
                    onChange={(val: any) => {
                        const path = ReactEditor.findPath(editor, element);
                        const newProperties: Partial<SlateElement> = {
                            url: val,
                        };
                        Transforms.setNodes<SlateElement>(editor, newProperties, {
                            at: path,
                        });
                    }}
                />
            </div>
            {children}
        </div>
    );
};
const UrlInput = ({ url, onChange }: any) => {
    const [value, setValue] = React.useState(url);
    return (
        <input
            value={value}
            onClick={(e) => e.stopPropagation()}
            className='border-2 border-gray border-solid mb-5 p-2 w-1/2 box-border'
            onChange={(e) => {
                const newUrl = e.target.value;
                setValue(newUrl);
                onChange(newUrl);
            }}
        />
    );
};
