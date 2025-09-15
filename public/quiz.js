document.addEventListener('DOMContentLoaded', () => {
    const questionsContainer = document.getElementById('quiz-questions-container');
    const quizForm = document.getElementById('prakriti-quiz-form');
    const resultContainer = document.getElementById('result-container');
    const logoutBtn = document.getElementById('logout-btn');

    let questionsData = [];

 

    // 1. Fetch questions from the backend
    async function fetchQuestions() {
        try {
            const response = await fetch('http://localhost:5000/api/prakriti/questions');
            questionsData = await response.json();
            displayQuestions();
        } catch (error) {
            questionsContainer.innerHTML = '<p class="text-red-500">Failed to load questions. Please try again later.</p>';
            console.error('Error fetching questions:', error);
        }
    }

    // 2. Display questions as styled cards
    function displayQuestions() {
        questionsData.forEach((item, index) => {
            const questionCard = document.createElement('div');
            questionCard.className = 'bg-white p-6 rounded-lg shadow-md';
            
            let optionsHtml = `<fieldset><legend class="text-lg font-semibold text-gray-800 mb-4">${index + 1}. ${item.question}</legend>`;
            optionsHtml += '<div class="grid grid-cols-1 md:grid-cols-3 gap-4">';

            for (const [dosha, text] of Object.entries(item.options)) {
                // This structure uses a hidden radio input controlled by a styled label
                optionsHtml += `
                    <div>
                        <input type="radio" name="question-${index}" value="${dosha}" id="q${index}-${dosha}" class="hidden peer" required>
                        <label for="q${index}-${dosha}" class="block h-full p-4 text-center rounded-lg border-2 border-gray-200 cursor-pointer 
                                                       text-gray-600 hover:bg-gray-50 
                                                       peer-checked:bg-green-100 peer-checked:text-green-800 peer-checked:border-green-400">
                            <span class="font-semibold">${dosha.charAt(0).toUpperCase() + dosha.slice(1)}</span>
                            <span class="block text-sm mt-1">${text}</span>
                        </label>
                    </div>
                `;
            }
            optionsHtml += '</div></fieldset>';
            questionCard.innerHTML = optionsHtml;
            questionsContainer.appendChild(questionCard);
        });
    }

    // 3. Handle form submission
    quizForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(quizForm);
        const answers = [];
        for (let i = 0; i < questionsData.length; i++) {
            answers.push(formData.get(`question-${i}`));
        }

        if (answers.some(answer => answer === null)) {
            alert('Please answer all questions to get an accurate result.');
            return;
        }
        
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to save your result. Please log in and try again.');
            window.location.href = '/public/login.html';
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/prakriti/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify({ answers }),
            });

            const data = await response.json();
            displayResults(data);

        } catch (error) {
            console.error('Error calculating Prakriti:', error);
            alert('An error occurred while calculating your Prakriti. Please try again.');
        }
    });

    // 4. Function to display the formatted results
    function displayResults(data) {
        const totalScore = Object.values(data.scores).reduce((sum, score) => sum + score, 0);

        let scoresHTML = '<div class="space-y-3">';
        for (const [dosha, score] of Object.entries(data.scores)) {
            const percentage = totalScore > 0 ? (score / totalScore * 100).toFixed(0) : 0;
            scoresHTML += `
                <div class="w-full">
                    <div class="flex justify-between mb-1">
                        <span class="text-base font-medium text-gray-700">${dosha.charAt(0).toUpperCase() + dosha.slice(1)}</span>
                        <span class="text-sm font-medium text-gray-700">${percentage}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="bg-gradient-to-r from-green-300 to-green-600 h-2.5 rounded-full" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }
        scoresHTML += '</div>';

        let resultHTML = `
            <div class="text-center">
                <p class="font-medium text-gray-600">Your Primary Constitution</p>
                <h2 class="font-serif text-5xl font-bold text-green-800 my-2">${data.prakriti}</h2>
            </div>
            <p class="text-center text-gray-700 mt-4">${data.description}</p>
            <div class="mt-8 border-t pt-6">
                <h3 class="font-semibold text-xl text-center text-gray-800 mb-4">Your Dosha Scores</h3>
                ${scoresHTML}
            </div>
            <div class="text-center mt-8">
                <a href="/public/dashboard.html" class="text-white bg-[#0A4D3C] hover:bg-green-800 font-medium rounded-full text-sm px-5 py-2.5">View on Dashboard</a>
            </div>
        `;
        
        resultContainer.innerHTML = resultHTML;
        resultContainer.classList.remove('hidden');
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Initial call to load the quiz questions
    fetchQuestions();
});