/* MODAL CANVAS */
const modalCanvas = document.querySelector('.modal-canvas');
/* MODAL */
const modal = modalCanvas.querySelector('.modal');
/* MODAL HEADER */
const modalHd = modal.querySelector('.modal-hd');
/* MODAL BODY */
const modalBody = modal.querySelector('.modal-body');
/* MODAL FOOTER */
const modalFt = modal.querySelector('.modal-ft');
const modalBtnCancel = modalFt.querySelector('.modal-btn-cancel');

modalCanvas.addEventListener('click', function (e) {

    if(!e.target.classList.contains('modal-canvas')) return;

    this.classList.toggle('hide');
});
modalBtnCancel.addEventListener('click', (e) => {
    // modalBody.innerText = '';
    modalCanvas.classList.toggle('hide');
});