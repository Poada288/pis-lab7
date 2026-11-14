const foldButtons = document.querySelectorAll('.fold-button');

for (const button of foldButtons) {
    button.addEventListener('click', event => {
        console.log('you clicked', event.currentTarget);
        const post = button.closest('.one-post');
        const folded = post.classList.toggle('folded');
        button.textContent = folded ? 'развернуть' : 'свернуть';
        button.setAttribute('aria-expanded', String(!folded));
    });
}
