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
        children = <span style={{ textDecoration: 'underline' }}>{children}</span>;
    }

    return <span {...attributes}>{children}</span>;
};

export default Leaf;
