/* Bootstrap 5 JS included */

console.clear();
('use strict');


// Drag and drop - single or multiple image files
// https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
// https://codepen.io/joezimjs/pen/yPWQbd?editors=1000
(function () {

    'use strict';


    // Four objects of interest: drop zones, input elements, gallery elements, and the files.
    // dataRefs = {files: [image files], input: element ref, gallery: element ref}

    const preventDefaults = event => {
        event.preventDefault();
        event.stopPropagation();
    };

    const highlight = event =>
        event.target.classList.add('highlight');

    const unhighlight = event =>
        event.target.classList.remove('highlight');

    const getInputAndGalleryRefs = element => {
        const zone = element.closest('.upload_dropZone') || false;
        const gallery = zone.querySelector('.upload_gallery') || false;
        const input = zone.querySelector('input[type="file"]') || false;
        return {input: input, gallery: gallery};
    }

    const handleDrop = event => {
        const dataRefs = getInputAndGalleryRefs(event.target);
        dataRefs.files = event.dataTransfer.files;
        handleFiles(dataRefs);
    }


    const eventHandlers = zone => {

        const dataRefs = getInputAndGalleryRefs(zone);
        if (!dataRefs.input) return;

        // Prevent default drag behaviors
        ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
            zone.addEventListener(event, preventDefaults, false);
            document.body.addEventListener(event, preventDefaults, false);
        });

        // Highlighting drop area when item is dragged over it
        ;['dragenter', 'dragover'].forEach(event => {
            zone.addEventListener(event, highlight, false);
        });
        ;['dragleave', 'drop'].forEach(event => {
            zone.addEventListener(event, unhighlight, false);
        });

        // Handle dropped files
        zone.addEventListener('drop', handleDrop, false);

        // Handle browse selected files
        dataRefs.input.addEventListener('change', event => {
            dataRefs.files = event.target.files;
            handleFiles(dataRefs);
        }, false);

    }

    // No 'image/gif' or PDF or webp allowed here, but it's up to your use case.
    // Double checks the input "accept" attribute
    const isImageFile = file =>
        ['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type);


    function previewFiles(dataRefs) {
        if (!dataRefs.gallery) return;
        for (const file of dataRefs.files) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function () {
                let img = document.createElement('img');
                img.className = 'upload_img mt-2';
                img.setAttribute('alt', file.name);
                img.src = reader.result;
                dataRefs.gallery.appendChild(img);
            }
        }
    }

    // Based on: https://flaviocopes.com/how-to-upload-files-fetch/
    const imageUpload = dataRefs => {

        // Multiple source routes, so double check validity
        if (!dataRefs.files || !dataRefs.input) return;

        const name = dataRefs.input.getAttribute('data-post-name');
        if (!name) return;

        const formData = new FormData();
        formData.append(name, dataRefs.files[0]);

        fetch(uploadImageURL, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log('posted: ', data);
                if (data.success === true) {
                    previewFiles(dataRefs);
                } else {
                    console.log('URL: ', uploadImageURL, '  name: ', name)
                }
                currentImageID = data.image_id;
            })
            .catch(error => {
                console.error('errored: ', error);
            });
    }


    // Handle both selected and dropped files
    const handleFiles = dataRefs => {

        let files = [...dataRefs.files];

        // Remove unaccepted file types
        files = files.filter(item => {
            if (!isImageFile(item)) {
                console.log('Not an image, ', item.type);
            }
            return isImageFile(item) ? item : null;
        });

        if (!files.length) return;
        dataRefs.files = files;

        previewFiles(dataRefs);

        enableButton(uploadButton);
    }

    function clickUploadAndDetect() {
        const zone = dropZones[0];

        const dataRefs = getInputAndGalleryRefs(zone);

        dataRefs.files = dataRefs.input.files;

        imageUpload(dataRefs);

        enableButton(showButton);
    }

    function clickShowDetections() {
        console.log('Retrieving detections image from server');

        const image_id = currentImageID; // "baf8bb96-2691-4eeb-8eb7-6f71f55929e0";
        const searchParams = new URLSearchParams({image_id});

        fetch(getDetectionsImageURL + '?' + searchParams, {
            method: 'GET'
        })
            .then(data => data.blob())
            .then(data => {
                console.log('retrieved: ', data);

                let reader = new FileReader();
                reader.readAsDataURL(data);
                reader.onloadend = function () {
                    // let img = document.createElement('img');
                    detectionsImage.className = 'upload_img mt-2';
                    detectionsImage.setAttribute('alt', 'detections.tmp');
                    // detectionsImage.style.display = 'block';
                    detectionsImage.style.visibility = 'visible';
                    detectionsImage.src = reader.result;
                    // dataRefs.gallery.appendChild(img);
                }
            })
            .catch(error => {
                console.error('errored: ', error);
            });
    }

    function enableButton(element) {
        element.disabled = false;
    }


    // Initialise ALL dropzones
    const dropZones = document.querySelectorAll('.upload_dropZone');
    for (const zone of dropZones) {
        eventHandlers(zone);
    }

    const backendURL = "http://127.0.0.1:8000";
    const uploadImageURL = `${backendURL}/file/upload-file`;
    const getDetectionsImageURL = `${backendURL}/file/`;

    const uploadButton = document.getElementById('uploadButton');
    uploadButton.addEventListener("click", clickUploadAndDetect);

    const showButton = document.getElementById('showButton');
    showButton.addEventListener("click", clickShowDetections);

    const detectionsImage = document.getElementById('detectionsImage');

    let currentImageID = null;
})();
