<?php
    include('php/session.php');

    //echo $user_check;
    $current_user = $login_session;

    if ((isset($_GET['group_name']))) {
        $group = htmlspecialchars($_GET['group_id']);
        $_SESSION['group_id'] = $group;
    }
    $group_id = $_SESSION['group_id'];
    // Get user id
    $ses_sql = mysqli_query($db,"select Id from person where Username = '$current_user' ");
    
    $row = mysqli_fetch_array($ses_sql,MYSQLI_ASSOC);
    
    $current_user_id = $row['Id'];

    // Get group name
    $ses_sql = mysqli_query($db,"select Group_name from guild where Id = '$group_id' ");
    
    $row = mysqli_fetch_array($ses_sql,MYSQLI_ASSOC);
    
    $group_name = $row['Group_name'];
    // Get image
    $ses_sql = mysqli_query($db,"select image_link from guild where Id = '$group_id' ");
    
    $row = mysqli_fetch_array($ses_sql,MYSQLI_ASSOC);
    
    $image_link = $row['image_link'];
    $image_path = "images/groups/$image_link";

    // Check if in group
    $result = $db->query("SELECT Id FROM group_users WHERE Person_id = '$current_user_id' AND Group_id = '$group_id'");
    $num_results = $result->num_rows;
    $friends = false;
    if ($num_results == 1) {
        $inGroup = true;
        json_encode($inGroup);
    } else {
        $inGroup = false;
        json_encode($inGroup);
    }
?>
<html>
<head>
    <meta charset="utf-8" />
    <link href="css/teststyle.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <title>Group Page</title>
</head>
<body>
    
    <div class="profile-body">
        <div style="background:white" class="message-block">
        <div style="margin:auto;display: flex; flex-direction:column">
            <img style="width: 400px;" class="group-profilepic" src="<?php echo $image_path;?>" alt="Group Picture">
            <h3 style="margin:auto;"><?php echo $group_name;?></h3>
            <p style="margin:auto; margin-top: 15px;">You are not a member of this group. To join ask for an invitation from a group member.</p>
        </div>
    </div>
        <div class="group-left">
            <div class="group-left-container">
                <div class="group-left-message-container">
                <!--
                    <span class="group-post">
                        <img src="images/user.png" class="group-chat-picture" alt="Profile Picture">
                        <span class="group-text-content">
                        <p class="group-chat-username">Qwerty</p>
                        <p class="chat-content">Hi guys, this is Qwerty. Nice meeting you all.
                            Right now I'm testing the line drop after the 150 character limit. Done.
                        </p>
                        </span>
                        <span class="group-timestamp">
                        <p class="timestamp">Apr. 4, 09:45</p>
                        </span>
                    </span>
                -->
                </div>
            
                <form class="message-form" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" method="post">
                <textarea style="resize:none;" class="group-input" maxlength="150" rows="1" cols="50" name="message" placeholder="Edit message here (Max 150 characters)"></textarea>
                    <button class="chat-button" type="submit" id="confirmB" name="confirmB">Confirm</button>
                </form>
            </div>
        </div>
        <div class="group-right">
            <div class="group-right-container">
                <h1 style="margin-top: 5px; padding: 0; margin-bottom: 0;" class="pTitle"><?php echo $group_name;?></h1>
                <img style="margin-top: 5px;" class="group-profilepic" src="<?php echo $image_path;?>" alt="Group Picture">
                <form style="margin-bottom: 35px;" action="" method="post">
                    <input type="submit" name="leavegr" value="Leave group" id="leavegrB" class="chat-button" style="margin: auto;width: 90%; height: 3rem;">
            </form>
            </div>
            
        </div>
        
    </div>

    <?php

    /* Query to get most recent messages from current group
SELECT p.image_link, p.Username, c.message, c.date_made FROM group_chat AS c 
JOIN person AS p ON p.Id = c.User_id JOIN guild AS g ON g.Id = c.Group_id WHERE g.id = 2 ORDER BY date_made LIMIT 30;
    */
    date_default_timezone_set("EST");
    // Send friend request
    //echo date("M. jS, H:i");
    $sDate = date("Y-m-d H:i:s");
    if ((isset($_POST['confirmB']))) {
        $message = htmlspecialchars($_POST['message']);
        if ($message) {
            $result = $db->query('INSERT INTO group_chat (User_id, Group_id, message, date_made) VALUES ("'.$current_user_id.'","'.$group_id.'", 
            "'.$message.'", "'.$sDate.'" )');
        }

        
    }$ses_sql = mysqli_query($db,"SELECT * FROM group_chat ");
    
        $row = mysqli_fetch_array($ses_sql,MYSQLI_ASSOC);
    
        $date_raw = $row['date_made'];
        //echo $date_raw;
        $iTimestamp = strtotime($date_raw); 
        $date = date("M. jS, H:i", $iTimestamp);
        $hi = '<p>Hi</p>';

        $data[] = [
            'image_link' => "hi",
            'Username' => "user",
            'message' => "mesg",
            'date_made' => "date"
        ];
        $m = array_column($data, 'message');
        //print_r($m);
    ?>

<?php
    // Leave group
        if ((isset($_POST['leavegr']))) {
            
            $result = $db->query("DELETE FROM group_users WHERE Group_id = '$group_id' AND Person_id = '$current_user_id'");

            unset($_GET['leavegr'] );
            header("Refresh:0");
        }
    ?>

    <script src="js/sidebar.js"></script>

    <script type="text/javascript">
        // If user not in group display overlay
        var ingr = <?php echo json_encode($inGroup);?>;
        if (!ingr) {
            document.querySelector(".message-block").style.display = "flex";
        }
    </script>
    <script type="text/javascript">
        /* use jQuery for this to refresh every 30 seconds( Called polling )
        var $scores = $("#scores");
        setInterval(function () {
            $scores.load("index.php #scores");
        }, 30000);
        */
        var autoLoad = setInterval(
        function ()
        {
            $('.group-left-message-container').load('php/chat.php');
        }, 1000)
        // Attempt to use Server side events
        var messageDiv = document.querySelector(".group-left-message-container");
        var json = '{"result":true, "count":42}';
        var obj = JSON.parse(json);

        /* Display chat messages
        $.get('php/chat.php', function(data) {
            $('.group-left-message-container').append(data);
        }); 
        // Create eventsource
        
        var evtSource = new EventSource('php/sse.php');

        evtSource.onopen = function() {
            //$.get('php/chat.php', function(data) {
                //$('.group-left-message-container').append(data);
            //});
        }

        evtSource.onmessage = function(e) {
            var data = JSON.parse(e.data);
            var lbl = document.createElement('label');
            /*
            var fk = data.keys();

            for (x of fk) {
                lbl.innerHTML += x + "<br>";
            } 
            lbl.innerHTML = data[1];
            $('.group-left-message-container').append(lbl);
        }

        evtSource.onerror = function() {
            console.log("EventSource failed.");
        }*/

    </script>

</body>
</html>