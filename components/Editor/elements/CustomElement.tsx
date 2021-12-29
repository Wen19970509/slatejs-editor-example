import { EditableCard } from './EditableCard';
import { Image } from './Image';
import { LinkComponent } from './Link';
const CustomElement = (props) => {
    const { attributes, children, element } = props;
    switch (element.type) {
        case 'editable-card':
            return <EditableCard {...props} />;
        case 'link':
            return <LinkComponent {...props} />;
        case 'image':
            return <Image {...props} />;
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>;
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>;
        case 'title':
            return (
                <h1 className='mb-8' {...attributes}>
                    {children}
                </h1>
            );
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>;
        case 'heading-three':
            return <h3 {...attributes}>{children}</h3>;
        case 'list-item':
            return <li {...attributes}>{children}</li>;
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>;
        default:
            return <p {...attributes}>{children}</p>;
    }
};

export default CustomElement;
