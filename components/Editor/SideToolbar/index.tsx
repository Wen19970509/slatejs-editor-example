import React from 'react';
import { BlockButton, InsertImageButton, InsertEditableCardButton, UploadImageButton } from '../components';
function SideToolbar() {
    return (
        <div className='flex flex-col z-10 bg-gray-600  rounded fixed py-1 px-1 left-28'>
            <BlockButton format='heading-two' icon='looks_two' />
            <BlockButton format='heading-three' icon='looks_3' />
            <BlockButton format='block-quote' icon='format_quote' />
            <BlockButton format='numbered-list' icon='format_list_numbered' />
            <BlockButton format='bulleted-list' icon='format_list_bulleted' />
            <InsertImageButton />
            <UploadImageButton />
            <InsertEditableCardButton />
        </div>
    );
}

export default SideToolbar;
