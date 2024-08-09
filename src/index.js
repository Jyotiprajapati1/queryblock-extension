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
                [ 'core/post-title' ],
                [ 'core/post-date' ],
                [ 'core/post-excerpt' ],
            ],
        ],
        [ 'core/query-no-results' ],
    ],
    supports: {
        pagination: false
    }
});

