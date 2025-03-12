// Main JavaScript file for Travel Buddy recommendations

// Global variable to store all travel data
let travelData = null;

// Fetch travel data from JSON file on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchTravelData();
});

// Function to fetch travel data
async function fetchTravelData() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
        travelData = await response.json();
        console.log('Travel data loaded successfully:', travelData);
    } catch (error) {
        console.error('Error fetching travel data:', error);
    }
}

// Search function to find recommendations based on user input
function searchRecommendations() {
    if (!travelData) {
        console.log('Travel data is not loaded yet. Please try again.');
        return;
    }
    
    const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
    
    if (searchInput === '') {
        console.log('Please enter a search term');
        return;
    }
    
    // Search results array
    let results = [];
    
    // Search in countries and cities
    travelData.countries.forEach(country => {
        // Check if search matches country name
        if (country.name.toLowerCase().includes(searchInput)) {
            // Add all cities from this country
            country.cities.forEach(city => {
                results.push({
                    type: 'city',
                    name: city.name,
                    imageUrl: city.imageUrl,
                    description: city.description
                });
            });
        }
        
        // Check individual cities
        country.cities.forEach(city => {
            if (city.name.toLowerCase().includes(searchInput)) {
                results.push({
                    type: 'city',
                    name: city.name,
                    imageUrl: city.imageUrl,
                    description: city.description
                });
            }
        });
    });
    
    // Search in temples
    travelData.temples.forEach(temple => {
        if (temple.name.toLowerCase().includes(searchInput)) {
            results.push({
                type: 'temple',
                name: temple.name,
                imageUrl: temple.imageUrl,
                description: temple.description
            });
        }
    });
    
    // Search in beaches
    travelData.beaches.forEach(beach => {
        if (beach.name.toLowerCase().includes(searchInput)) {
            results.push({
                type: 'beach',
                name: beach.name,
                imageUrl: beach.imageUrl,
                description: beach.description
            });
        }
    });
    
    // Log the results for debugging
    if (results.length > 0) {
        console.log('Search results:', results);
    } else {
        console.log('No results found for:', searchInput);
    }
    
    return results;
}

// Reset search input and clear results
function resetSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
        console.log('Search reset');
    }
}