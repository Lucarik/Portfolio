<!DOCTYPE html>
<?php
    include('php/session.php');

    $current_user = $user_check;
    // Get id
    $ses_sql = mysqli_query($db,"select Id from person where Username = '$current_user' ");
    
    $row = mysqli_fetch_array($ses_sql,MYSQLI_ASSOC);
    
    $current_user_id = $row['Id'];

    // Get number of pending group requests
    $result = $db->query("SELECT Id FROM person AS p JOIN pending_groups AS g ON p.Id = g.User_id 
            WHERE g.User_id = '$current_user_id';");
    $num_results = $result->num_rows;
    $pending_requests = $num_results;

?>
<html>
<head>
    <meta charset="utf-8" />
    <link href="css/teststyle.css" rel="stylesheet">
    <title>Groups Page</title>
</head>
<body>
    <div class="search-body">
        <ul class="top-bar">
            <li><button class="No-border" id="groups">Groups</button></li>
            <li><button class="No-border" id="crgroup">Create Group</button></li>
            <li><button class="No-border" id="grrequests">Pending Invites(<?php echo $pending_requests?>)</button></li>
        </ul>
        <div class="list-content sqlList">
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
                echo '<form method="get" action="group.php">';
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
        <div class="list-content newgr">
        
            <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
            <div class="group-request padding">
                <input type="text" class="text-input form-input" placeholder="Enter group name" name="grname">
                <input type="submit" class="formbtn" name="creategr" value="Create group">
            </div>
            </form>
        
        </div>
        <div class="list-content requests">
        <?php
            // Display friend request list
            $result = $db->query("SELECT g.Id, Group_name FROM guild AS g JOIN pending_groups AS p ON g.Id = p.Group_id 
            WHERE p.User_id = '$current_user_id';");
            $num_results = $result->num_rows;
            $pending_requests = $num_results;
            if ($num_results == 0) {
                echo '<p class=sqlpara>No pending group invites';
            } //else echo 'Number of results: '.$num_results;
            for ($i=0; $i <$num_results; $i++) {     
                $row = $result->fetch_assoc();
                echo '<form method="get" action="">';
                echo '<div class="friend-request">';
                //echo '<span class="profile-username usern">'.($row['Username']).'</span>';
                echo '<input type="hidden" name="username" value="'.($row['Group_name']).'">';
                echo '<input type="submit" formaction="group.php" class="link" id="profile-username" name="group_name" value="'.($row['Group_name']).'">';
                //echo '<span class="profile-name nam">( '.($row['FullName']).' )</span>';
                echo '<input type="hidden" name="group_id" value="'.($row['Id']).'">';
                echo '<input type="submit" class="fr_btn left_fr" name="gr_request" value="Accept">';
                echo '<input type="submit" class="fr_btn right_fr" name="gr_request" value="Reject">';
                echo '</div>';
                echo '</form>';
            }
        ?>
        </div>
    </div>
    <?php
    // Accept or reject group request
        if ((isset($_GET['gr_request']))) {
            $pending_id = htmlspecialchars($_GET['group_id']);
            $request = htmlspecialchars($_GET['gr_request']);
            if ($request == 'Accept') {
                // Add user to group
                $result = $db->query("INSERT INTO group_users (Group_id, Person_id) VALUES ('$pending_id','$current_user_id')");
                // Remove from pending requests
                $result = $db->query("DELETE FROM pending_groups WHERE Group_id = '$pending_id' AND User_id = '$current_user_id'");

            } else if ($request == 'Reject') {
                // Remove from pending requests
                $result = $db->query("DELETE FROM pending_groups WHERE Group_id = '$pending_id' AND User_id = '$current_user_id'");
            }
            unset($_GET['gr_request'] );
            header("location:group_page.php");
        }
    ?>
    <?php
        // Handles form for creating a group
        if ((isset($_POST['creategr']))) {
            $grname = test_input($_POST["grname"]);
            //echo $grname;
            if (!empty($grname)) {
                // Create group
                $result = $db->query("INSERT INTO guild (Group_name, image_link) VALUES ('".$grname."','group.png')");

                // Get group id
                $ses_sql = mysqli_query($db,"select Id from guild where Group_name = '$grname' ");
                $row = mysqli_fetch_array($ses_sql,MYSQLI_ASSOC);
                $current_group_id = $row['Id'];

                // Add user to group
                $result = $db->query("INSERT INTO group_users (Group_id, Person_id) VALUES ('$current_group_id', '$current_user_id')");

            } else {
                // No group name
                echo 'Please enter a group name'; 
            }
            unset($_POST['creategr'] );
            header("location:group_page.php");
        }

        function test_input($data) {
            $data = trim($data);
            $data = stripslashes($data);
            $data = htmlspecialchars($data);
            return $data;
        }
    ?>
    
    <script src="js/sidebar.js"></script>
    <script type="text/javascript">
        var ul = document.querySelector(".top-bar");
        document.querySelector(".requests").style.display = "none";
        // Click event for top bar, display or hide friend list and friend request list
        ul.addEventListener('click', (event) => {
            if (event.target.tagName == 'BUTTON') {
                if (event.target.id == 'groups') {
                    document.querySelector(".requests").style.display = "none";
                    document.querySelector(".newgr").style.display = "none";
                    document.querySelector(".sqlList").style.display = "flex";
                }
                if (event.target.id == 'crgroup') {
                    document.querySelector(".sqlList").style.display = "none";
                    document.querySelector(".requests").style.display = "none";
                    document.querySelector(".newgr").style.display = "flex";
                }
                if (event.target.id == 'grrequests') {
                    document.querySelector(".sqlList").style.display = "none";
                    document.querySelector(".newgr").style.display = "none";
                    document.querySelector(".requests").style.display = "flex";
                }
               
            }
        });
    </script>
</body>
</html>