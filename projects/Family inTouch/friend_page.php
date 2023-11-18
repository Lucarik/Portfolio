<!DOCTYPE html>
<?php
    include('php/session.php');

    $current_user = $user_check;
    // Get id
    $ses_sql = mysqli_query($db,"select Id from person where Username = '$current_user' ");
    
    $row = mysqli_fetch_array($ses_sql,MYSQLI_ASSOC);
    
    $current_user_id = $row['Id'];

    // Get number of pending friend requests
    $result = $db->query("SELECT Id, Username, CONCAT(Fname, ' ', Lname) AS FullName FROM person AS p JOIN pending_friends AS f ON p.Id = f.Requester_id 
            WHERE f.Requestee_id = '$current_user_id';");
    $num_results = $result->num_rows;
    $pending_requests = $num_results;

?>
<html>
<head>
    <meta charset="utf-8" />
    <link href="css/teststyle.css" rel="stylesheet">
    <title>Friends Page</title>
</head>
<body>
    <div class="search-body">
        <ul class="top-bar">
            <li><button class="No-border" id="friends">Friends</button></li>
            <li><button class="No-border" id="frrequests">Friend Requests(<?php echo $pending_requests?>)</button></li>
        </ul>
        <div class="list-content sqlList">
        <?php
            // Display friend list
            $result = $db->query("SELECT Username, CONCAT(Fname, ' ', Lname) AS 'FullName', image_link FROM person AS p JOIN friends AS f ON p.Id = f.Friend_id 
            WHERE f.User_id = '$current_user_id'; ");
            $num_results = $result->num_rows;

            if ($num_results == 0) {
                echo '<p class=sqlpara>No friends';
            } //else echo 'Number of results: '.$num_results;
            for ($i=0; $i <$num_results; $i++) {     
                $row = $result->fetch_assoc();
                echo '<form method="get" action="othersProfile.php">';
                echo '<div class="form-profile container">';
                echo '<img src="images/'.($row['image_link']).'" alt="Friend Picture" class="profile-image item item2">';
                echo '<span class="profile-username item item3">'.($row['Username']).'</span>';
                echo '<span class="profile-name item item4">'.($row['FullName']).'</span>';
                echo '<input type="hidden" name="username" value="'.($row['Username']).'">';
                echo '<input type="submit" class="item item1" name="friend_name" value="'.($row['Username']).'">';
                echo '</div>';
                echo '</form>';
            }
        ?>
        <!--
        <form method="get" action="">
            <div class="form-profile container">
                <img src="images/default-user-icon.jpg" alt="Friend Picture" class="profile-image item item2">
                <span class="profile-username item item3">Charte</span>
                <span class="profile-name item item4">Charlotte Robinson</span>
                <input type="hidden" name="username" value="username">
                <input type="submit" class="item item1" name="friend" value="username">
            </div>
        </form>-->
        </div>
        <div class="list-content requests">
        <?php
            // Display friend request list
            $result = $db->query("SELECT Id, Username, CONCAT(Fname, ' ', Lname) AS FullName FROM person AS p JOIN pending_friends AS f ON p.Id = f.Requester_id 
            WHERE f.Requestee_id = '$current_user_id';");
            $num_results = $result->num_rows;
            $pending_requests = $num_results;
            if ($num_results == 0) {
                echo '<p class=sqlpara>No pending friend requests';
            } //else echo 'Number of results: '.$num_results;
            for ($i=0; $i <$num_results; $i++) {     
                $row = $result->fetch_assoc();
                echo '<form method="get" action="">';
                echo '<div class="friend-request">';
                //echo '<span class="profile-username usern">'.($row['Username']).'</span>';
                echo '<input type="hidden" name="username" value="'.($row['Username']).'">';
                echo '<input type="submit" formaction="othersProfile.php" class="link" id="profile-username" name="friend_name" value="'.($row['Username']).'">';
                echo '<span class="profile-name nam">( '.($row['FullName']).' )</span>';
                echo '<input type="hidden" name="friend_id" value="'.($row['Id']).'">';
                echo '<input type="submit" class="fr_btn left_fr" name="fr_request" value="Accept">';
                echo '<input type="submit" class="fr_btn right_fr" name="fr_request" value="Reject">';
                echo '</div>';
                echo '</form>';
            }
        ?><!--
        <form method="get" action="">
            <div class="friend-request">
                <span class="profile-username usern">Charte</span>
                <span class="profile-name nam">( Charlotte Robinson )</span>
                <input type="hidden" name="friend_username" value="friend_username">
                <input type="submit" class="fr_btn left_fr" name="fr_request" value="Accept">
                <input type="submit" class="fr_btn right_fr" name="fr_request" value="Reject">
            </div>
        </form>-->
        </div>
    </div>
    <?php
    // Accept or reject friend request
        if ((isset($_GET['fr_request']))) {
            $pending_id = htmlspecialchars($_GET['friend_id']);
            $request = htmlspecialchars($_GET['fr_request']);
            if ($request == 'Accept') {
                // Add friends both sides
                $result = $db->query("INSERT INTO friends (User_id, Friend_id) VALUES ('$current_user_id','$pending_id')");
                $result = $db->query("INSERT INTO friends (User_id, Friend_id) VALUES ('$pending_id','$current_user_id')");
                // Remove from pending requests
                $result = $db->query("DELETE FROM pending_friends WHERE Requester_id = '$pending_id' AND Requestee_id = '$current_user_id'");

            } else if ($request == 'Reject') {
                // Remove from pending requests
                $result = $db->query("DELETE FROM pending_friends WHERE Requester_id = '$pending_id' AND Requestee_id = '$current_user_id'");
            }
            header("location:friend_page.php");
        }
    ?>
    
    <script src="js/sidebar.js"></script>
    <script type="text/javascript">
        var ul = document.querySelector(".top-bar");
        document.querySelector(".requests").style.display = "none";
        // Click event for top bar, display or hide friend list and friend request list
        ul.addEventListener('click', (event) => {
            if (event.target.tagName == 'BUTTON') {
                if (event.target.id == 'friends') {
                    document.querySelector(".requests").style.display = "none";
                    document.querySelector(".sqlList").style.display = "flex";
                }
                if (event.target.id == 'frrequests') {
                    document.querySelector(".sqlList").style.display = "none";
                    document.querySelector(".requests").style.display = "flex";
                }
            }
        });
    </script>
</body>
</html>