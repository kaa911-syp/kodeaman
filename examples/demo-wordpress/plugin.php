<?php
/**
 * Plugin Name: Demo Vulnerable Plugin
 * Description: KodeAman demo — intentionally vulnerable WordPress plugin for testing
 * Version: 1.0.0
 *
 * DO NOT deploy this plugin — it contains deliberate security issues.
 */

// A03: SQL Injection — direct query without prepare()
function demo_search_users() {
    global $wpdb;
    $search = $_GET['search']; // phpcs:ignore -- intentional vulnerability
    // Vulnerable: unsanitized input in SQL query
    $results = $wpdb->get_results("SELECT * FROM {$wpdb->users} WHERE user_login LIKE '%{$search}%'");
    return $results;
}

// A01: Broken Access Control — missing nonce verification
function demo_delete_user() {
    if (isset($_POST['user_id'])) {
        global $wpdb;
        $user_id = $_POST['user_id']; // phpcs:ignore -- intentional vulnerability
        // Vulnerable: no nonce check, no capability check
        $wpdb->delete($wpdb->users, ['ID' => $user_id]);
        wp_send_json_success('User deleted');
    }
}
add_action('wp_ajax_demo_delete_user', 'demo_delete_user');

// A03: XSS — unescaped output
function demo_display_greeting() {
    $name = $_GET['name'] ?? 'Guest'; // phpcs:ignore -- intentional vulnerability
    // Vulnerable: raw echo without esc_html()
    echo "<h1>Welcome, {$name}!</h1>";
}

// A01: Missing capability check on admin page
function demo_admin_page() {
    // Vulnerable: no current_user_can() check
    add_menu_page(
        'Demo Settings',
        'Demo Settings',
        'read', // Should be 'manage_options'
        'demo-settings',
        function () {
            echo '<div class="wrap"><h1>Demo Settings</h1>';
            // Vulnerable: displaying sensitive options
            echo '<p>Secret Key: ' . get_option('demo_secret_key') . '</p>';
            echo '</div>';
        }
    );
}
add_action('admin_menu', 'demo_admin_page');

// A07: Hardcoded credentials
function demo_api_auth() {
    $api_key = 'hardcoded-api-key-12345';
    return $api_key;
}
