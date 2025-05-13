console.log('Upload script loaded');
document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.getElementById('uploadButton');
    const imageInput = document.getElementById('imageInput');
    const resultContainer = document.getElementById('resultContainer');

    uploadButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const file = imageInput.files[0];
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }
        const imageUrl = URL.createObjectURL(file);
        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;
        imgElement.alt = 'Uploaded Image';
        imgElement.style.maxWidth = '50vw';
        imgElement.style.maxHeight = '50vh';
        resultContainer.innerHTML = ''; // Clear previous results

        // Dodaj wrapper na obrazek i prostokąty
        const imageWrapper = document.createElement('div');
        imageWrapper.style.position = 'relative';
        imageWrapper.style.display = 'inline-block';

        imgElement.style.display = 'block';
        imageWrapper.appendChild(imgElement);
        resultContainer.appendChild(imageWrapper);

        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await axios.post('/luxandUpload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                let data = response.data;
                numberOfFaces = document.createElement('p');
                if (data.length === 0) {
                    numberOfFaces.innerHTML = 'Nie wykryto twarzy, prześlij inne zdjęcie';
                    numberOfFaces.style.color = 'red';
                    numberOfFaces.style.fontWeight = 'bold';
                    numberOfFaces.style.fontSize = '20px';
                    resultContainer.appendChild(numberOfFaces);
                    return;
                }
                else{
                numberOfFaces.innerHTML = 'Wykryto ' + data.length + ' twarzy';
                resultContainer.appendChild(numberOfFaces);
                data.forEach((item) => {
                    // Gender jako obiekt
                    let genderStr = item.gender && typeof item.gender === 'object'
                        ? `${item.gender.value} (${(item.gender.probability * 100).toFixed(2)}%)`
                        : JSON.stringify(item.gender);

                    // Expression jako tablica obiektów
                    let expressionStr = Array.isArray(item.expression)
                        ? item.expression.map(expr =>
                            `${expr.value} (${(expr.probability * 100).toFixed(2)}%)`
                          ).join(', ')
                        : JSON.stringify(item.expression);

                    // Age group jako string lub inny typ
                    let ageGroupStr = typeof item.age_group === 'object'
                        ? JSON.stringify(item.age_group)
                        : item.age_group;

                    const div = document.createElement('div');
                    div.innerHTML = `
                        <p>Płeć: ${genderStr}</p>
                        <p>Wiek: ${item.age}</p>
                        <p>Grupa wiekowa: ${ageGroupStr}</p>
                        <p>Ekspresja: ${expressionStr}</p>
                    `;
                    resultContainer.appendChild(div);

                    // Prostokąt na twarzy - dodaj do imageWrapper
                    const rect = document.createElement('div');
                    rect.style.position = 'absolute';
                    rect.style.border = '2px solid red';
                    rect.style.left = `${item.rectangle.left}px`;
                    rect.style.top = `${item.rectangle.top}px`;
                    rect.style.width = `${item.rectangle.right - item.rectangle.left}px`;
                    rect.style.height = `${item.rectangle.bottom - item.rectangle.top}px`;
                    rect.style.pointerEvents = 'none';
                    rect.style.zIndex = '1000';
                    imageWrapper.appendChild(rect);
                });
                downloadButton = document.createElement('button');
                    downloadButton.type = 'button';
                    downloadButton.innerHTML = 'Pobierz txt';
                    resultContainer.appendChild(downloadButton);
                    downloadButton.addEventListener('click', () => {
                        const blob = new Blob( [JSON.stringify(data)], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'api_response_data.txt';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        console.log('File downloaded:', 'api_response_data.txt');
                    });
                }
            } else {
                console.error('Error uploading file:', response.statusText);
                alert('Error uploading file: ' + response.statusText);
            }

        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file: ' + error.message);
        }
    });
});