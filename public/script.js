document.addEventListener('DOMContentLoaded', () => {
    fetchHerbs();
});

async function fetchHerbs() {
    try {
        const response = await fetch('http://localhost:5000/api/herbs');
        const herbs = await response.json();
        
        const container = document.getElementById('herbs-container');
        container.innerHTML = ''; // Clear any example cards

        if(herbs.length === 0){
            container.innerHTML = '<p>No products to display.</p>';
            return;
        }

        herbs.forEach(herb => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-lg shadow-lg overflow-hidden flex flex-col'; // Tailwind classes for the card
            
            // This innerHTML creates the structure for each card based on the new design
            card.innerHTML = `
                <div class="h-56 bg-gray-100 flex items-center justify-center">
                    <img src="${herb.imageUrl || 'https://via.placeholder.com/400x300.png/EBF5EE/333333?text='+herb.name}" alt="${herb.name}" class="w-full h-full object-cover">
                </div>
                <div class="p-6 flex flex-col flex-grow">
                    <h3 class="font-semibold text-xl text-gray-800">${herb.name}</h3>
                    <p class="text-gray-600 mt-2 flex-grow">${herb.description}</p>
                    <div class="mt-4 flex justify-between items-center">
                        <span class="font-bold text-xl text-gray-900">$19.99</span> <button class="bg-[#0A4D3C] text-white px-4 py-2 rounded-full hover:bg-green-800 transition">Add to Cart</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Failed to fetch herbs:', error);
        const container = document.getElementById('herbs-container');
        container.innerHTML = '<p>Error loading products. Please try again later.</p>';
    }
}