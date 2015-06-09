<?php
$data = json_decode(file_get_contents("php://input"));

$email = ($data->invitation->email);
$link = ($data->invitation->link);
$team = ($data->invitation->team);
$name = ($data->invitation->name);

var_dump($email);


require 'mailer/PHPMailerAutoload.php';

$mail = new PHPMailer;

//$mail->SMTPDebug = 3;                               // Enable verbose debug output

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'smtp.mandrillapp.com';  // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'digital@arkafrica.com';                 // SMTP username
$mail->Password = 'IS7KMpDA5EmrfRScSKNQmA';                           // SMTP password
$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 587;                                    // TCP port to connect to

$mail->From = 'shed';
$mail->FromName = 'shed';
$mail->addAddress(''.$email);               // Name is optional

$mail->isHTML(true);                                  // Set email format to HTML


$template = file_get_contents('template.html');

$message = str_replace('%team%', $team, $template);
$message = str_replace('%link%', $link, $message);
$message = str_replace('%user%', $name, $message);






$mail->Subject = 'Join us at shed';
$mail->Body    = ''.$message;

//echo $message;


if(!$mail->send()) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Message has been sent';
}