import React from 'react';
import { BlockButton, InsertImageButton, InsertEditableCardButton, UploadImageButton, EmbedButton } from '../components';
function SideToolbar() {
    return (
        <div className='flex z-10 bg-gray-600  rounded fixed py-1 px-1 left-28'>
            <div className='flex flex-col '>
                <BlockButton format='heading-two' icon='h_plus_mobiledata' title='H2標籤' />
                <BlockButton format='heading-three' icon='h_mobiledata' title='H3標籤' />
                <BlockButton format='block-quote' icon='format_quote' title='引言' />
                <BlockButton format='left' icon='format_align_left' title='靠左對齊' />
                <BlockButton format='center' icon='format_align_center' title='置中對齊' />
                <BlockButton format='right' icon='format_align_right' title='靠右對齊' />
                <BlockButton format='justify' icon='format_align_justify' title='自動調整' />
            </div>
            <div className='flex flex-col '>
                <BlockButton format='numbered-list' icon='format_list_numbered' title='數字列表' />
                <BlockButton format='bulleted-list' icon='format_list_bulleted' title='一般列表' />
                <InsertImageButton />
                <UploadImageButton />
                <EmbedButton />
                <InsertEditableCardButton />
            </div>
        </div>
    );
}

export default SideToolbar;
