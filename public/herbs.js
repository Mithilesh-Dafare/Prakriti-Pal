document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const resultContainer = document.getElementById('result-container');

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (!query) return;

        resultContainer.innerHTML = '<p class="text-center">Searching...</p>';

        try {
            const res = await fetch(`http://localhost:5000/api/herbs/search?name=${query}`);
            const data = await res.json();

            if (!res.ok) {
                // Handle "Not Found" and other errors from the backend
                resultContainer.innerHTML = `<p class="text-center text-red-500">${data.msg}</p>`;
                return;
            }

            displayHerb(data);

        } catch (err) {
            console.error('Search failed:', err);
            resultContainer.innerHTML = '<p class="text-center text-red-500">An error occurred. Please try again.</p>';
        }
    });

    function displayHerb(herb) {
        let benefitsHTML = herb.benefits.map(benefit => `<li class="flex items-start"><span class="text-green-500 mr-2">✔</span>${benefit}</li>`).join('');

        const herbHTML = `
            <div class="bg-white p-8 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div class="md:col-span-1">
                    <img src="${herb.imageUrl || 'https://via.placeholder.com/400'}" alt="${herb.name}" class="w-full rounded-lg shadow-md">
                </div>
                <div class="md:col-span-2">
                    <h2 class="font-serif text-4xl font-bold text-gray-800">${herb.name}</h2>
                    <p class="text-lg text-gray-500 italic">${herb.sanskritName}</p>
                    <p class="mt-4 text-gray-700">${herb.description}</p>

                    <div class="mt-6">
                        <h3 class="font-semibold text-xl text-gray-800 mb-2">Key Benefits:</h3>
                        <ul class="space-y-2 text-gray-600">${benefitsHTML}</ul>
                    </div>

                    <div class="mt-6">
                        <h3 class="font-semibold text-xl text-gray-800 mb-2">How to Use:</h3>
                        <p class="text-gray-600">${herb.howToUse}</p>
                    </div>
                </div>
            </div>
        `;
        resultContainer.innerHTML = herbHTML;
    }
});