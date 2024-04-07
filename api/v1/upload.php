<?php
header("Content-Type: application/json");

$env = parse_ini_file('../../.env');

$servername = $env["DB_URL"];
$username = $env["DB_USER"];
$password = $env["DB_PASSWORD"];
$database = $env["DB_NAME"];
$tableName = $env["DB_TABLE"];


// Define the normalization rules
function normalizePhoneNumber($number) {
    $number = preg_replace('/\D/', '', $number); // Remove non-digit characters
    return $number;
}

function normalizeDestChannel($channel) {
    $channel = trim($channel); // Remove leading/trailing whitespace
    $channel = preg_replace('/[^a-zA-Z0-9\-]/', '-', $channel); // Replace special characters with hyphens
    $channel = str_replace('--', '', $channel);
    return $channel;
}

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Connection failed: " . $conn->connect_error));
    exit();
}

// Function to check if table exists
function tableExists($conn, $tableName) {
    $result = $conn->query("SHOW TABLES LIKE '$tableName'");
    return $result->num_rows > 0;
}

// Check if log_calls table exists
if (!tableExists($conn, $tableName)) {
    // Table doesn't exist, create it
    $createTableQuery = "CREATE TABLE $tableName (
        id INT AUTO_INCREMENT PRIMARY KEY,
        calldate DATETIME,
        disposition VARCHAR(255),
        dst VARCHAR(255),
        dstchannel VARCHAR(255),
        duration INT,
        src VARCHAR(255)
    )";

    if ($conn->query($createTableQuery) === FALSE) {
        http_response_code(500); // Internal Server Error
        echo json_encode(array("error" => "Error creating table: " . $conn->error));
        exit();
    }
}

// Read JSON data from request body
$jsonData = file_get_contents("php://input");

// Convert JSON data to PHP array
$csvData = json_decode($jsonData, true);

// Check if CSV data is successfully decoded
if ($csvData === null) {
    http_response_code(400); // Bad Request
    echo json_encode(array("error" => "Invalid JSON data"));
    exit();
}

// Prepare and bind SQL statement to insert CSV data into database
$insertQuery = "INSERT INTO $tableName (calldate, disposition, dst, dstchannel, duration, src) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($insertQuery);
$stmt->bind_param("ssssis", $calldate, $disposition, $dst, $dstchannel, $duration, $src);

$insertedRows = 0;

// Process each row of CSV data
foreach ($csvData as $row) {
    // Normalize the data and SQL Injection Prevention
    $calldate = $conn->real_escape_string($row['calldate']);
    $disposition = $conn->real_escape_string($row['disposition']);
    $dst = normalizePhoneNumber($conn->real_escape_string($row['dst']));
    $dstchannel = normalizeDestChannel($conn->real_escape_string($row['dstchannel']));
    $duration = intval($row['duration']);
    $src = normalizePhoneNumber($conn->real_escape_string($row['src']));

    // Execute the prepared statement
    if ($stmt->execute()) {
        $insertedRows++;
    } else {
        // If there's an error, terminate the process and send a failure response
        http_response_code(500); // Internal Server Error
        echo json_encode(array("error" => "Error inserting data into the database: " . $stmt->error));
        exit();
    }
}

// Close statement and connection
$stmt->close();
$conn->close();

// Check if any rows were inserted
if ($insertedRows > 0) {
    // Send success response with the number of entries inserted
    echo json_encode(array("success" => true, "message" => "$insertedRows entries inserted successfully"));
} else {
    // Send error response if no rows were inserted
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "No data inserted into the database"));
}
?>
