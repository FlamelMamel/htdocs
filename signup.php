<?php
session_start();

$email = "";
$password    = "";
$errors = array(); 

$db = mysqli_connect('localhost', 'root', '', 'site');
echo $_POST['email2'];

if (isset($_POST['email2'])) {
  $email = mysqli_real_escape_string($db, $_POST['email2']);
  $password = mysqli_real_escape_string($db, $_POST['pass2']);

  if (empty($email)) { array_push($errors, "Email is required"); }
  if (empty($password)) { array_push($errors, "password is required"); }

  $password = md5($password);

  $query = "INSERT INTO users (email, pass) 
  		  VALUES('$email', '$password')";
  mysqli_query($db, $query);

  setcookie("email", $email);

  header('location: index.html'); 
}