
/**
 * Plugin Name: Custom Query Loop Block
 * Description: Adds a custom query loop block with dynamic core classes.
 * Version: 1.0
 * Author: Your Name
 */

// defined( 'ABSPATH' ) || exit;

// function add_custom_class_to_query_loop( $block_content, $block ) {
// if ( isset( $block['blockName'] ) && $block['blockName'] === 'core/query' ) {
// $custom_class = 'custom-list';
// if ( is_string( $block_content ) ) {
// $block_content = preg_replace_callback(
// '/<li\b([^>]*)>/i',
// function ( $matches ) use ( $custom_class ) {
// if ( strpos( $matches[1], 'class=' ) !== false ) {
// return str_replace( 'class="', 'class="' . $custom_class . ' ', $matches[0] );
// } else {
// return '<li' . $matches[1] . ' class="' . esc_attr( $custom_class ) . '">';
// }
// },
// $block_content
// );
// }
// }
// return $block_content;
// }
// add_filter( 'render_block', 'add_custom_class_to_query_loop', 10, 2 );


// function add_custom_class_to_query_loop( $block_content, $block ) {
// 	if ( isset( $block['blockName'] ) && $block['blockName'] === 'core/query' ) {
// 		$custom_class = 'custom-list';

// 		// Use DOMDocument to manipulate the HTML content more reliably
// 		$dom = new DOMDocument();
// 		libxml_use_internal_errors( true ); // Suppress errors due to malformed HTML
// 		$dom->loadHTML( mb_convert_encoding( $block_content, 'HTML-ENTITIES', 'UTF-8' ) );
// 		libxml_clear_errors();

// 		$lis = $dom->getElementsByTagName( 'li' );

// 		foreach ( $lis as $li ) {
// 			// Extract post ID from class attribute
// 			$classAttr = $li->getAttribute( 'class' );
// 			preg_match( '/post-(\d+)/', $classAttr, $matches );

// 			if ( isset( $matches[1] ) ) {
// 				$post_id = $matches[1];

// 				// Fetch term IDs for categories and tags
// 				$categories = wp_get_post_categories( $post_id );
// 				$tags       = wp_get_post_tags( $post_id );

// 				// Set data attributes with term IDs
// 				$li->setAttribute( 'data-category-ids', implode( ',', $categories ) );
// 				$li->setAttribute( 'data-tag-ids', implode( ',', wp_list_pluck( $tags, 'term_id' ) ) );

// 				// Add custom class if not present
// 				if ( strpos( $classAttr, $custom_class ) === false ) {
// 					$li->setAttribute( 'class', trim( $classAttr . ' ' . $custom_class ) );
// 				}
// 			}
// 		}

// 		// Save changes back to HTML
// 		$block_content = $dom->saveHTML( $dom->documentElement );
// 	}

// 	return $block_content;
// }
// add_filter( 'render_block', 'add_custom_class_to_query_loop', 10, 2 );

// function add_custom_class_to_query_loop( $block_content, $block ) {
// if ( isset( $block['blockName'] ) && $block['blockName'] === 'core/query' ) {
// $custom_class = 'custom-list';
// if ( is_string( $block_content ) ) {
// $block_content = preg_replace_callback(
// '/<li\b([^>]*)>/i',
// function ( $matches ) use ( $custom_class ) {
// if ( strpos( $matches[1], 'class=' ) !== false ) {
// return str_replace( 'class="', 'class="' . $custom_class . ' ', $matches[0] );
// } else {
// return '<li' . $matches[1] . ' class="' . esc_attr( $custom_class ) . '">';
// }
// },
// $block_content
// );
// }
// }
// return $block_content;
// }
// add_filter( 'render_block', 'add_custom_class_to_query_loop', 10, 2 );

// function add_custom_class_to_query_loop( $block_content, $block ) {
// if ( isset( $block['blockName'] ) && $block['blockName'] === 'core/query' ) {
// $custom_class = 'custom-list';

// Use DOMDocument to manipulate the HTML content more reliably
// $dom = new DOMDocument();
// libxml_use_internal_errors( true ); // Suppress errors due to malformed HTML
// $dom->loadHTML( mb_convert_encoding( $block_content, 'HTML-ENTITIES', 'UTF-8' ) );
// libxml_clear_errors();

// $lis = $dom->getElementsByTagName( 'li' );

// foreach ( $lis as $li ) {
// Extract post ID from class attribute
// $classAttr = $li->getAttribute( 'class' );
// preg_match( '/post-(\d+)/', $classAttr, $matches );

// if ( isset( $matches[1] ) ) {
// $post_id = $matches[1];

// Fetch term IDs for categories and tags
// $categories = wp_get_post_categories( $post_id );
// $tags       = wp_get_post_tags( $post_id );

// Combine term IDs for categories and tags
// $term_ids = array_merge( $categories, wp_list_pluck( $tags, 'term_id' ) );
// $li->setAttribute( 'data-term-ids', implode( ',', $term_ids ) );

// Add custom class if not present
// if ( strpos( $classAttr, $custom_class ) === false ) {
// $li->setAttribute( 'class', trim( $classAttr . ' ' . $custom_class ) );
// }
// }
// }

// Save changes back to HTML
// $block_content = $dom->saveHTML();
// }

// return $block_content;
// }
// add_filter( 'render_block', 'add_custom_class_to_query_loop', 10, 2 );

