<?php
    include('php/session.php');

    //echo $user_check;
    $current_user = $login_session;

    if ((isset($_GET['friend_name']))) {
        $search = htmlspecialchars($_GET['username']);
        $_SESSION['friend_username'] = $search;
    }
    $user = $_SESSION['friend_username'];

    // Get id
    $ses_sql = mysqli_query($db,"select Id from person where Username = '$current_user' ");
    
    $row = mysqli_fetch_array($ses_sql,MYSQLI_ASSOC);
    
    $current_user_id = $row['Id'];

    $ses_sql = mysqli_query($db,"select Id from person where Username = '$user' ");
    
    $row = mysqli_fetch_array($ses_sql,MYSQLI_ASSOC);
    
    $user_id = $row['Id'];
    // Get image
    $ses_sql = mysqli_query($db,"select image_link, Pmessage from person where Username = '$user' ");
    
    $row = mysqli_fetch_array($ses_sql,MYSQLI_ASSOC);
    
    $image_link = $row['image_link'];
    $image_path = "images/$image_link";

    $pmessage = $row['Pmessage'];
   
    // Get full name
    $query = "SELECT CONCAT(Fname, ' ', Lname) AS 'FullName' FROM person WHERE Username = '$user' ";
    $result = $db->query($query);
    while ($row = $result->fetch_assoc()) {
        $name = stripslashes($row['FullName']);
    }
    $result->free();

    // Check if friend
    $result = $db->query("SELECT User_id FROM friends WHERE User_id = '$current_user_id' AND Friend_id = '$user_id'");
    $num_results = $result->num_rows;
    $friends = "fr";
    if ($num_results == 1) {
        //echo 'Is a friend';
        $friends = "friend";
        json_encode($friends);
        
    } else {
        //echo 'Not a friend';
        $friends = "Not friend";
        json_encode($friends);
    }
    // Check if pending friend
    $result = $db->query("SELECT Id, Username, CONCAT(Fname, ' ', Lname) AS FullName FROM person AS p JOIN pending_friends AS f ON p.Id = f.Requester_id 
    WHERE (f.Requestee_id = '$user_id' AND f.Requester_id = '$current_user_id') OR  (f.Requestee_id = '$current_user_id' AND f.Requester_id = '$user_id');");
    $num_results = $result->num_rows;
    $pending = false;
    //echo $pending;
    if ($num_results > 0) {
        $pending = "pending";
        json_encode($pending);
        //echo $pending;
    } else {
        $pending = "Not pending";
        json_encode($pending);
    }
?>
<html>
<head>
    <meta charset="utf-8" />
    <link href="css/teststyle.css" rel="stylesheet">
    <title>Profile</title>
</head>
<body>
        <div class="message-block">
            <div class="message-body" style="border:1px solid lightgrey;">
                <form class="pMessage" method="post" action="">
                    <p style="margin-left: 15px; padding-bottom: 0; margin-bottom: 0;">To: <?php echo $user;?></p>
                    <span style="display: flex; flex-direction: row; margin-left: 0; margin-top: 0; padding-top: 0; margin-bottom: 15px; padding-bottom: 0;">
                        <p style="padding-bottom: 0; margin-bottom: 0; ">Subject: </p>
                        <input style="padding-bottom: 0; margin-bottom: 0; margin-top: 8px; height: 28px;"type="text" class="form-input" id="mSubject" name="mSubject" placeholder="Enter subject">
                    </span>
                    <textarea style="margin-left: 15px;resize:none;"class="group-input" maxlength="150" rows="4" cols="50" name="message" placeholder="Edit message here"></textarea>
                    <span style="display: flex; flex-direction: row; margin-right: 5px; padding-top: 2rem; padding-bottom: 1rem;">
                    <button class="chat-button" style="background: lightcoral; width: 5rem;"id="cancelB" name="cancelB">Cancel</button>
                    <button class="chat-button wordwrap" style="background: lightgreen; width: 5rem;" type="submit" id="cMessage" name="cMessage">Confirm</button>
                    
                    </span>
                </form>
            </div>
        </div>
        <div class="group-block" id="group">
            <div class="group-invite-body">
            <p style="margin-left: 10px;">Select group to invite to:</p>
            <?php
            // Display group list
            $result = $db->query("SELECT g.Id, Group_name, image_link FROM guild AS g JOIN group_users AS u ON g.Id = u.Group_id 
            WHERE u.Person_id = '$current_user_id'; ");
            $num_results = $result->num_rows;

            if ($num_results == 0) {
                echo '<p class=sqlpara>No groups';
            } //else echo 'Number of results: '.$num_results;
            for ($i=0; $i <$num_results; $i++) {     
                $row = $result->fetch_assoc();
                echo '<form method="post" action="">';
                echo '<div class="form-profile-group container">';
                echo '<img src="images/groups/'.($row['image_link']).'" alt="Group Picture" class="profile-image item item2">';
                //echo '<span class="profile-username item item3">'.($row['Username']).'</span>';
                echo '<span class="profile-name item item4">'.($row['Group_name']).'</span>';
                echo '<input type="hidden" name="group_id" value="'.($row['Id']).'">';
                echo '<input type="submit" class="item item1" name="group_name" value="'.($row['Group_name']).'">';
                echo '</div>';
                echo '</form>';
            }
        ?>
            </div>
        </div>
    <div class="profile-body">
        
        <div class="profile-left" style="margin:auto;text-align: center;">
            <h1 class="pTitle">Profile</h1>
            <img src="<?php echo $image_path;?>" alt="Profile Picture" class="p_image">
            <h3><?php echo $name;?></h3>
            
                <button style="margin:auto; margin-bottom: 16px;"class="form-button profileB" id="messageB" name="messageB">Send Message</button>
            
            <form class="message-form sendfr"  action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" method="post">
                <button class="form-button profileB" style="margin:auto;" type="submit" id="frRequestB" name="frRequestB">Send Friend Request</button>
            </form>
            <form class="message-form removefr"  action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" method="post">
                <button class="form-button profileB" style="margin:auto;" type="submit" id="frRemoveB" name="frRemoveB">Remove Friend</button>
            </form>
            <button style="margin: auto;"class="form-button profileB" id="gInviteB" name="gInviteB">Invite to group</button>
            <!--
            <form class="message-form" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" method="post">
                <button class="form-button profileB" type="submit" id="gInviteB" name="gInviteB">Invite to Group</button>
            </form>-->
        </div>
        <div class="profile-right" style="text-align:center;">
            <h1 class="pTitle">Personal Message</h1>
            <p>"<?php echo $pmessage?>"</p>

        </div>
    </div>
    <?php
        // Send message
        date_default_timezone_set("EST");

        $sDate = date("Y-m-d H:i:s");
        if ((isset($_POST['cMessage']))) {
            $subject = test_input($_POST["mSubject"]);
            $message = test_input($_POST["message"]);
            if ($message) {
                $result = $db->query('INSERT INTO messages (Sent_from, Sent_to, MessageContent, Subject, Date_made, Sent_from_username) VALUES ("'.$current_user_id.'","'.$user_id.'", 
                "'.$message.'", "'.$subject.'", "'.$sDate.'", "'.$current_user.'" )');
            }
            //header("Refresh:0");
        }

        function test_input($data) {
            $data = trim($data);
            $data = stripslashes($data);
            $data = htmlspecialchars($data);
            return $data;
        }
    ?>
    <?php
    // Send friend request
    if ((isset($_POST['frRequestB']))) {
        $result = $db->query("INSERT INTO pending_friends (Requester_id, Requestee_id) VALUES ('$current_user_id','$user_id')");
        header("Refresh:0");
    }

    ?>

    <?php
    // Remove friend
    if ((isset($_POST['frRemoveB']))) {
        $result = $db->query("DELETE FROM friends WHERE User_id = '$user_id' AND Friend_id = '$current_user_id'");
        $result = $db->query("DELETE FROM friends WHERE User_id = '$current_user_id' AND Friend_id = '$user_id'");
        header("Refresh:0");
    }
    
    ?>
    <?php
    // Invite to group button pressed and group selected
        if ((isset($_POST['group_name']))) {
            $group_id = htmlspecialchars($_POST['group_id']);
            $group_name = htmlspecialchars($_POST['group_name']);
            $result = $db->query("SELECT Group_id FROM pending_groups WHERE Group_id = '$group_id' AND User_id = '$user_id' UNION SELECT g.Group_id FROM group_users AS g
            WHERE g.Group_id = '$group_id' AND g.Person_id = '$user_id';");
            $num_results = $result->num_rows;
        
            if ($num_results > 0) {
                echo '<p class=sqlpara>This person is already either in or pending to join this group</p>';
            }
             else {$result = $db->query("INSERT INTO pending_groups (Group_id, User_id) VALUES ('$group_id','$user_id')");
                header("Refresh:0");
             }
        }
    ?>
    <script type="text/javascript">
        //Script to show message body or group invite body
        var messageB = document.querySelector("#messageB");
        var gInviteB = document.querySelector("#gInviteB");
        var gDiv = document.querySelector(".group-block");
        var cancelB = document.querySelector("#cancelB");
        messageB.addEventListener('click', (event) => {
            document.querySelector(".message-block").style.display = "flex";
        });
        
        cancelB.addEventListener('click', (event) => {
            document.querySelector(".message-block").style.display = "none";
        });
        gInviteB.addEventListener('click', (event) => {
            document.querySelector(".group-block").style.display = "flex";
        });
        gDiv.addEventListener('click', (event) => {
            if (event.target.id == 'group') {
            document.querySelector(".group-block").style.display = "none";
            }
        });
    </script>
    <script src="js/sidebar.js"></script>
    <script type="text/javascript">
        // Script to check if friend or not, show friend request button or 
        // remove friend button
        var friends = <?php echo json_encode($friends);?>;
        var pending = <?php echo json_encode($pending);?>;
        var fform = document.querySelector(".sendfr");
        var rform = document.querySelector(".removefr");
        
        if (friends == "friend") {
            fform.style.display = "none";
            rform.style.display = "flex";
        }
        if (pending == "pending") {
            document.querySelector("#frRequestB").disabled = true;
            document.querySelector("#frRequestB").innerHTML = "Friend Request Pending";
        }
    </script>

</body>
</html>