
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
window.onscroll = function() {stickyHeader()};
        
var header = document.getElementById("header-nav");
var sticky = header.offsetTop;

function stickyHeader() {
    if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
    } else {
    header.classList.remove("sticky");
    }
}

// Script for copy to clipboard
const copyBtns = document.getElementsByClassName("link-btn");
for (const btn of copyBtns) { 
    btn.onclick = function() {copyToClipboard(btn)};
    btn.onmouseout = function() {resetToolTip(btn)};
};
function copyToClipboard(btn) {
    var pNode = btn.parentNode;
    var tooltip = pNode.firstChild;
    tooltip.innerHTML = "Copied: " + btn.innerText;
}
function resetToolTip(btn) {
    var pNode = btn.parentNode;
    var tooltip = pNode.firstChild;
    tooltip.innerHTML = "Copy to clipboard";
}