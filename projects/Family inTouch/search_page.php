<!DOCTYPE html>
<?php
    include('php/session.php');

?>
<html>
<head>
    <meta charset="utf-8" />
    <link href="css/teststyle.css" rel="stylesheet">
    <title>Search Page</title>
</head>
<body>
    <div class="search-body">
    <?php
        if ($_SERVER["REQUEST_METHOD"] == "GET") {
            $search = htmlspecialchars($_GET['search']);
            
            $result = $db->query('SELECT Username, CONCAT(Fname, " ", Lname) AS "FullName" FROM person WHERE Username LIKE "%'.$search.'%" ORDER BY Username');
            $num_results = $result->num_rows;
            if ($num_results == 0) {
                echo '<p class=sqlpara>No users found that matched "'.$search.'"';
            } else echo 'Number of results (Users): '.$num_results;
            
            for ($i=0; $i <$num_results; $i++) {     
                $row = $result->fetch_assoc();
                echo '<form class="product" action="othersProfile.php" method="get">';     
                echo '<p class="sqlpar"><strong>'.($i+1).'.  ';
                //Make each product clickable for redirect to their product page
                echo '<input type="hidden" name="username" value="'.($row['Username']).'">';
                echo '<input type="submit" class="link" name="friend_name" value="'.($row['Username']).'"/>';

                echo '</strong><br /> Name: ';  
                echo ($row['FullName']);     
                echo "</p>";  
                echo '</form>';
            }
            // Get list of groups that match search
            $result = $db->query('SELECT Group_name, Id FROM guild WHERE Group_name LIKE "%'.$search.'%" ORDER BY Group_name');
            $num_results = $result->num_rows;
            if ($num_results == 0) {
                echo '<p class=sqlpara>No groups found that matched "'.$search.'"';
            } else echo 'Number of results (Groups): '.$num_results;
            
            for ($i=0; $i <$num_results; $i++) {     
                $row = $result->fetch_assoc();
                echo '<form class="product" action="group.php" method="get">';     
                echo '<p class="sqlpar"><strong>'.($i+1).'.  ';
                //Make each product clickable for redirect to their product page
                echo '<input type="hidden" name="group_id" value="'.($row['Id']).'">';
                echo '<input type="submit" class="link" name="group_name" value="'.($row['Group_name']).'"/>';     
                echo "</p>";  
                echo '</form>';
            }
        }
    ?>
    </div>
    <script src="js/sidebar.js"></script>
</body>
</html>