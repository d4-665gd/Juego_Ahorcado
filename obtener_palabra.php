<?php
//header("Access-Control-Allow-Origin: *"); // Permitir solicitudes desde cualquier origen
//header("Content-Type: application/json; charset=UTF-8"); // Especificar que la respuesta es JSON

include 'conexion.php';

$sql = "SELECT palabra FROM palabras ORDER BY RAND() LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode(["palabra" => $row['palabra']]);
} else {
    echo json_encode(["error" => "No se encontraron palabras en la base de datos"]);
}

$conn->close();
?>