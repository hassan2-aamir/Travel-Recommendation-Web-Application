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
        alert('Travel data is not loaded yet. Please try again.');
        return;
    }
    
    const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
    
    if (searchInput === '') {
        alert('Please enter a search term');
        return;
    }
    
    // Search results array
    let results = [];
    
    // Keywords and their variations
    const keywordVariations = {
        beach: ['beach', 'beaches', 'seaside', 'shore', 'coast'],
        temple: ['temple', 'temples', 'shrine', 'shrines', 'sanctuary'],
        country: ['country', 'countries', 'nation', 'nations']
    };
    
    // Check if search matches any keyword variations
    const isBeachSearch = keywordVariations.beach.some(term => searchInput.includes(term));
    const isTempleSearch = keywordVariations.temple.some(term => searchInput.includes(term));
    const isCountrySearch = keywordVariations.country.some(term => searchInput.includes(term));
    
    // Search in countries and cities
    travelData.countries.forEach(country => {
        let countryMatch = country.name.toLowerCase().includes(searchInput) || 
                          (isCountrySearch && country.type === 'country');
        
        // Check if search matches country name
        if (countryMatch) {
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
    
    // Search in temples (include all temples if temple keyword is used)
    travelData.temples.forEach(temple => {
        if (temple.name.toLowerCase().includes(searchInput) || isTempleSearch) {
            results.push({
                type: 'temple',
                name: temple.name,
                imageUrl: temple.imageUrl,
                description: temple.description
            });
        }
    });
    
    // Search in beaches (include all beaches if beach keyword is used)
    travelData.beaches.forEach(beach => {
        if (beach.name.toLowerCase().includes(searchInput) || isBeachSearch) {
            results.push({
                type: 'beach',
                name: beach.name,
                imageUrl: beach.imageUrl,
                description: beach.description
            });
        }
    });
    
    // Display the results
    displaySearchResults(results);
    
    return results;
}

// Function to display search results on the page
function displaySearchResults(results) {
    // Check if results container exists, if not create it
    let resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'search-results';
        resultsContainer.className = 'search-results-container';
        document.querySelector('.hero').after(resultsContainer);
    }
    
    resultsContainer.innerHTML = '';
    
    if (!results || results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found. Try another search term.</p>';
        return;
    }
    
    // Create container for results
    const resultsGrid = document.createElement('div');
    resultsGrid.className = 'results-grid';
    resultsGrid.style.display = 'grid';
    resultsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
    resultsGrid.style.gap = '20px';
    resultsGrid.style.padding = '20px';
    
    results.forEach(item => {
        const resultCard = document.createElement('div');
        resultCard.className = 'result-card';
        resultCard.style.border = '1px solid #ddd';
        resultCard.style.borderRadius = '8px';
        resultCard.style.overflow = 'hidden';
        resultCard.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        
        resultCard.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" style="width:100%; height:200px; object-fit:cover;">
            <div style="padding:15px;">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <span style="display:inline-block; padding:5px 10px; background:#3498db; color:white; border-radius:4px;">${item.type}</span>
            </div>
        `;
        
        resultsGrid.appendChild(resultCard);
    });
    
    resultsContainer.appendChild(resultsGrid);
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

// Reset search input and clear results
function resetSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }
    
    const resultsContainer = document.getElementById('search-results');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
    }
}