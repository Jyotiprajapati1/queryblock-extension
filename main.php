<?php
/**
 * Plugin Name: Custom Query Loop Block
 * Description: Adds a custom query loop block with dynamic core classes and filtering functionality.
 * Version: 1.0
 * Author: Your Name
 *
 * @package custom-query-loop
 */

defined( 'ABSPATH' ) || exit;

function enqueue_block_variation_script() {
    wp_enqueue_script(
        'my-block-variation-script',
        plugins_url('build/index.js', __FILE__), // Adjust the path if necessary
        array('wp-blocks', 'wp-element', 'wp-components'), // Dependencies
        filemtime(plugin_dir_path(__FILE__) . 'build/index.js') // Version
    );
}
add_action('enqueue_block_editor_assets', 'enqueue_block_variation_script');

function generate_unique_id( $length = 8, $prefix = 'uid-' ) {
    $characters        = '0123456789abcdefghijklmnopqrstuvwxyz';
    $characters_length = strlen( $characters );
    $unique_id         = '';
    for ( $i = 0; $i < $length; $i++ ) {
        $unique_id .= $characters[ random_int( 0, $characters_length - 1 ) ];
    }
    return $prefix . $unique_id;
}

function add_custom_class_to_query_loop( $block_content, $block ) {
    if ( isset( $block['attrs']['namespace'] ) && 'query-loop-extend' === $block['attrs']['namespace'] ) {
        $unique_id          = generate_unique_id();
        $custom_class       = 'custom-list-' . $unique_id;
        $wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'query-loop ' . $unique_id ) );
		var_dump($block['attrs']['displayPagination'] );
		if ( isset( $block['attrs']['displayPagination'] ) && ! $block['attrs']['displayPagination'] ) {
            $block_content = preg_replace( '/<nav[^>]*class="[^"]*wp-block-query-pagination[^"]*"[^>]*>.*?<\/nav>/s', '', $block_content );
        }
        if ( class_exists( 'WP_HTML_Tag_Processor' ) ) {
            $tag_processor = new WP_HTML_Tag_Processor( $block_content );

            if ( $tag_processor->next_tag( 'div' ) ) {
                $existing_class = $tag_processor->get_attribute( 'class' );
                $new_class      = $existing_class ? $existing_class . ' query-loop ' . $unique_id : 'query-loop ' . $unique_id;
                $tag_processor->set_attribute( 'class', $new_class );

                preg_match_all( '/(\w+)="([^"]*)"/', $wrapper_attributes, $matches, PREG_SET_ORDER );
                foreach ( $matches as $match ) {
                    if ( $match[1] !== 'class' ) {
                        $tag_processor->set_attribute( $match[1], $match[2] );
                    }
                }
            }

            while ( $tag_processor->next_tag( 'li' ) ) {
                $class_attribute = $tag_processor->get_attribute( 'class' );
                $post_id         = null;

                if ( $class_attribute && preg_match( '/post-(\d+)/', $class_attribute, $attr_matches ) ) {
                    $post_id    = $attr_matches[1];
                    $categories = wp_get_post_categories( $post_id );
                    $tags       = wp_get_post_tags( $post_id );

                    $term_ids = array_merge( $categories, wp_list_pluck( $tags, 'term_id' ) );

                    $term_id_classes        = array_map(
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

                $tag_processor->set_attribute( 'class', $class_attribute ? $class_attribute . ' ' . $class_to_add : $class_to_add );
            }

            $block_content = $tag_processor->get_updated_html();
        } 
	
        $categories = get_categories();
        $tags       = get_tags();

        $buttons = '<div class="filters">' .
            '<button class="active ' . esc_attr( $unique_id ) . '">All</button>';

        foreach ( $categories as $category ) {
            $buttons .= '<button class="term-id-' . esc_attr( $category->term_id ) . '">' . esc_html( $category->name ) . '</button>';
        }
        foreach ( $tags as $tag ) {
            $buttons .= '<button class="term-id-' . esc_attr( $tag->term_id ) . '">' . esc_html( $tag->name ) . '</button>';
        }
        $buttons .= '</div>';

        $block_content = preg_replace( '/(<ul\b[^>]*>)/', $buttons . '$1', $block_content );
        // $block_content = preg_replace( '/<nav[^>]*class="[^"]*wp-block-query-pagination[^"]*"[^>]*>.*?<\/nav>/s', '', $block_content );

        $block_content .= '<script>
document.addEventListener("DOMContentLoaded", function () {
    const filters = document.querySelectorAll(".' . esc_js( $unique_id ) . '");
    const buttons = filters[0].querySelectorAll("button");
    const listItems = document.querySelectorAll(".custom-list-' . esc_js( $unique_id ) . '");

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

        const activeButton = filters[0].querySelector(".active");
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

function modify_query_parameters( $query ) {
   
    if ( ! is_admin() && $query->is_main_query() && 'post' === $query->get( 'post_type' ) ) {
         var_dump($query);
        $query->set( 'posts_per_page', -1 ); 

        $query->set( 'paged', 1 ); 
    }
}
add_action( 'pre_get_posts', 'modify_query_parameters' );