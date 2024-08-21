console.log('Content script loaded');

// Function to create a small popup with professor rating and a close button
function showRatingPopup(professorName, rating, mouseX, mouseY) {
    console.log('Displaying popup for:', professorName, 'with rating:', rating);
    const popup = document.createElement('div');
    popup.innerText = `${professorName}\nRating: ${rating}`;
    popup.style.position = 'absolute';  // Position it relative to the mouse position
    popup.style.top = `${mouseY + 10}px`;  // Offset from the mouse cursor
    popup.style.left = `${mouseX + 10}px`;
    popup.style.backgroundColor = '#fff';
    popup.style.border = '1px solid #000';
    popup.style.padding = '8px';
    popup.style.zIndex = '1000';
    popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    popup.style.borderRadius = '5px';
    popup.style.maxWidth = '200px';
    popup.style.fontSize = '14px';
    popup.style.lineHeight = '1.5';

    // Create the close button
    const closeButton = document.createElement('span');
    closeButton.innerText = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '2px';
    closeButton.style.right = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.color = '#ff0000';

    // Add event listener to close the popup when the button is clicked
    closeButton.addEventListener('click', () => {
        popup.remove();
    });

    // Append the close button to the popup
    popup.appendChild(closeButton);

    // Append the popup to the body
    document.body.appendChild(popup);
    console.log('Popup added to the DOM:', popup);
}

// Fetch professor data from the API
async function fetchProfessorData(professorName) {
    const apiUrl = `https://still-thicket-02924-90d9ebc10521.herokuapp.com/api/professor?name=${encodeURIComponent(professorName)}`;

    console.log('Preparing to fetch data for:', professorName);

    try {
        console.log('Fetching data from:', apiUrl);

        const response = await fetch(apiUrl);
        console.log('API response status:', response.status);

        if (!response.ok) {
            console.error('Failed to fetch data:', response.statusText);
            return null;
        }

        const data = await response.json();
        console.log('Data received:', data);
        return data;
    } catch (error) {
        console.error('Error fetching professor data:', error);
        return null;
    }
}

// Listen for text selection events
document.addEventListener('mouseup', async (event) => {
    console.log('Mouseup event triggered');

    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    console.log('Selected text:', `"${selectedText}"`);

    if (selectedText && selectedText.includes("Professor")) {
        console.log('Triggering API fetch for:', selectedText);

        const professorData = await fetchProfessorData(selectedText);

        if (professorData && professorData.rating) {
            console.log('Showing popup with rating:', professorData.rating);
            showRatingPopup(selectedText, professorData.rating, event.clientX, event.clientY);
        } else {
            console.log('No data found for:', selectedText);
        }
    } else {
        console.log('Selected text does not contain "Professor"');
    }
});
