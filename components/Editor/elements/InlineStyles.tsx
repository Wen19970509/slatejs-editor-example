const InlineStyles = (props) => {
    const style = {
        fontWeight: props.leaf.bold ? 'bold' : 'normal',
    };
    return (
        <span {...props.attributes} style={style}>
            {props.children}
        </span>
    );
};

export default InlineStyles;
