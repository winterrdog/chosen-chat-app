document.querySelector('.submit-div > input').focus();

let submitButton = document.querySelector('.submit-div > button');
submitButton.addEventListener('mouseover', () => {
    submitButton.style = 'background-color: rgb(255, 246, 195);';
    // submitButton.childNodes[1].style = 'fill: white;';
});
submitButton.addEventListener('mouseout', () => {
    submitButton.style = 'background-color: white';
    // submitButton.childNodes[1].style = 'fill: rgb(255, 246, 195);';
});