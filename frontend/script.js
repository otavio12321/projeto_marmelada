document.getElementById('animal-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById('animal-image');
    const file = fileInput.files[0];
    
    var animalImage = document.getElementById('cs-animal-image');
    animalImage.src = URL.createObjectURL(file);


    if (!file) {
        alert('Por favor, selecione uma imagem.');
        return;
    }

    const formData = new FormData();
    formData.append('animalImage', file);

    try {
        const response = await fetch('/identify-animal', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Erro ao identificar a imagem.');
        }

        const result = await response.json();
        const speciesName = result.speciesName;

        if (speciesName) {
            const infoResponse = await fetch('/get-animal-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ speciesName }),
            });

            if (!infoResponse.ok) {
                throw new Error('Erro ao obter informações sobre o animal.');
            }

            const infoResult = await infoResponse.json();
            const animalInfo = infoResult.animalInfo;
            alert(animalInfo);
        } else {
            alert('Não foi possível identificar o animal.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao processar a imagem.');
    }
});
