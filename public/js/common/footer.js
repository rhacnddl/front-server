window.addEventListener('load', () => {
    const footer = document.querySelector('#footer');
    const ftBlog = footer.querySelector('.ft-blog');
    const ftGithub = footer.querySelector('.ft-github');

    ftBlog.onclick = () => {
        open('https://dev-gorany.tistory.com/');
    }
    ftGithub.onclick = () =>{
        open('https://github.com/rhacnddl');
    }
});