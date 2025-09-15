document.addEventListener('DOMContentLoaded', () => {
    const checklistContainer = document.getElementById('symptoms-checklist');
    const symptomForm = document.getElementById('symptom-form');
    const resultContainer = document.getElementById('result-container');
    const logoutBtn = document.getElementById('logout-btn');

    // Basic check for login status to show/hide logout button
    if (localStorage.getItem('token')) {
        logoutBtn.classList.remove('hidden');
    }
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/public/index.html';
    });


    // Fetch and display symptoms as selectable tags
    async function loadSymptoms() {
        try {
            const res = await fetch('http://localhost:5000/api/symptoms');
            const symptoms = await res.json();

            checklistContainer.innerHTML = ''; // Clear loading text

            symptoms.forEach(symptom => {
                const tagDiv = document.createElement('div');
                // This structure uses a hidden checkbox controlled by a styled label (the "tag")
                tagDiv.innerHTML = `
                    <input type="checkbox" id="${symptom.name}" name="symptom" value="${symptom.name}" class="hidden peer">
                    <label for="${symptom.name}" 
                           class="inline-block px-4 py-2 border-2 border-gray-300 rounded-full cursor-pointer 
                                  text-gray-600 font-medium hover:bg-gray-100 
                                  peer-checked:bg-green-100 peer-checked:text-green-800 peer-checked:border-green-300">
                        ${symptom.name}
                    </label>
                `;
                checklistContainer.appendChild(tagDiv);
            });
        } catch (err) {
            checklistContainer.innerHTML = '<p class="text-red-500 text-center">Failed to load symptoms. Please try again later.</p>';
            console.error('Failed to load symptoms:', err);
        }
    }

    // Handle form submission
    symptomForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const selectedSymptoms = Array.from(document.querySelectorAll('input[name="symptom"]:checked')).map(el => el.value);

        if (selectedSymptoms.length === 0) {
            alert('Please select at least one symptom to analyze.');
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/symptoms/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ selectedSymptoms })
            });
            const data = await res.json();

            // Display the formatted results
            displayResults(data);
        } catch (err) {
            console.error('Failed to analyze symptoms:', err);
            resultContainer.innerHTML = '<p class="text-red-500 text-center">An error occurred during analysis. Please try again.</p>';
            resultContainer.classList.remove('hidden');
        }
    });

    // Function to format and display the results
    function displayResults(data) {
        let resultHTML = `
            <div class="text-center">
                <p class="text-gray-600 font-medium">Likely Imbalance</p>
                <h2 class="font-serif text-4xl font-bold text-green-800 my-2">${data.imbalancedDosha}</h2>
            </div>
            <div class="mt-6 border-t pt-6">
                <h3 class="font-semibold text-xl text-gray-800 mb-4 text-center">Recommended Herbal Support</h3>
                <div class="space-y-4">
        `;

        if (data.recommendedHerbs && data.recommendedHerbs.length > 0) {
            data.recommendedHerbs.forEach(herb => {
                resultHTML += `
                    <div class="p-4 bg-gray-50 rounded-lg">
                        <h4 class="font-bold text-md text-gray-900">${herb.name}</h4>
                        <p class="text-sm text-gray-600 mt-1">${herb.description}</p>
                    </div>
                `;
            });
        } else {
            resultHTML += '<p class="text-center text-gray-500">No specific herbs found in our database for this imbalance.</p>';
        }

        resultHTML += '</div></div>';

        resultContainer.innerHTML = resultHTML;
        resultContainer.classList.remove('hidden');
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Initial call to load the symptom list
    loadSymptoms();
});