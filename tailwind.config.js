module.exports = {
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        screens: {
            phone: '320px', // 手機
            tablet: '768px', // 平板
            laptop: '980px', // 筆電、桌機
            desktop: '1280px', // 較大桌機
        },
    },
    variants: {
        extend: {
            display: ['group-hover'],
            backgroundColor: ['disabled'],
            borderColor: ['disabled'],
        },
    },
};
