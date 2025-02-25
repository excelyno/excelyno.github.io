function showInfo(index) {
    const images = document.querySelectorAll('.image-box');
    images.forEach((image, i) => {
        if (i === index) {
            image.classList.toggle('active');
        } else {
            image.classList.remove('active');
        }
    });
}
