<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <link href="css/teststyle.css" rel="stylesheet">
    <title>Family inTouch</title>
</head>
<body class="decal">
    <h1 class="floating-title">Family inTouch</h1>
    <div class="content">
        <div class="login">
            <h1 class="title">Family inTouch</h1>
            <form class="login_form" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" method="post">
                <input class="form-input" type="text" id="username" name="username" placeholder="Enter Username">
                <input class="form-input" type="password" id="password" name="password" placeholder="Enter Password">
                <button class="form-button" type="submit" id="loginB" name="loginB">Login</button>
            </form>
            <a class="blue-link" href="register.php">Register here</a>
            <span class="wrongp" style="display:none;margin-left: 34%;margin-top:0;padding-top:0;">Wrong username or password</span>
        </div>
        
    </div>
    <?php
    
    // define variables and set to empty values
    $user = $pass = "";

    $dbUser = get_cfg_var('dbUser');
    $dbPass = get_cfg_var('dbPass');
    $dbName = get_cfg_var('dbName');
    //Initialize database connection
    $db = new mysqli('localhost', $dbUser, $dbPass, $dbName);
    
    //echo mysqli_connect_errno();  
    if (mysqli_connect_errno()) {     
        //echo 'Error: Could not connect to database.  Please try again later.';     
        exit;
    } else {
        //echo 'Connected to database';
    }
    session_start();

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $user = test_input($_POST["username"]);
        $pass = test_input($_POST["password"]);

        $dbUser = get_cfg_var('dbUser');
        $dbPass = get_cfg_var('dbPass');
        $dbName = get_cfg_var('dbName');
        //Initialize database connection
        $db = new mysqli('localhost', $dbUser, $dbPass, $dbName);
        
        //echo mysqli_connect_errno();  
        if (mysqli_connect_errno()) {     
            //echo 'Error: Could not connect to database.  Please try again later.';     
            exit;
        } else {
            //echo 'Connected to database';
        }
        // Get encrypted version of password and check match
        $pepper = get_cfg_var('pepper');
        $pwd_peppered = hash_hmac("sha256", $pass, $pepper);
        $query = 'SELECT Password FROM Person WHERE Username = "'.$user.'"';
        $result = $db->query($query);
        while ($row = $result->fetch_assoc()) {
            $pwd_hashed = stripslashes($row['Password']);
        }
        $result->free();
        
        if (password_verify($pwd_peppered, $pwd_hashed)) {
            //echo "Password matches.";
            $_SESSION['login_user'] = $user;
         
            header("location: profile.php");

            //echo '<meta http-equiv = "refresh" content = "2; url = profile.html" />';
        }
        else {
            $wrongp = true;
            json_encode($wrongp);
            //echo "Input Password = '.$pwd_peppered.'";
            //echo "Reals Password = '.$pwd_hashed.'";
            //echo "Password incorrect.";
        }

    }
    

    function test_input($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }
    

    ?>

    <script type="text/javascript">
        // If wrong password display text
        var wrp = <?php echo json_encode($wrongp);?>;
        if (wrp) {
            document.querySelector(".wrongp").style.display = "flex";
        } else {
            document.querySelector(".wrongp").style.display = "none";
        }
    </script>
</body>
</html>