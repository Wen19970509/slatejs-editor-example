const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>;
    }

    if (leaf.code) {
        children = <code>{children}</code>;
    }

    if (leaf.italic) {
        children = <em>{children}</em>;
    }

    if (leaf.underline) {
        children = <u>{children}</u>;
    }
    if (leaf.strikethrough) {
        children = <del>{children}</del>;
    }

    return (
        <span {...attributes} {...(leaf.highlight && { 'data-cy': 'search-highlighted' })} className={`${leaf.bold && 'boldSTY'} ${leaf.highlight && 'bgSTY'}`}>
            {children}
        </span>
    );
};

export default Leaf;
