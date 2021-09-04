//const origin = 'http://localhost:8080';
//const origin = 'https://ichatu.ga';

const btnCreateRoom = document.querySelector('.btn-create-room');
const inputName = document.querySelector('input[name="name"]');
const rooms = document.querySelector('.rooms');

/* MODAL */
const modalBodyContent = modal.querySelector('.modal-body-content');
const modalRoomName = modal.querySelector('input[name="modal-room-name"]');
const btnConfirm = modal.querySelector('.modal-btn-confirm');
const btnCancel = modal.querySelector('.modal-btn-cancel');
const btnCreate = modal.querySelector('.modal-btn-create');

let page = 1;

/* request for list */
/* 얘가 성능이 안나온다!! */
(async () => {
    const list = await axios({
        url: `${origin}/api/v1/rooms/${sessionRegionId}/list/${page}`,
        method: 'GET'
    }).then(response => response.data);
    
    let html = '';

    list.forEach((room, idx) => {
        console.log(room);

        const roomProfileId = room.profileId;
        const roomProfileName = room.profileName;
        const roomProfilePath = room.profilePath;

        let roomProfile = roomProfileId?
            `/upload${roomProfilePath}/${roomProfileId}_${roomProfileName}`
            : `/image/common/profile.png`;

        html += `
                    <div class="room">

                    <img src="${roomProfile}" class="room-profile">
                        
                    <div class="room-info">
                        <div class="top-box">
                            <div class="room-name">
                                <a data-rid=${room.id} href="room?id=${room.id}">${room.name}</a>
                            </div>
                            <div class="room-date">
                                ${convertDate(room.regDate)}
                            </div>
                        </div>

                        <div class="bottom-box">
                            <div class="room-creator">
                                ${room.nickname}
                            </div>
                        </div>
                        
                    </div>

                </div>`;
    });

    rooms.insertAdjacentHTML('beforeend', html);
})();

/* request for add Room */
btnCreateRoom.addEventListener('click', async (e) => {
    e.preventDefault();

    modalRoomName.value = '';
    modalRoomName.classList.remove('hide');

    btnCreate.classList.remove('hide');
    btnConfirm.classList.add('hide');

    modalHd.innerText = 'CHAT ROOM CREATE';
    modalCanvas.classList.toggle('hide');
    
});

/* 채팅방 생성 CLICK */
btnCreate.addEventListener('click', async (e) => {
    e.preventDefault();

    const name = modalRoomName.value;

    const chatRoomId = await axios({
        url: `${origin}/api/v1/rooms`,
        method: 'POST',
        headers: {'content-type':'application/json'},
        data: {
            name,
            memberId: sessionMemberId
        }
    });

    let myProfile = sessionProfileId?
        `/upload${sessionProfilePath}/${sessionProfileId}_${sessionProfileName}`
        : `/image/common/profile.png`;

    const html = `
                    <div class="room">

                    <img src="${myProfile}" class="room-profile">
                        
                    <div class="room-info">
                        <div class="top-box">
                            <div class="room-name">
                                <a data-rid=${chatRoomId.data} href="room?id=${chatRoomId.data}">${name}</a>
                            </div>
                            <div class="room-date">
                                ${convertDate(Date.now())}
                            </div>
                        </div>

                        <div class="bottom-box">
                            <div class="room-creator">
                                ${sessionNickname}
                            </div>
                        </div>
                        
                    </div>

                </div>`;

    rooms.insertAdjacentHTML('beforeend', html);

    modalCanvas.classList.toggle('hide');
});

/* Logic for A member Join B ChatRoom */
rooms.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const tagName = e.target.tagName;

    if(tagName !== 'A') return;

    const chatRoomId = e.target.dataset.rid;
    const roomName = e.target.innerText;

    //isJoin : true (가입중), false (미가입)
    const isJoin = await axios({
        url: `${origin}/api/v1/joins/${chatRoomId}/member/${sessionMemberId}`,
        method: 'GET'
    })
    .then(response => response.data);
    
    if(isJoin){
        //enter the ChatRoom
        location = e.target.href;
    }
    else{
        //join in ChatRoom
        btnCancel.classList.remove('hide');
        btnConfirm.classList.remove('hide');
        btnCreate.classList.add('hide');

        modalRoomName.classList.add('hide');
        modalHd.innerText = 'CHAT ROOM JOIN';

        modalBodyContent.dataset.rid = chatRoomId;
        modalBodyContent.innerText = `${roomName}에 참여하시겠습니까?`;

        modalCanvas.classList.toggle('hide');
    }
});


/* MODAL LOGIC */
btnConfirm.addEventListener('click', (e) => {

    const chatRoomId = modalBodyContent.dataset.rid;
    const href = `/chat/room?id=${chatRoomId}`;

    axios({
        url: `${origin}/api/v1/joins/${chatRoomId}/member/${sessionMemberId}`,
        method: 'POST'
    })
    .then(response => response.data)
    .then(data => {
        console.log(data);
        if(data > 0){
            console.log('채팅방 참여 성공');
            location = href;
        }
        else{
            console.error('Exception Occured.');
        }
    });

});


//임시 로직 (반드시 지울 것)#########################################################################
const btnLogout = document.querySelector('.btn-logout');
btnLogout.addEventListener('click', (e) => {
    e.preventDefault();

    axios({
        url: `${origin}/api/v1/logout`,
        method: 'POST',
        headers: {'content-type' : 'application/json'},
        data: {
            id: sessionMemberId,
            nickname: sessionNickname
        }
    }).then((response) => {
        if(response.data === 'success'){
            sessionStorage.clear();
            location = `/login`;
        }
    }).catch(err => console.log(err));
});

function convertDate(d){
    const dt = new Date(d);

    const year = dt.getFullYear();
    const month = dt.getMonth() + 1;
    const date = dt.getDate();

    return `${year}-${month}-${date}`;
}