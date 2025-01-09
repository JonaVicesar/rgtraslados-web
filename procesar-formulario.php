<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    $to = 'rgtraslados01@gmail.com'; 
    $subject = 'Nuevo mensaje desde el formulario de contacto';
    $body = "Nombre: $name\nCorreo: $email\nMensaje:\n$message";
    $headers = "From: no-reply@tudominio.com";

    if (mail($to, $subject, $body, $headers)) {
        echo "Gracias, $name. Tu mensaje fue enviado correctamente.";
    } else {
        echo "Lo sentimos, hubo un problema al enviar tu mensaje.";
    }
} else {
    echo "Método no permitido.";
}
?>
