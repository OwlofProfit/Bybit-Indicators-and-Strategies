function openModal(card) {
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modal-image");
    const imgSrc = card.querySelector("img").src;

    modalImg.src = imgSrc;
    modal.style.display = "flex";
}

function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById("modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
