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
