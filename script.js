// Funkcia na otvorenie modálneho okna
function openModal(card) {
    const modal = document.getElementById("modal");
    const modalImage = document.getElementById("modal-image");
    const cardImage = card.querySelector("img");

    modal.style.display = "flex";
    modalImage.src = cardImage.src;
}

// Funkcia na zatvorenie modálneho okna
function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

// Skrytie modálneho okna pri načítaní stránky
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
});
