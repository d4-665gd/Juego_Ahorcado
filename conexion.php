<?php
// Datos de conexión a la base de datos
$servername = "localhost"; // Servidor de la base de datos
$username = "root";        // Usuario de MySQL (por defecto es "root" en XAMPP)
$password = "";            // Contraseña de MySQL (por defecto está vacía en XAMPP)
$dbname = "ahorcado1";      // Nombre de la base de datos que creaste

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar si la conexión fue exitosa
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error); // Si hay un error, detener la ejecución
}

// Opcional: Configurar el charset a utf8 (para evitar problemas con caracteres especiales)
$conn->set_charset("utf8");

// Ahora $conn está lista para ser usada en otros archivos PHP
?>