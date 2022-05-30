import { allowedNodeEnvironmentFlags } from 'process';
import { EditableCard } from './EditableCard';
import { EmbedElement } from './Embed';
import { Image } from './Image';
import { LinkComponent } from './Link';
const CustomElement = (props) => {
    const { attributes, children, element } = props;
    // 這個style是為了靠左中右對齊而設立的
    const style = { textAlign: element.align };
    switch (element.type) {
        case 'title':
            return (
                <h1 style={style} className='mb-8' {...attributes}>
                    {children}
                </h1>
            );
        case 'heading-one':
            return (
                <h1 style={style} {...attributes}>
                    {children}
                </h1>
            );
        case 'heading-two':
            return (
                <h2 style={style} {...attributes}>
                    {children}
                </h2>
            );
        case 'heading-three':
            return (
                <h3 style={style} {...attributes}>
                    {children}
                </h3>
            );
        case 'heading-four':
            return (
                <h4 style={style} {...attributes}>
                    {children}
                </h4>
            );
        case 'heading-five':
            return (
                <h5 style={style} {...attributes}>
                    {children}
                </h5>
            );
        case 'heading-six':
            return (
                <h6 style={style} {...attributes}>
                    {children}
                </h6>
            );
        case 'block-quote':
            return (
                <blockquote style={style} {...attributes}>
                    {children}
                </blockquote>
            );
        case 'bulleted-list':
            return (
                <ul style={style} {...attributes}>
                    {children}
                </ul>
            );
        case 'list-item':
            return (
                <li style={style} {...attributes}>
                    {children}
                </li>
            );
        case 'numbered-list':
            return (
                <ol style={style} {...attributes}>
                    {children}
                </ol>
            );
        case 'embed':
            return <EmbedElement {...props} />;
        case 'editable-card':
            return <EditableCard {...props} />;
        case 'link':
            return <LinkComponent {...props} />;
        case 'image':
            return <Image {...props} />;

        default:
            return (
                <p style={style} {...attributes}>
                    {children}
                </p>
            );
    }
};

export default CustomElement;
