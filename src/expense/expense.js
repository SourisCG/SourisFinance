document.querySelectorAll("input[type='number']").forEach(input => {
    input.addEventListener("wheel", (event) => {
        event.preventDefault();
    });
});