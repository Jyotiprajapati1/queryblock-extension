<?php
/**
 * Plugin Name: Custom Query Loop Block
 * Description: Adds a custom query loop block with dynamic core classes and filtering functionality.
 * Version: 1.0
 * Author: Your Name
 *
 * @package a
 */

defined( 'ABSPATH' ) || exit;

function generate_unique_id($length = 8 , $prefix = 'uid-') {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyz';
    $charactersLength = strlen($characters);
    $unique_id = '';
    for ($i = 0; $i < $length; $i++) {
        $unique_id .= $characters[rand(0, $charactersLength - 1)];
    }
   
    return $prefix . $unique_id;
}

function add_custom_class_to_query_loop( $block_content, $block ) {
    if ( 'core/query' === $block['blockName'] ) {
        $unique_id = generate_unique_id();
        $custom_class = 'custom-list-' ; 
        
        $tag_processor = new WP_HTML_Tag_Processor( $block_content );

        while ( $tag_processor->next_tag( 'li' ) ) {
            $class_attribute = $tag_processor->get_attribute( 'class' );
            $post_id = null;

            if ( $class_attribute && preg_match( '/post-(\d+)/', $class_attribute, $attr_matches ) ) {
                $post_id = $attr_matches[1];
                $categories = wp_get_post_categories( $post_id );
                $tags = wp_get_post_tags( $post_id );

                $term_ids = array_merge( $categories, wp_list_pluck( $tags, 'term_id' ) );

                $term_id_classes = array_map(
                    function ( $term_id ) {
                        return 'term-id-' . $term_id;
                    },
                    $term_ids
                );
                $term_id_classes_string = implode( ' ', $term_id_classes );
            }

            $class_to_add = $custom_class;
            if ( isset( $post_id ) && isset( $term_id_classes_string ) ) {
                $class_to_add .= ' ' . $term_id_classes_string;
            }

            if ( $class_attribute ) {
                $tag_processor->set_attribute( 'class', $class_attribute . ' ' . $class_to_add );
            } else {
                $tag_processor->set_attribute( 'class', $class_to_add );
            }
        }

        $block_content = $tag_processor->get_updated_html();

        // Add filtering buttons
        $categories = get_categories();
        $tags = get_tags();

        $buttons = '<div class="filters ' . $unique_id . '">' .
            '<button class="active">All</button>';

        foreach ( $categories as $category ) {
            $buttons .= '<button class="term-id-' . $category->term_id . '">' . esc_html( $category->name ) . '</button>';
        }

        foreach ( $tags as $tag ) {
            $buttons .= '<button class="term-id-' . $tag->term_id . '">' . esc_html( $tag->name ) . '</button>';
        }

        $buttons .= '</div>';
        $block_content = $buttons . $block_content;

        // Add inline script
        $block_content .= '<script>
document.addEventListener("DOMContentLoaded", function () {
    const filters = document.querySelector(".filters-' . $unique_id . '");
    const buttons = filters.querySelectorAll("button");
    const listItems = document.querySelectorAll(".custom-list-' . $unique_id . '");

    if (buttons.length && listItems.length) {
        buttons.forEach(button => {
            button.addEventListener("click", function () {
                const classToShow = this.classList[0];

                listItems.forEach(li => {
                    if (classToShow === "active" || li.classList.contains(classToShow)) {
                        li.style.display = "block";
                    } else {
                        li.style.display = "none";
                    }
                });
            });
        });

        // Initialize the list to show all items when "All" is active
        const activeButton = filters.querySelector(".active");
        if (activeButton) {
            activeButton.click();
        }
    }
});
</script>';
    }
    return $block_content;
}

add_filter( 'render_block', 'add_custom_class_to_query_loop', 10, 2 );
