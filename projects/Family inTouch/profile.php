<!DOCTYPE html>
<?php
    include('php/session.php');

    //echo $user_check;
    $user = $login_session;
    
    // Get image
    $ses_sql = mysqli_query($db,"select image_link from person where Username = '$user' ");
    
    $row = mysqli_fetch_array($ses_sql,MYSQLI_ASSOC);
    
    $image_link = $row['image_link'];
    $image_path = "images/$image_link";
   
    // Get user Id
    $ses_sql = mysqli_query($db,"select Id from person where Username = '$user' ");
    
    $row = mysqli_fetch_array($ses_sql,MYSQLI_ASSOC);
    
    $user_id = $row['Id'];

    // Get full name
    $query = "SELECT CONCAT(Fname, ' ', Lname) AS 'FullName' FROM person WHERE Username = '$user' ";
    $result = $db->query($query);
    while ($row = $result->fetch_assoc()) {
        $name = stripslashes($row['FullName']);
    }
    $result->free();
?>
<html>
<head>
    <meta charset="utf-8" />
    <link href="css/teststyle.css" rel="stylesheet">
    <title>Profile</title>
</head>
<body>
    <div class="profile-body">
        <div class="profile-left" style="margin:auto;text-align: center;">
            <h1 class="pTitle">Profile</h1>
            <img src="<?php echo $image_path;?>" alt="Profile Picture" class="p_image">
            <h3><?php echo $name;?></h3>
            <form class="message-form" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" method="post">
            <textarea class="group-input" rows="3" cols="50" name="pmesg" placeholder="Edit personal message here"></textarea>
                <button type="submit" class="message-button" type="submit" id="pmesgB" name="pmesgB">Confirm</button>
            </form>
            <div class="change-photo">
            <p>Change profile picture</p>
            <form enctype="multipart/form-data" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" method="POST">
                <input type="hidden" name="MAX_FILE_SIZE" value="512000" />
                <input style="margin:auto; margin-left: 250px;margin-bottom: 5px;" name="userfile" type="file" accept="image/*">
                <input style="margin:auto; width: 10rem; padding: 5px;" type="submit" class="chat-button" name="image_submit" value="Submit" />
            </form>
            </div>
        </div>
        <div class="profile-right">
            <h1 class="pTitle">Messages Received</h1>
            <div class="profile-right-message-container">
            <?php
                $result = $db->query("SELECT m.Message_id, m.Sent_from_username, m.Subject, m.MessageContent, m.Date_made FROM messages AS m 
                JOIN person AS p ON p.Id = m.Sent_to WHERE p.id = '$user_id' ORDER BY Date_made ASC LIMIT 10;");
                $num_results = $result->num_rows;
            
                if ($num_results == 0) {
                    echo '<p class=sqlpara>No messages received';
                } //else echo 'Number of results: '.$num_results;
                for ($i=0; $i <$num_results; $i++) {     
                    $row = $result->fetch_assoc();
                    echo '<form action="" method="get">';
                    echo '<input type="hidden" name="username" value="'.($row['Sent_from_username']).'">';
                    echo '<input type="hidden" name="subject" value="'.($row['Subject']).'">';
                    echo '<input type="hidden" name="content" value="'.($row['MessageContent']).'">';
                    echo '<input type="hidden" name="sent" value="true">';
                    echo '<span class="group-post" style="max-height: 102px; height: 100%;">';
                    echo '<span class="group-text-content" style="width: 75%;">';
                    echo '<p class="group-chat-username">From: '.($row['Sent_from_username']).'</p>';
                    echo '<p class="chat-content" style="margin-bottom: 0;" >Subject: '.($row['Subject']).'</p>';
                    echo '<p class="chat-content wordwrap">Content: '.($row['MessageContent']).'</p>';
                    echo '<button class="link" type="submit" id="viewB" style="margin: 0; background: rgba(255, 255, 255, 0.6);" name="viewB">View</button>';
                    echo '</span>';
                    echo '<span class="group-timestamp">';
                    
                    echo '</form>';
            
                    // Edit date format
                    $date_raw = $row['Date_made'];
                    $iTimestamp = strtotime($date_raw); 
                    $date = date("M. jS, H:i", $iTimestamp);
            
                    echo '<p class="timestamp">'.$date.'</p>';
                    echo '</span>';
                    echo '</span>';
                }
            
            ?>
            </div>
        </div>
    </div>

    <?php
        // Gets content of view button
        if ((isset($_GET['viewB']))) {
            $username = htmlspecialchars($_GET['username']);
            $subject = htmlspecialchars($_GET['subject']);
            $content = htmlspecialchars($_GET['content']);
            $sent = htmlspecialchars($_GET['sent']);
        }
    ?>
    <div id="mes" class="message-block">
            <div class="message-body" style="border: 1px solid lightgrey;">
                <form id="mesgform" class="pMessage" method="get" action="">
                    <p id="name" style="margin-left: 15px; padding-bottom: 0; margin-bottom: 0;">From: </p>
                    <p id="subject" style="margin-left: 15px; padding-bottom: 0; margin-bottom: 0; ">Subject: </p>
                    <input type="hidden" id="subject" name="subject" value="<?php echo "Re:" . $subject;?>">
                    <p style="margin-left: 15px; padding-bottom: 0; margin-bottom: 0; ">Content: </p>
                    <p id="content" style="margin-left: 15px; margin-top: 3px; padding-bottom: 0; margin-bottom: 0; ">Content: </p>
                    <button type="button" class="link" style="width: 4.5rem; margin-top: 20px; margin-bottom: 10px;"id="replyB" name="replyB">Reply</button>
                    <span id="reply" style="padding: 10px 0; display: none; border-top: 1px solid gray; margin-left: 15px; margin-top: 10px; width: 90%;" >
                        <textarea style="margin-left: 0; resize:none; width: 100%;" class="group-input" maxlength="150" rows="4" cols="50" name="mesg" placeholder="Edit message here"></textarea>
                        <!--<input style="margin-left: 0;" class="group-input" type="text" id="mesg" name="mesg" placeholder="Enter reply">-->
                    </span>
                    <p id="mSent" style="margin: auto;"></p>
                    <span id="btnspan" style="display: none; flex-direction: row; margin-right: 5px; padding-top: 2rem; padding-bottom: 1rem;">
                        <button class="chat-button" style="background: lightcoral; width: 5rem;"id="cancelB" name="cancelB">Cancel</button>
                        <button class="chat-button wordwrap" style="background: lightgreen; width: 5rem;" type="submit" id="cMessage" name="cMessage">Confirm</button>
                    
                    </span>
                </form>
            </div>
    </div>

    <?php

        if ((isset($_POST['image_submit']))) {
            $uploaddir = 'images/';
            $uploadfile = $uploaddir . basename($_FILES['userfile']['name']);

            echo "<p>";

            if (move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadfile)) {
                //echo "File is valid, and was successfully uploaded.\n";
                $image_name = basename($_FILES['userfile']['name']);

                $result = $db->query("UPDATE person SET image_link = '$image_name' WHERE Id = '$user_id'");
                header("Refresh:0");
            } else {
                //echo "Upload failed";
            }

            //echo "</p>";
            //echo '<pre>';
            //echo 'Here is some more debugging info:';
            //print_r($_FILES);
            //print "</pre>";
        }
    ?>
    <?php

        if ((isset($_POST['pmesgB']))) {
            $pmesg = test_input($_POST['pmesg']);
            $result = $db->query('UPDATE person SET Pmessage = "'.$pmesg.'" WHERE Id = "'.$user_id.'"');

        }
