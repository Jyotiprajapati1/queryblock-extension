import { registerBlockVariation } from "@wordpress/blocks";
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';

const MY_VARIATION_NAME = "query-loop-extend";

// Register the block variation
registerBlockVariation("core/query", {
    name: MY_VARIATION_NAME,
    title: "Custom Query Loop",
    description: "A custom query loop block with extended functionalities.",
    icon: "smiley",
    attributes: {
        namespace: MY_VARIATION_NAME,
        displayPagination: {
            type: 'boolean',
            default: false
        },
        query: {
            query_loop_extend: { 
                type: 'boolean', 
                default: true 
            },
            perPage: -1, // Set to -1 to show all posts
        },
    },
    isActive: (blockAttributes) => {
        console.log('Block Attributes:', blockAttributes); // Debugging line
        return blockAttributes.namespace === MY_VARIATION_NAME;
    },
    scope: ["inserter"],
});

// Modify the core Query Loop block
const withCustomQueryLoop = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        if (props.name === 'core/query' && props.attributes.namespace === MY_VARIATION_NAME) {
            // Remove pagination from the query
            props.attributes.query = {
                ...props.attributes.query,
                perPage: -1,
            };

            // Force displayPagination to false
            props.attributes.displayPagination = false;

            return (
                <>
                    <BlockEdit {...props} />
                    <InspectorControls>
                        {/* This empty InspectorControls component will override the default one,
                            effectively removing the pagination controls */}
                    </InspectorControls>
                </>
            );
        }
        return <BlockEdit {...props} />;
    };
}, 'withCustomQueryLoop');

addFilter('editor.BlockEdit', 'my-plugin/custom-query-loop', withCustomQueryLoop);

// Remove pagination from the block preview
const removePreviewPagination = (element, blockType, attributes) => {
    if (blockType.name === 'core/query' && attributes.namespace === MY_VARIATION_NAME) {
        // Find and remove the pagination component from the preview
        const removePagination = (el) => {
            if (el && el.props && el.props.children) {
                el.props.children = Array.isArray(el.props.children) 
                    ? el.props.children.filter(child => !child || !child.props || child.props.className !== 'wp-block-query-pagination')
                    : el.props.children;
            }
            return el;
        };

        return removePagination(element);
    }
    return element;
};

addFilter('blocks.getSaveElement', 'my-plugin/remove-pagination', removePreviewPagination);