function deletePost(element) {
    const id = element.getAttribute('data-id');
    fetch('/delete-post/' + id, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Remove the post element from the DOM
            element.parentElement.remove();
        })
        .catch(error => console.error(error));
}