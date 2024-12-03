

var moreInfos = document.getElementsByClassName('apropos_overlay');
for (let index = 0; index < moreInfos.length; index++) {
    const element = moreInfos[index];
    element.addEventListener('click', async (event) => {
        showDetails(event.target);
    });

}