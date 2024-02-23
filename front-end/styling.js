document.querySelector('.submit-div > input').focus();

let submitButton = document.querySelector('.submit-div > button');
submitButton.addEventListener('mouseover', () => {
    submitButton.style = 'background-color: rgb(165, 126, 0);';
    submitButton.childNodes[1].style = 'fill: white;';
});
submitButton.addEventListener('mouseout', () => {
    submitButton.style = 'background-color: white';
    submitButton.childNodes[1].style = 'fill: rgb(165, 126, 0);';
});
document.getElementById('message').addEventListener('input', () => {
    console.log('here');
    window.scrollTo(0, document.body.scrollHeight);
})