export function openDocumentHtml(element) {
    const documentName = element.id;
    element.addEventListener("click", () => {
        window.location.href = documentName + "/" + documentName + ".html";
    });
    element.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            window.location.href = documentName + "/" + documentName + ".html";
        }
    });
}