?>

<?php

        // Get user Id
        
        // Send message
        date_default_timezone_set("EST");

        $sDate = date("Y-m-d H:i:s");
        if ((isset($_GET['cMessage']))) {
            //$msubject = "Re:" . $subject;
            $msubject = test_input($_GET["subject"]);
            
            if (!isset($_GET['mesg'])) {
                $message = "Message not set.";
            }
            $message = "No message set";
            if (isset($_GET['mesg'])) {
                $message = test_input($_GET["mesg"]);
            }
            $ses_sql = mysqli_query($db,"select Id from person where Username = '$username' ");
        
            $row = mysqli_fetch_array($ses_sql,MYSQLI_ASSOC);
        
            $otheruser_id = $row['Id'];
            /*
            if ($message) {
                $result = $db->query('INSERT INTO messages (Sent_from, Sent_to, MessageContent, Subject, Date_made, Sent_to_username) VALUES ("'.$user_id.'","'.$otheruser_id.'", 
                "'.$message.'", "'.$msubject.'", "'.$sDate.'", "'.$username.'" )');
            }*/
            header("Refresh:0");
        }

        function test_input($data) {
            $data = trim($data);
            $data = stripslashes($data);
            $data = htmlspecialchars($data);
            return $data;
        }
    ?>
    

<script type="text/javascript">
        //Script to show message body
        document.querySelector(".message-block").style.display = "flex";

        var uname = <?php echo json_encode($username);?>;
        var subj = <?php echo json_encode($subject);?>;
        var cont = <?php echo json_encode($content);?>;
        var messageB = document.querySelector("#viewB");
        
        var name = document.querySelector("#name");
        var subject = document.querySelector("#subject");
        var content = document.querySelector("#content");
        document.querySelector("#name").innerHTML= "From: " + uname;
        subject.innerHTML = "Subject: " + subj;
        content.innerHTML = cont;
        messageB.addEventListener('click', (event) => {
            document.querySelector(".message-block").style.display = "none";
        });

        document.querySelector(".message-block").addEventListener('click', (event) => {
            if (event.target.id == 'mes') {
                document.querySelector(".message-block").style.display = "none";
            }
        });

        document.querySelector("#replyB").addEventListener('click', (event) => {
            document.querySelector("#reply").style.display = "flex";
            document.querySelector("#btnspan").style.display = "flex";
            
        });
        document.querySelector("#cMessage").addEventListener('click', (event) => {
            document.querySelector("#reply").innerHTML = "Reply Sent";
            
        });

</script>
    <script src="js/sidebar.js"></script>

</body>
</html>