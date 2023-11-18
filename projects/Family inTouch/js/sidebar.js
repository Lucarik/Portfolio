var body = document.querySelector('body')

var mainDiv = document.createElement('div');
mainDiv.id = "main";
// Div objects
var menubtn = document.createElement('button');
menubtn.classList.add("openbtn");
menubtn.innerHTML = "&#9776;";
menubtn.id = "menubtn";
mainDiv.appendChild(menubtn);

var sideDiv = document.createElement('div');
sideDiv.classList.add("sidebar");
sideDiv.id = "mySidebar";

// Populating sidebar

//Search bar
var form = document.createElement('form');
form.classList.add("search-form");
form.action = "search_page.php";
form.method = "GET";

var span = document.createElement('span');

var input = document.createElement('input');
input.type = "text";
input.id = "search";
input.name = "search";
input.placeholder = "Search here";
span.appendChild(input);

var btn = document.createElement('button');
btn.classList.add("search-button");
btn.type = "submit";
btn.id = "searchB";
btn.name = "searchB";
btn.innerHTML = "&#9906;";
span.appendChild(btn);

form.appendChild(span);
sideDiv.appendChild(form);

// Creating links
var a1 = document.createElement('a');
a1.href="profile.php";
a1.textContent="Profile";
sideDiv.appendChild(a1);
var a2 = document.createElement('a');
a2.href="group_page.php";
a2.textContent="Groups";
sideDiv.appendChild(a2);
var a3 = document.createElement('a');
a3.href="friend_page.php";
a3.textContent="Friends";
sideDiv.appendChild(a3);
var a4 = document.createElement('a');
a4.href="php/logout.php";
a4.textContent="Logout";
a4.classList.add("last-menu-item");
sideDiv.appendChild(a4);

mainDiv.appendChild(sideDiv);

body.appendChild(mainDiv);

var btn = document.getElementById("menubtn");
    btn.addEventListener('click', (event) => {
        if (btn.classList.contains("openbtn")) {
            document.getElementById("mySidebar").style.width = "250px";
            document.getElementById("main").style.marginLeft = "250px";
            btn.classList.remove("openbtn");
            btn.classList.add("closebtn");
        } else {
            document.getElementById("mySidebar").style.width = "0";
            document.getElementById("main").style.marginLeft = "0";
            btn.classList.remove("closebtn");
            btn.classList.add("openbtn");
        }
});
