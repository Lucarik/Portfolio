
// Adds and removes 'show' and 'hidden' classes to achieve
// animation effect through css transitions and transfomations
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});
const hiddenEl = document.querySelectorAll('.hidden');
hiddenEl.forEach((el) => observer.observe(el));

// Shows contact links after contact button is clicked
var contactButton = document.getElementById("contact-button");
contactButton.onclick = function() {
    document.getElementById("contact-list").style.display = "inline";
    contactButton.style.display = "none";
}

// Script for sticky header
window.onscroll = function() {myFunction()};
        
var header = document.getElementById("header-nav");
var sticky = header.offsetTop;

function myFunction() {
    if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
    } else {
    header.classList.remove("sticky");
    }
}