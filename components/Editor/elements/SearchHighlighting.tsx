import React from 'react';
import { Icon, Toolbar } from '../components';

const SearchHighlighting = ({ setSearch }) => {
    return (
        <Toolbar>
            <div className='relative'>
                <Icon className='absolute top-1.5 left-1.5 text-gray-400'>search</Icon>
                <input type='search' placeholder='Search the text...' className='px-2 absolute ' onChange={(e) => setSearch(e.target.value)} />
            </div>
        </Toolbar>
    );
};

export default SearchHighlighting;
