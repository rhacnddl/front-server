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
let isLast = false;

/* request for list */
async function showList(page){
    const slice = await axios({
        url: `${origin}/api/v1/rooms/${sessionRegionId}/list/${page}`,
        method: 'GET'
    }).then(response => response.data);

    isLast = slice.last;
    const list = slice.content;

    let html = '';

    list.forEach((room, idx) => {
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
}
//init
showList(page++);
window.addEventListener('scroll', () => {

    let val = window.innerHeight + (window.scrollY - 70);

    if(val >= main.clientHeight && !isLast){
        showList(page++);
    }
});

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

/* ????????? ?????? CLICK */
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

    rooms.insertAdjacentHTML('afterbegin', html);

    modalCanvas.classList.toggle('hide');
});

/* Logic for A member Join B ChatRoom */
rooms.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const tagName = e.target.tagName;

    if(tagName !== 'A') return;

    const chatRoomId = e.target.dataset.rid;
    const roomName = e.target.innerText;

    //isJoin : true (?????????), false (?????????)
    const isJoin = await axios({
        url: `${origin}/api/v1/joins/${chatRoomId}/member/${sessionMemberId}`,
        method: 'GET'
    })
    .then(response => response.data);
    
    if(isJoin){
        //enter the ChatRoom
        checkAllNotificationsByChatRoomAndMember(chatRoomId, sessionMemberId);
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
        modalBodyContent.innerText = `${roomName}??? ?????????????????????????`;

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
        //console.log(data);
        if(data > 0){
            //console.log('????????? ?????? ??????');
            location = href;
        }
        else{
            console.error('Exception Occured.');
        }
    });

});

/* Function : ????????? ?????? -> ??? ???????????? ?????? ??? ???????????? */
async function checkAllNotificationsByChatRoomAndMember(chatRoomId, memberId){

    const count = await axios({
        url: `${origin}/api/v1/notifications/room/${chatRoomId}/member/${memberId}`,
        method : 'PUT'
    })
    .then(response => response.data);
}

function convertDate(d){
    const dt = new Date(d);

    const year = dt.getFullYear();
    const month = dt.getMonth() + 1;
    const date = dt.getDate();

    return `${year}-${month}-${date}`;
}