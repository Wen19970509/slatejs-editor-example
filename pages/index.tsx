import SlateEditor from '@root/components/Editor';
const Home = () => {
    return (
        <div className='min-h-screen flex flex-col bg-gray-100'>
            <h1 className='text-center mt-7 text-indigo-500'>SlateEditor Example </h1>
            <p className='text-center text-blue-700 my-4 underline decoration-1'>
                <a href='https://github.com/Wen19970509/slateEditor-nextjs-example.git' target='_blank'>
                    GitHub
                </a>
            </p>
            <div className='px-56 flex-grow flex-row flex'>
                <div className='bg-white flex-grow'>
                    <SlateEditor />
                </div>
            </div>
        </div>
    );
};

export default Home;
