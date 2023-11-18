<!DOCTYPE html>
<html>
<head>
    <link href="css/teststyle.css" rel="stylesheet">
    <meta charset="utf-8" />
    <title>Register page</title>
</head>

<?php
    // define variables and set to empty values
    $fname = $lname = $user = $pass = $email = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $fname = test_input($_POST["fname"]);
        $lname = test_input($_POST["lname"]);
        $user = test_input($_POST["username"]);
        $pass = test_input($_POST["password"]);
        $email = test_input($_POST["email"]);

        $birthday = strtotime($_POST['birthday']);
        if ($birthday) {
            $new_date = date('Y-m-d', $birthday);
            //echo $new_date;
        } else {
            echo 'Invalid Date: ' . $_POST['dateFrom'];
            // fix it.
        }
    }

    function test_input($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }
?>

<body class="decal">
    <h1 class="floating-title">Family inTouch</h1>
    <div class="content">
        <form class="register-form" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" method="post">
            <h2 class="r2header">Registration</h2>
            <span>
                <label for="fname" class="desc">First Name</label>
                <input type="text" class="reg" id="fname" name="fname">
                <label for="lname" class="desc">Last Name</label>
                <input type="text" class="reg" id="lname" name="lname">
                <label for="username" class="desc">Username</label>
                <input type="text" class="reg" id="username" name="username">
                <label for="password" class="desc">Password</label>
                <input type="password" class="reg" id="password" name="password">
                <label for="email" class="desc">Email Address</label>
                <input type="email" class="reg" id="email" name="email">
                <label for="birthday" class="desc">Birthdate</label>
                <input type="date" class="reg" id="birthday" name="birthday"
                       value="2000-01-01"
                       min="1900-01-01" max="2021-01-01">
            </span>
            
            <button class="form-button" type="submit" name="confirm" id="confirm">Register</button>
        </form>
        <span class="wrongp" style="display:none;margin-left:30%;margin-top:0;margin-bottom:0;padding-bottom:0;padding-top:0;">Test test</span>
    </div>

    <?php
        if (!empty($fname)) {

        $dbUser = get_cfg_var('dbUser');
        $dbPass = get_cfg_var('dbPass');
        $dbName = get_cfg_var('dbName');
        //Initialize database connection
        $db = new mysqli('localhost', $dbUser, $dbPass, $dbName);
        
        //echo mysqli_connect_errno();  
        if (mysqli_connect_errno()) {     
            echo 'Error: Could not connect to database.  Please try again later.';     
            exit;
        } 

        $valid = true;
                
        //Checks if any of the inputs contain illegal characters
        if ((preg_match("/[^A-Za-z]/", $fname)) ||
            (preg_match("/[^A-Za-z]/", $lname)) ||
            (preg_match("/[^A-Za-z0-9]/", $user)) ||
            (preg_match("/[^A-Za-z0-9]/", $pass))) {
                
            $valid = false;
            
        }
        
        $empty = false;
        
        //Check for empty input value
        if ((empty($fname)) || 
            (empty($lname)) || 
            (empty($user)) || 
            (empty($pass)) || 
            (empty($email))) {
                
            $empty = true;    
        }
        //$pepper = ini_get ( "pepper" );
        $pepper = get_cfg_var("pepper");
        //$pepper = "c1isvFdxMDdmjOlvxpecFw";
        $pwd_peppered = hash_hmac("sha256", $pass, $pepper);
        $pwd_hashed = password_hash($pwd_peppered, PASSWORD_ARGON2ID);

        //Insert new user into database if no illegal input
        if (($valid == true) && ($empty == false)) {
            //echo '<p class="sqlpara">Valid-Empty: [ '.$valid.' ] [ '.$empty.' ]</p>';
            
            $query = 'INSERT INTO Person (Fname,Lname,Username,Password,Email,Birthday,image_link) VALUES ("'.$fname.'","'.$lname.'","'.$user.'","'.$pwd_hashed.'","'.$email.'","'.$new_date.'","default-user-icon.jpg")';
            $result = $db->query($query);
            
            $query = 'SELECT Username FROM Person WHERE Username = "'.$user.'"';
            $result = $db->query($query);
            $num_results = $result->num_rows;
            
            if ($num_results > 0) {
                echo '<p class="sqlpara">Added User [ '.$user.' ]</p>';
                header("location:login.php");
            } else {
                echo '<p class="sqlpara">Failed to add user. Please recheck input parameters</p>';
            }
            
        } elseif ($valid == false) {
            $wrongi = true;
            $emptyi = false;
            json_encode($wrongi);
            //echo '<p class="sqlpara">Input contains illegal characters. </p>';
        } elseif ($empty == true) {
            $emptyi = true;
            $wrongi = false;
            json_encode($emptyi);
            //echo '<p class="sqlpara">An input is empty. Please fill in inputs. </p>';
        }
        $db->close();
    }
    ?>
    <script type="text/javascript">
        // If wrong input display text
        var wri = <?php echo json_encode($wrongi);?>;
        var emi = <?php echo json_encode($emptyi);?>;
        if (wri) {
            document.querySelector(".wrongp").style.display = "flex";
            document.querySelector(".wrongp").innerHTML = "Input contains illegal characters.";
        } else {
            document.querySelector(".wrongp").style.display = "none";
        }
        if (emi) {
            document.querySelector(".wrongp").style.display = "flex";
            document.querySelector(".wrongp").innerHTML = "An input is empty. Please fill in inputs.";
        } else {
            document.querySelector(".wrongp").style.display = "none";
        }
    </script>
</body>
</html>