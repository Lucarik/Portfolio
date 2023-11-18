<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <link href="css/teststyle.css" rel="stylesheet">
    <title>Family inTouch Test</title>
</head>
<body class="decal">
    <h1 class="floating-title">Family inTouch</h1>
    <div class="content">
        <div class="login">
            <h1 class="title">Test</h1>
            <a href="register.php">Register here</a>
        </div>
    </div>

    <?php

// Get user Id

// Send message
date_default_timezone_set("EST");

$sDate = date("Y-m-d H:i:s");
if ((isset($_POST['cMessage']))) {
    //$msubject = "Re:" . $subject;
    $msubject = test_input($_POST["subject"]);
    echo $msubject;
    if (empty($_POST["messag"])) {
        echo "Empty";
    }
    $message = test_input($_POST["message"]);
    $ses_sql = mysqli_query($db,"select Id from person where Username = '$username' ");

    $row = mysqli_fetch_array($ses_sql,MYSQLI_ASSOC);

    $otheruser_id = $row['Id'];

    if ($message) {
        $result = $db->query('INSERT INTO messages (Sent_from, Sent_to, MessageContent, Subject, Date_made, Sent_to_username) VALUES ("'.$user_id.'","'.$otheruser_id.'", 
        "'.$message.'", "'.$msubject.'", "'.$sDate.'", "'.$username.'" )');
    }
    header("Refresh:0");
}

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
?>
</body>
</html>