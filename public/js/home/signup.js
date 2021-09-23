//const origin = 'http://localhost:8080';
//const origin = 'https://ichatu.ga';

const formSignup = document.querySelector('#form-signup');
const inputNickname = formSignup.querySelector('#nickname');
const inputPassword = formSignup.querySelector('#password');
const inputCheck = formSignup.querySelector('#password-check');
const inputEmail = formSignup.querySelector('#email');
const btnSignup = formSignup.querySelector('#btn-signup');

/* MODAL */
const modalBtnConfirm = modal.querySelector('.modal-btn-confirm');

const hdBtnLogin = header.querySelector('.hd-btn-login');
const hdBtnSignup = header.querySelector('.hd-btn-signup');

/* LOGIN CLICK */
hdBtnLogin.addEventListener('click', (e) => {
    e.preventDefault();
    location = `/login`;
});
/* SINGUP CLICK */
hdBtnSignup.addEventListener('click', (e) => {
    e.preventDefault();
    location = `/signup`;
});

//이미 로그인 했으면 초기 화면으로 돌려보냄
if(sessionStorage.getItem('memberId')){
    location = '/chat/rooms';
}

/* <action> 회원 가입 Button Click */
btnSignup.addEventListener('click', (e) => {

    e.preventDefault();

    const nickname = inputNickname.value;
    const email = inputEmail.value;
    const password = inputPassword.value;
    const passwordCheck = inputCheck.value;

    modalBtnConfirm.classList.add('hide');

    /* Validation */
    if(nickname == '' || nickname == undefined || nickname == null){
        modalBody.innerText = '닉네임을 입력해주세요.';
        modalCanvas.classList.toggle('hide');

        return;
    }

    if(nickname.length > 12 || nickname.length < 4){
        modalBody.innerText = `닉네임을 4 ~ 12글자 사이로 입력해주세요.`;
        modalCanvas.classList.toggle('hide');

        return;
    }

    if(password == '' || password == null || password == undefined){
        modalBody.innerText = '비밀번호를 입력해주세요.';
        modalCanvas.classList.toggle('hide');

        return;
    }

    if(password.length < 6 || password.length > 12){
        modalBody.innerText = '비밀번호를 최소 6자, 최대 12자에 맞게 입력해주세요.';
        modalCanvas.classList.toggle('hide');

        return;
    }

    if(password !== passwordCheck){
        /* 비밀번호 불일치 시 경고 (모달 창으로 수정) */
        modalBody.innerText = '비밀번호가 일치하지 않습니다.';
        modalCanvas.classList.toggle('hide');

        return;
    }

    if(email == '' || email == undefined || email == null){
        modalBody.innerText = '이메일을 입력해주세요.';
        modalCanvas.classList.toggle('hide');

        return;
    }

    if(!vaildEmail(email)){
        modalBody.innerText = `이메일을 형식에 맞게 입력해주세요. 
        (예: example@hello.co.kr)`;
        modalCanvas.classList.toggle('hide');

        return;
    }
    /* Validation */

    modalBtnConfirm.classList.remove('hide');
    modalBody.innerText = `닉네임은 추후 변경할 수 없습니다.
    '${nickname}'으로 회원가입 할까요?`;
    modalCanvas.classList.toggle('hide');


});

modalBtnConfirm.addEventListener('click', (e) => {
    e.preventDefault();

    const nickname = inputNickname.value;
    const email = inputEmail.value;
    const password = inputPassword.value;

    const signupDTO = {
        nickname,
        email,
        password
    };

    /* request for sign-up */
    axios({
        url: `${origin}/api/v1/signup`,
        method: 'POST',
        headers: {'content-type':'application/json'},
        data: signupDTO,
    })
    .then(resp => resp.data)
    .then(data => {
        if(data !== (null || undefined || -1))
            location = `/login`;
        else if(data == -1){
            modalBtnConfirm.classList.add('hide');
            modalBody.innerText = `이미 존재하는 닉네임입니다.
            다른 닉네임으로 입력해주세요!`;
        }
        else{
            modalBtnConfirm.classList.add('hide');
            modalBody.innerText = `회원가입에 실패했습니다.
            다시 시도해주세요.`;
        }
    });
});

function vaildEmail (email) {
     var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i; 
     
     return email.match(regExp) != null;
};