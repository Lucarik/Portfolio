<?php
   $dbUser = get_cfg_var('dbUser');
   $dbPass = get_cfg_var('dbPass');
   $dbName = get_cfg_var('dbName');
   //Initialize database connection
   $db = new mysqli('localhost', $dbUser, $dbPass, $dbName);
   
   //echo mysqli_connect_errno();  
   if (mysqli_connect_errno()) {     
       echo 'Error: Could not connect to database.  Please try again later.';     
       exit;
   } //else {
       //echo 'Connected to database';
   //}

   session_start();
   
   $user_check = $_SESSION['login_user'];
   
   $ses_sql = mysqli_query($db,"select Username from person where Username = '$user_check' ");
   
   $row = mysqli_fetch_array($ses_sql,MYSQLI_ASSOC);
   
   $login_session = $row['Username'];

   if(!isset($_SESSION['login_user'])){
      header("location:login.php");
      die();
   }
?>