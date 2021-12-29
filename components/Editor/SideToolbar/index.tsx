import React from 'react';
import { BlockButton, InsertImageButton, InsertEditableCardButton, UploadImageButton } from '../components';
function SideToolbar() {
    return (
        <div className='flex flex-col z-10 bg-gray-600  rounded fixed py-1 px-1 left-28'>
            <BlockButton format='heading-two' icon='h_plus_mobiledata' title='H2標籤' />
            <BlockButton format='heading-three' icon='h_mobiledata' title='H3標籤' />
            <BlockButton format='block-quote' icon='format_quote' title='引言' />
            <BlockButton format='numbered-list' icon='format_list_numbered' title='數字列表' />
            <BlockButton format='bulleted-list' icon='format_list_bulleted' title='一般列表' />
            <InsertImageButton />
            <UploadImageButton />
            <InsertEditableCardButton />
        </div>
    );
}

export default SideToolbar;
