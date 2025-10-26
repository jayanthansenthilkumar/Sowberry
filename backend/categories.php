<?php
/**
 * Category Management Handler
 * CRUD operations for course categories
 */

require_once 'config.php';

header('Content-Type: application/json');

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {
    case 'get_all':
        getAllCategories();
        break;
    
    case 'get_one':
        getCategory();
        break;
    
    case 'create':
        createCategory();
        break;
    
    case 'update':
        updateCategory();
        break;
    
    case 'delete':
        deleteCategory();
        break;
    
    default:
        sendResponse(false, 'Invalid action');
}

/**
 * Get all categories
 */
function getAllCategories() {
    global $conn;
    
    $query = "SELECT 
                c.*,
                pc.category_name as parent_name,
                COUNT(DISTINCT co.course_id) as total_courses
              FROM categories c
              LEFT JOIN categories pc ON c.parent_category_id = pc.category_id
              LEFT JOIN courses co ON c.category_id = co.category_id
              WHERE c.is_active = 1
              GROUP BY c.category_id
              ORDER BY c.category_id ASC";
    
    $result = mysqli_query($conn, $query);
    $categories = [];
    
    while ($row = mysqli_fetch_assoc($result)) {
        $categories[] = $row;
    }
    
    sendResponse(true, 'Categories retrieved successfully', ['categories' => $categories]);
}

/**
 * Get single category
 */
function getCategory() {
    global $conn;
    
    $category_id = intval($_GET['id'] ?? 0);
    
    if (!$category_id) {
        sendResponse(false, 'Category ID required');
    }
    
    $query = "SELECT * FROM categories WHERE category_id = $category_id";
    $result = mysqli_query($conn, $query);
    
    if ($category = mysqli_fetch_assoc($result)) {
        sendResponse(true, 'Category retrieved successfully', ['category' => $category]);
    } else {
        sendResponse(false, 'Category not found');
    }
}

/**
 * Create new category
 */
function createCategory() {
    global $conn;
    
    requireLogin();
    hasPermission('admin');
    
    $category_name = sanitize($_POST['category_name'] ?? '');
    $description = sanitize($_POST['description'] ?? '');
    $icon = sanitize($_POST['icon'] ?? '');
    $parent_category_id = intval($_POST['parent_category_id'] ?? 0);
    
    if (empty($category_name)) {
        sendResponse(false, 'Category name is required');
    }
    
    // Check if category exists
    $checkQuery = "SELECT category_id FROM categories WHERE category_name = '$category_name'";
    if (mysqli_num_rows(mysqli_query($conn, $checkQuery)) > 0) {
        sendResponse(false, 'Category already exists');
    }
    
    $query = "INSERT INTO categories (category_name, description, icon, parent_category_id) 
              VALUES ('$category_name', '$description', '$icon', " . ($parent_category_id ?: 'NULL') . ")";
    
    if (mysqli_query($conn, $query)) {
        sendResponse(true, 'Category created successfully', [
            'category_id' => mysqli_insert_id($conn)
        ]);
    } else {
        sendResponse(false, 'Failed to create category');
    }
}

/**
 * Update category
 */
function updateCategory() {
    global $conn;
    
    requireLogin();
    hasPermission('admin');
    
    $category_id = intval($_POST['category_id'] ?? 0);
    
    if (!$category_id) {
        sendResponse(false, 'Category ID required');
    }
    
    $updates = [];
    
    if (isset($_POST['category_name'])) {
        $updates[] = "category_name = '" . sanitize($_POST['category_name']) . "'";
    }
    if (isset($_POST['description'])) {
        $updates[] = "description = '" . sanitize($_POST['description']) . "'";
    }
    if (isset($_POST['icon'])) {
        $updates[] = "icon = '" . sanitize($_POST['icon']) . "'";
    }
    
    if (empty($updates)) {
        sendResponse(false, 'No fields to update');
    }
    
    $query = "UPDATE categories SET " . implode(', ', $updates) . " WHERE category_id = $category_id";
    
    if (mysqli_query($conn, $query)) {
        sendResponse(true, 'Category updated successfully');
    } else {
        sendResponse(false, 'Failed to update category');
    }
}

/**
 * Delete category
 */
function deleteCategory() {
    global $conn;
    
    requireLogin();
    hasPermission('admin');
    
    $category_id = intval($_POST['category_id'] ?? 0);
    
    if (!$category_id) {
        sendResponse(false, 'Category ID required');
    }
    
    // Check if category has courses
    $checkQuery = "SELECT COUNT(*) as count FROM courses WHERE category_id = $category_id";
    $result = mysqli_query($conn, $checkQuery);
    $count = mysqli_fetch_assoc($result)['count'];
    
    if ($count > 0) {
        sendResponse(false, 'Cannot delete category with courses');
    }
    
    // Soft delete
    $query = "UPDATE categories SET is_active = 0 WHERE category_id = $category_id";
    
    if (mysqli_query($conn, $query)) {
        sendResponse(true, 'Category deleted successfully');
    } else {
        sendResponse(false, 'Failed to delete category');
    }
}

?>
