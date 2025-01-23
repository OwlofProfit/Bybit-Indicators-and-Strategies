function openModal(card) {
    const modal = document.getElementById("modal");
    const modalImage = document.getElementById("modal-image");
    const cardImage = card.querySelector("img");

    modal.style.display = "flex";
    modalImage.src = cardImage.src;
}

function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}
