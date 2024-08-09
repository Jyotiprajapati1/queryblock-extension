import { registerBlockVariation, getBlockType } from "@wordpress/blocks";
import { addFilter } from '@wordpress/hooks';

const MY_VARIATION_NAME = "query-loop-extend";

registerBlockVariation("core/query", {
    name: MY_VARIATION_NAME,
    title: "Custom Query Loop",
    description: "A custom query loop block with extended functionalities.",
    icon: "smiley",
    isActive: ["namespace"],
    attributes: {
        namespace: MY_VARIATION_NAME,

    },
    scope: ["inserter", 'block'],
    allowedControls: ["postType"],
    innerBlocks: [
        [
            'core/post-template',
            {},
            [
                ['core/post-title'],
                ['core/post-date'],
                ['core/post-excerpt'],
            ],
        ],
        ['core/query-no-results'],
    ],
    supports: {
        pagination: false
    }
});

// const withAllowedBlocks = createHigherOrderComponent((BlockEdit) => {
//     return (props) => {
//         const { name, attributes } = props;

//         if (name === "core/query" && attributes.namespace === MY_VARIATION_NAME) {
//             return (
//                 <div {...props}>
//                     <InnerBlocks
//                         allowedBlocks={[
//                             "core/post-title",
//                             "core/post-date",
//                             "core/post-excerpt",
//                             "core/query-no-results",
//                         ]}
//                     />
//                 </div>
//             );
//         }

//         return <BlockEdit {...props} />;
//     };
// }, "withAllowedBlocks");

// // Apply the filter to restrict block insertion
// addFilter("editor.BlockEdit", "my-namespace/with-allowed-blocks", withAllowedBlocks);

// Optional: Restrict blocks from being inserted before or after
// const restrictInsertBlocks = (settings, name) => { 
//     if (name === "core/query-pagination" ) {
//         settings.parent = [];
//     }
//     return settings;
// };

// addFilter("blocks.registerBlockType", "MY_VARIATION_NAME/restrict-insert-blocks", restrictInsertBlocks);


const restrictInsertBlocks = (settings, name) => {
    if (name === "core/query-pagination") {

        settings.parent = settings.parent || [];

        settings.parent = settings.parent.filter(
            (parent) => parent !== 'core/query'
        );
    }
    return settings;
};

addFilter("blocks.registerBlockType", "MY_VARIATION_NAME/restrict-insert-blocks", restrictInsertBlocks);