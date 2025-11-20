// Atlas 2.0 - DAP8 Operations
// Winter Edition

// Global data storage
let stemData = null;
let searchData = null;
let dspData = null;
const processedBarcodes = new Map();

// DSP Information (hardcoded) - Wave assignments and Chime webhooks
const dspInfo = {
    'NALG': { 
        wave: 1, 
        name: 'NA Logistik GmbH', 
        email: 'dap8-dispatcher@nazipaketlogistik.at',
        webhook: 'https://hooks.chime.aws/incomingwebhooks/2fa4330f-08a9-40cd-99e9-355789853f3c?token=STZ6Y1Q5bzN8MXxDd2VualdoSDRJajN4UnBxQVNjSFoyUDJnSWgwUWZPSklBWGVBZGRqTnB3'
    },
    'AMTP': { 
        wave: 2, 
        name: 'AllMunA Transportlogistik GmbH', 
        email: 'dap8-dispatcher@allmuna.at',
        webhook: 'https://hooks.chime.aws/incomingwebhooks/07b12ac5-055e-48d9-a9db-dfa6c189ce01?token=YWJGcGRCV098MXxfc09OYmlCajBta0Fkek1qaTJGVlQwUDVsaUswTTlhaDJyd1N1eVZZOF9r'
    },
    'MDTR': { 
        wave: 3, 
        name: 'MD Transport GmbH', 
        email: 'mdtransport.dsp@gmail.com',
        webhook: 'https://hooks.chime.aws/incomingwebhooks/2761601c-8b7a-417f-9dc7-913e203776d5?token=RlZ1UTA0dWJ8MXxvYzdqekJNYUZaM3Bad0hiN1BsQVN2QXV5eTlKSHh5bmR5S0RLTS1Ia0FF'
    },
    'BBGH': { 
        wave: 4, 
        name: 'Baba Trans GmbH', 
        email: 'Dap8-dispatcher@baba-trans.at',
        webhook: 'https://hooks.chime.aws/incomingwebhooks/0299bc4f-a193-42d2-8a28-f2bfeb8fd2e3?token=d1NBSlVjTG18MXxTOU5EU2NCXzlhek5ibktRTkxORDJGVEpBQkxfQVpFNExrdVMtNmxZSHU0'
    },
    'ABFB': { 
        wave: 5, 
        name: 'Albatros FB Express GmbH', 
        email: 'dap8-dispatcher@albatros-express.at',
        webhook: 'https://hooks.chime.aws/incomingwebhooks/cfbdc936-2e02-443a-8606-d55dfb0d500e?token=RjRBWGF3SVN8MXxld19ZMWpaWGd4YzdfcVZuMHRremI1ODVhU2JyaFVaMTh1VWktTzlaMXlV'
    },
    // Alternative names/codes that might appear in data
    'NA Logistik GmbH': { 
        wave: 1, 
        name: 'NA Logistik GmbH', 
        email: 'dap8-dispatcher@nazipaketlogistik.at',
        webhook: 'https://hooks.chime.aws/incomingwebhooks/2fa4330f-08a9-40cd-99e9-355789853f3c?token=STZ6Y1Q5bzN8MXxDd2VualdoSDRJajN4UnBxQVNjSFoyUDJnSWgwUWZPSklBWGVBZGRqTnB3'
    },
    'AllMunA Transportlogistik GmbH': { 
        wave: 2, 
        name: 'AllMunA Transportlogistik GmbH', 
        email: 'dap8-dispatcher@allmuna.at',
        webhook: 'https://hooks.chime.aws/incomingwebhooks/07b12ac5-055e-48d9-a9db-dfa6c189ce01?token=YWJGcGRCV098MXxfc09OYmlCajBta0Fkek1qaTJGVlQwUDVsaUswTTlhaDJyd1N1eVZZOF9r'
    },
    'MD Transport GmbH': { 
        wave: 3, 
        name: 'MD Transport GmbH', 
        email: 'mdtransport.dsp@gmail.com',
        webhook: 'https://hooks.chime.aws/incomingwebhooks/2761601c-8b7a-417f-9dc7-913e203776d5?token=RlZ1UTA0dWJ8MXxvYzdqekJNYUZaM3Bad0hiN1BsQVN2QXV5eTlKSHh5bmR5S0RLTS1Ia0FF'
    },
    'Baba Trans GmbH': { 
        wave: 4, 
        name: 'Baba Trans GmbH', 
        email: 'Dap8-dispatcher@baba-trans.at',
        webhook: 'https://hooks.chime.aws/incomingwebhooks/0299bc4f-a193-42d2-8a28-f2bfeb8fd2e3?token=d1NBSlVjTG18MXxTOU5EU2NCXzlhek5ibktRTkxORDJGVEpBQkxfQVpFNExrdVMtNmxZSHU0'
    },
    'Albatros FB Express GmbH': { 
        wave: 5, 
        name: 'Albatros FB Express GmbH', 
        email: 'dap8-dispatcher@albatros-express.at',
        webhook: 'https://hooks.chime.aws/incomingwebhooks/cfbdc936-2e02-443a-8606-d55dfb0d500e?token=RjRBWGF3SVN8MXxld19ZMWpaWGd4YzdfcVZuMHRremI1ODVhU2JyaFVaMTh1VWktTzlaMXlV'
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

// Update date and time
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    document.getElementById('datetime').textContent = now.toLocaleDateString('en-US', options);
}

// Initialize application
function initializeApp() {
    // Stem data upload
    const stemUploadZone = document.getElementById('stemUploadZone');
    const stemFileInput = document.getElementById('stemFileInput');
    
    stemUploadZone.addEventListener('click', () => stemFileInput.click());
    stemUploadZone.addEventListener('dragover', handleDragOver);
    stemUploadZone.addEventListener('drop', (e) => handleDrop(e, 'stem'));
    stemUploadZone.addEventListener('dragleave', handleDragLeave);
    stemFileInput.addEventListener('change', (e) => handleFileSelect(e, 'stem'));
    
    // Search results upload
    const searchUploadZone = document.getElementById('searchUploadZone');
    const searchFileInput = document.getElementById('searchFileInput');
    
    searchUploadZone.addEventListener('click', () => searchFileInput.click());
    searchUploadZone.addEventListener('dragover', handleDragOver);
    searchUploadZone.addEventListener('drop', (e) => handleDrop(e, 'search'));
    searchUploadZone.addEventListener('dragleave', handleDragLeave);
    searchFileInput.addEventListener('change', (e) => handleFileSelect(e, 'search'));
    
    // DSP search results upload
    const dspSearchFileInput = document.getElementById('dspSearchFileInput');
    document.getElementById('reloadSearchResults').addEventListener('click', () => dspSearchFileInput.click());
    dspSearchFileInput.addEventListener('change', (e) => handleFileSelect(e, 'dsp'));
    
    // Clear data buttons
    document.getElementById('clearStemData').addEventListener('click', clearStemData);
    document.getElementById('clearSearchData').addEventListener('click', clearSearchData);
    
    // Generate buttons
    document.getElementById('generateBarcodes').addEventListener('click', generateBarcodes);
    document.getElementById('generateHVTS').addEventListener('click', generateHVTS);
    document.getElementById('downloadAllHVTS').addEventListener('click', downloadAllHVTS);
    document.getElementById('sendChime').addEventListener('click', sendChimeNotifications);
    
    // Check for cached stem data
    loadCachedStemData();
}

// Drag and drop handlers
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e, type) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].name.endsWith('.csv')) {
        processFile(files[0], type);
    }
}

// File selection handler
function handleFileSelect(e, type) {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.csv')) {
        processFile(file, type);
    }
}

// Process CSV file
function processFile(file, type) {
    // First, read a sample to detect delimiter
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const firstLine = text.split('\n')[0];
        
        // Auto-detect delimiter
        let delimiter = ',';
        if (type === 'stem') {
            delimiter = ';'; // Stem always uses semicolon
        } else {
            // For search files, detect based on first line
            const commaCount = (firstLine.match(/,/g) || []).length;
            const semicolonCount = (firstLine.match(/;/g) || []).length;
            
            if (semicolonCount > commaCount) {
                delimiter = ';';
                console.log('Detected SEMICOLON delimiter for search file');
            } else {
                delimiter = ',';
                console.log('Detected COMMA delimiter for search file');
            }
        }
        
        // Now parse with detected delimiter
        Papa.parse(file, {
            complete: (results) => {
                if (type === 'stem') {
                    processStemData(results.data, file.name);
                } else if (type === 'search') {
                    processSearchData(results.data, file.name);
                } else if (type === 'dsp') {
                    processDSPSearchData(results.data, file.name);
                }
            },
            header: true,
            skipEmptyLines: true,
            delimiter: delimiter
        });
    };
    reader.readAsText(file);
}

// Process stem data
function processStemData(data, filename) {
    stemData = data;
    
    // Cache stem data
    try {
        localStorage.setItem('stemData', JSON.stringify(data));
        localStorage.setItem('stemDataFilename', filename);
        localStorage.setItem('stemDataDate', new Date().toISOString());
    } catch (e) {
        console.log('Unable to cache stem data');
    }
    
    // Update UI
    document.getElementById('stemUploadZone').style.display = 'none';
    document.getElementById('stemFileInfo').style.display = 'block';
    document.querySelector('#stemFileInfo .file-name').textContent = `📄 ${filename}`;
    document.querySelector('#stemFileInfo .file-stats').textContent = `${data.length} locations loaded`;
    document.getElementById('stemStatus').textContent = 'Loaded';
    document.getElementById('stemStatus').classList.add('loaded');
    
    checkEnableButtons();
}

// Load cached stem data
function loadCachedStemData() {
    try {
        const cachedData = localStorage.getItem('stemData');
        const cachedFilename = localStorage.getItem('stemDataFilename');
        const cachedDate = localStorage.getItem('stemDataDate');
        
        if (cachedData && cachedFilename) {
            stemData = JSON.parse(cachedData);
            const date = new Date(cachedDate);
            const dateStr = date.toLocaleDateString();
            
            document.getElementById('stemUploadZone').style.display = 'none';
            document.getElementById('stemFileInfo').style.display = 'block';
            document.querySelector('#stemFileInfo .file-name').textContent = `📄 ${cachedFilename} (Cached from ${dateStr})`;
            document.querySelector('#stemFileInfo .file-stats').textContent = `${stemData.length} locations loaded`;
            document.getElementById('stemStatus').textContent = 'Loaded (Cached)';
            document.getElementById('stemStatus').classList.add('loaded');
            
            checkEnableButtons();
        }
    } catch (e) {
        console.log('Unable to load cached data');
    }
}

// Clear stem data
function clearStemData() {
    stemData = null;
    try {
        localStorage.removeItem('stemData');
        localStorage.removeItem('stemDataFilename');
        localStorage.removeItem('stemDataDate');
    } catch (e) {
        console.log('Unable to clear cache');
    }
    
    document.getElementById('stemUploadZone').style.display = 'block';
    document.getElementById('stemFileInfo').style.display = 'none';
    document.getElementById('stemStatus').textContent = 'Not Loaded';
    document.getElementById('stemStatus').classList.remove('loaded');
    
    checkEnableButtons();
}

// Process search data
function processSearchData(data, filename) {
    console.log('=== Processing Search Data ===');
    console.log('Raw data length:', data.length);
    console.log('First row raw:', data[0]);
    console.log('First row keys:', data[0] ? Object.keys(data[0]) : 'NO DATA');
    
    // Clean the data
    const cleanData = data.map(row => {
        const cleanRow = {};
        for (let key in row) {
            cleanRow[key] = typeof row[key] === 'string' ? row[key].replace(/^"|"$/g, '') : row[key];
        }
        return cleanRow;
    });
    
    searchData = cleanData;
    
    console.log('Clean data length:', searchData.length);
    console.log('First clean row:', searchData[0]);
    console.log('Tracking ID from first row:', searchData[0] ? searchData[0]['Tracking ID'] : 'NO DATA');
    console.log('Sort Zone from first row:', searchData[0] ? searchData[0]['Sort Zone'] : 'NO DATA');
    
    // Update UI
    document.getElementById('searchUploadZone').style.display = 'none';
    document.getElementById('searchFileInfo').style.display = 'block';
    document.querySelector('#searchFileInfo .file-name').textContent = `📄 ${filename}`;
    document.querySelector('#searchFileInfo .file-stats').textContent = `${searchData.length} packages loaded`;
    document.getElementById('searchStatus').textContent = 'Loaded';
    document.getElementById('searchStatus').classList.add('loaded');
    
    checkEnableButtons();
}

// Clear search data
function clearSearchData() {
    searchData = null;
    dspData = null;
    
    document.getElementById('searchUploadZone').style.display = 'block';
    document.getElementById('searchFileInfo').style.display = 'none';
    document.getElementById('searchStatus').textContent = 'Not Loaded';
    document.getElementById('searchStatus').classList.remove('loaded');
    
    checkEnableButtons();
}

// Process DSP search data
function processDSPSearchData(data, filename) {
    console.log('=== Processing DSP Search Data ===');
    console.log('Raw data length:', data.length);
    console.log('First row raw:', data[0]);
    console.log('First row keys:', data[0] ? Object.keys(data[0]) : 'NO DATA');
    
    // Clean the data
    const cleanData = data.map(row => {
        const cleanRow = {};
        for (let key in row) {
            cleanRow[key] = typeof row[key] === 'string' ? row[key].replace(/^"|"$/g, '') : row[key];
        }
        return cleanRow;
    });
    
    dspData = cleanData;
    
    console.log('Clean DSP data length:', dspData.length);
    console.log('First clean row:', dspData[0]);
    console.log('Tracking ID from first row:', dspData[0] ? dspData[0]['Tracking ID'] : 'NO DATA');
    console.log('DSP Name from first row:', dspData[0] ? dspData[0]['DSP Name'] : 'NO DATA');
    console.log('Route Code from first row:', dspData[0] ? dspData[0]['Route Code'] : 'NO DATA');
    
    // Enable HVTS generation if we have DSP data
    if (dspData && dspData.length > 0) {
        document.getElementById('generateHVTS').disabled = false;
        showNotification('DSP data loaded successfully!', 'success');
    }
}

// Check and enable/disable buttons
function checkEnableButtons() {
    const hasStem = stemData && stemData.length > 0;
    const hasSearch = searchData && searchData.length > 0;
    
    document.getElementById('generateBarcodes').disabled = !(hasStem && hasSearch);
    document.getElementById('reloadSearchResults').disabled = !hasSearch;
}

// Helper function to normalize strings for matching
function normalizeString(str) {
    if (!str) return '';
    return str.toString().trim().toLowerCase();
}

// Helper function to find resource ID from stem data with flexible matching
function findResourceId(sortZone, stemData) {
    if (!sortZone || !stemData || stemData.length === 0) {
        console.log(`No stem data or sort zone provided. Using sort zone as-is: "${sortZone}"`);
        return sortZone; // Return original if no match
    }
    
    const normalizedSortZone = normalizeString(sortZone);
    
    // Try to find exact match first (case-insensitive)
    let stemMatch = stemData.find(stem => {
        const stemLabel = normalizeString(stem.label || stem.Label || stem.LABEL || '');
        return stemLabel === normalizedSortZone;
    });
    
    // If no exact match, try partial match
    if (!stemMatch) {
        stemMatch = stemData.find(stem => {
            const stemLabel = normalizeString(stem.label || stem.Label || stem.LABEL || '');
            return stemLabel.includes(normalizedSortZone) || normalizedSortZone.includes(stemLabel);
        });
    }
    
    // If match found, return resourceId (try different possible column names)
    if (stemMatch) {
        const resourceId = stemMatch.resourceId || 
                          stemMatch.ResourceId || 
                          stemMatch.RESOURCEID || 
                          stemMatch.resourceID ||
                          stemMatch['Resource ID'] ||
                          stemMatch['resource id'] ||
                          stemMatch['RESOURCE ID'];
        
        if (resourceId) {
            console.log(`✓ Matched "${sortZone}" to resourceId: "${resourceId}"`);
            return resourceId;
        }
    }
    
    console.warn(`⚠ No resourceId found for sort zone: "${sortZone}" - using sort zone value`);
    return sortZone; // Return original if no resourceId found
}

// Generate barcodes - FIXED VERSION
function generateBarcodes() {
    console.log('=== Generate Barcodes Called ===');
    console.log('stemData exists:', !!stemData);
    console.log('searchData exists:', !!searchData);
    console.log('stemData length:', stemData ? stemData.length : 0);
    console.log('searchData length:', searchData ? searchData.length : 0);
    
    if (!stemData || !searchData) {
        console.error('Missing data!');
        return;
    }
    
    const resultsContainer = document.getElementById('barcodeResults');
    resultsContainer.innerHTML = '';
    processedBarcodes.clear();
    
    // Get unique packages from search data
    const packages = new Map();
    
    console.log('=== Processing Search Data ===');
    searchData.forEach((item, index) => {
        if (index < 3) { // Log first 3 items in detail
            console.log(`Item ${index}:`, item);
            console.log(`  Keys:`, Object.keys(item));
        }
        
        // Try different possible column names for tracking ID
        const trackingId = item['Tracking ID'] || 
                          item['TrackingID'] || 
                          item['tracking id'] || 
                          item['TRACKING ID'] ||
                          item['Tracking Id'] ||
                          item['trackingId'];
        
        // Try different possible column names for sort zone
        const sortZone = item['Sort Zone'] || 
                        item['SortZone'] || 
                        item['sort zone'] || 
                        item['SORT ZONE'] ||
                        item['Sort zone'] ||
                        item['sortZone'] ||
                        '';
        
        if (index < 3) {
            console.log(`  Tracking ID found: "${trackingId}"`);
            console.log(`  Sort Zone found: "${sortZone}"`);
        }
        
        if (trackingId && !packages.has(trackingId)) {
            // Find the resource ID from stem data using improved matching
            const resourceId = findResourceId(sortZone, stemData);
            
            packages.set(trackingId, {
                trackingId: trackingId,
                sortZone: sortZone,
                resourceId: resourceId,
                cluster: item['Cluster'] || item['cluster'] || item['CLUSTER'] || '',
                aisle: item['Aisle'] || item['aisle'] || item['AISLE'] || ''
            });
            
            if (index < 3) {
                console.log(`  ✓ Added to packages map`);
            }
        } else {
            if (index < 3) {
                console.log(`  ✗ NOT added (trackingId: ${!!trackingId}, already exists: ${packages.has(trackingId)})`);
            }
        }
    });
    
    console.log('=== Packages Map Created ===');
    console.log('Total unique packages:', packages.size);
    
    // Convert to array for navigation
    const packagesArray = Array.from(packages.values());
    
    if (packagesArray.length === 0) {
        console.error('No packages found after processing!');
        resultsContainer.innerHTML = '<p style="text-align: center; color: var(--secondary-color);">No packages to process</p>';
        return;
    }
    
    console.log('First 3 packages:', packagesArray.slice(0, 3));
    
    // Store packages for navigation
    window.currentPackages = packagesArray;
    window.currentPackageIndex = 0;
    
    // Create navigation container
    const navContainer = document.createElement('div');
    navContainer.className = 'barcode-navigation';
    navContainer.innerHTML = `
        <button class="nav-btn" id="prevBarcode" onclick="navigateBarcode(-1)">
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/>
            </svg>
        </button>
        <div class="nav-info">
            <span id="barcodeCounter">1 / ${packagesArray.length}</span>
        </div>
        <button class="nav-btn" id="nextBarcode" onclick="navigateBarcode(1)">
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
            </svg>
        </button>
        <button class="btn-primary" id="showAllBarcodes" onclick="toggleShowAll()" style="margin-left: 2rem;">
            <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M3,5H9V11H3V5M5,7V9H7V7H5M11,7H21V9H11V7M11,15H21V17H11V15M5,20L1.5,16.5L2.91,15.09L5,17.17L9.59,12.59L11,14L5,20Z"/>
            </svg>
            Show All
        </button>
    `;
    
    resultsContainer.appendChild(navContainer);
    
    // Create container for single barcode
    const barcodeContainer = document.createElement('div');
    barcodeContainer.id = 'singleBarcodeContainer';
    resultsContainer.appendChild(barcodeContainer);
    
    // Create container for all barcodes (hidden by default)
    const allBarcodesContainer = document.createElement('div');
    allBarcodesContainer.id = 'allBarcodesContainer';
    allBarcodesContainer.style.display = 'none';
    resultsContainer.appendChild(allBarcodesContainer);
    
    // Display first barcode
    displaySingleBarcode(0);
    
    // Store all packages for later use
    packagesArray.forEach(pkg => {
        processedBarcodes.set(pkg.trackingId, pkg);
    });
    
    showNotification(`Generated barcodes for ${packagesArray.length} packages. Use arrows to navigate.`, 'success');
}

// Display single barcode - FIXED VERSION
function displaySingleBarcode(index) {
    const packages = window.currentPackages;
    if (!packages || index < 0 || index >= packages.length) return;
    
    const pkg = packages[index];
    window.currentPackageIndex = index;
    
    const container = document.getElementById('singleBarcodeContainer');
    container.innerHTML = '';
    
    const item = document.createElement('div');
    item.className = 'barcode-item-single';
    
    item.innerHTML = `
        <h3>Tracking: ${pkg.trackingId}</h3>
        <p>Sort Zone: ${pkg.sortZone}</p>
        ${pkg.cluster ? `<p>Cluster: ${pkg.cluster} | Aisle: ${pkg.aisle}</p>` : ''}
        <div class="barcode-images-single">
            <div class="barcode-container-single">
                <div class="qr-wrapper">
                    <canvas id="qr-tracking-current"></canvas>
                </div>
                <div class="barcode-label">QR Tracking</div>
                <div class="barcode-value">${pkg.trackingId}</div>
            </div>
            <div class="barcode-container-single">
                <div class="qr-wrapper">
                    <canvas id="qr-sz-current"></canvas>
                </div>
                <div class="barcode-label">QR Sort Zone</div>
                <div class="barcode-value">${pkg.resourceId}</div>
            </div>
        </div>
    `;
    
    container.appendChild(item);
    
    // Update counter
    document.getElementById('barcodeCounter').textContent = `${index + 1} / ${packages.length}`;
    
    // Update button states
    document.getElementById('prevBarcode').disabled = index === 0;
    document.getElementById('nextBarcode').disabled = index === packages.length - 1;
    
    // Generate QR codes with correct aspect ratio
    setTimeout(() => {
        // QR for tracking ID (AT... number)
        const trackingCanvas = document.getElementById('qr-tracking-current');
        QRCode.toCanvas(trackingCanvas, pkg.trackingId, {
            width: 256,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            },
            errorCorrectionLevel: 'M'
        }, function(error) {
            if (error) console.error('Error generating tracking QR:', error);
        });
        
        // QR for sort zone (Resource ID from stem data)
        const szCanvas = document.getElementById('qr-sz-current');
        QRCode.toCanvas(szCanvas, pkg.resourceId, {
            width: 256,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            },
            errorCorrectionLevel: 'M'
        }, function(error) {
            if (error) console.error('Error generating sort zone QR:', error);
        });
    }, 100);
}

// Navigate through barcodes
function navigateBarcode(direction) {
    const newIndex = window.currentPackageIndex + direction;
    if (newIndex >= 0 && newIndex < window.currentPackages.length) {
        displaySingleBarcode(newIndex);
    }
}

// Toggle between single and all barcodes view
function toggleShowAll() {
    const singleContainer = document.getElementById('singleBarcodeContainer');
    const allContainer = document.getElementById('allBarcodesContainer');
    const showAllBtn = document.getElementById('showAllBarcodes');
    const navBtns = document.querySelectorAll('.nav-btn');
    const counter = document.getElementById('barcodeCounter');
    
    if (allContainer.style.display === 'none') {
        // Switch to "Show All" mode
        singleContainer.style.display = 'none';
        allContainer.style.display = 'block';
        showAllBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
            </svg>
            Show One
        `;
        navBtns.forEach(btn => btn.style.display = 'none');
        counter.style.display = 'none';
        
        // Display all barcodes if not already displayed
        if (allContainer.children.length === 0) {
            displayAllBarcodes();
        }
    } else {
        // Switch back to single view
        singleContainer.style.display = 'block';
        allContainer.style.display = 'none';
        showAllBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M3,5H9V11H3V5M5,7V9H7V7H5M11,7H21V9H11V7M11,15H21V17H11V15M5,20L1.5,16.5L2.91,15.09L5,17.17L9.59,12.59L11,14L5,20Z"/>
            </svg>
            Show All
        `;
        navBtns.forEach(btn => btn.style.display = 'flex');
        counter.style.display = 'block';
    }
}

// Display all barcodes in a grid
function displayAllBarcodes() {
    const packages = window.currentPackages;
    if (!packages) return;
    
    const allContainer = document.getElementById('allBarcodesContainer');
    allContainer.innerHTML = '';
    
    packages.forEach((pkg, index) => {
        const item = document.createElement('div');
        item.className = 'barcode-item-grid';
        
        item.innerHTML = `
            <h3>Tracking: ${pkg.trackingId}</h3>
            <p>Sort Zone: ${pkg.sortZone}</p>
            ${pkg.cluster ? `<p>Cluster: ${pkg.cluster} | Aisle: ${pkg.aisle}</p>` : ''}
            <div class="barcode-images-grid">
                <div class="barcode-container-grid">
                    <canvas id="qr-tracking-${index}"></canvas>
                    <div class="barcode-label">QR Tracking</div>
                    <div class="barcode-value">${pkg.trackingId}</div>
                </div>
                <div class="barcode-container-grid">
                    <canvas id="qr-sz-${index}"></canvas>
                    <div class="barcode-label">QR Sort Zone</div>
                    <div class="barcode-value">${pkg.resourceId}</div>
                </div>
            </div>
        `;
        
        allContainer.appendChild(item);
    });
    
    // Generate all QR codes after a short delay
    setTimeout(() => {
        packages.forEach((pkg, index) => {
            // QR for tracking ID
            const trackingCanvas = document.getElementById(`qr-tracking-${index}`);
            if (trackingCanvas) {
                QRCode.toCanvas(trackingCanvas, pkg.trackingId, {
                    width: 200,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#ffffff'
                    },
                    errorCorrectionLevel: 'M'
                }, function(error) {
                    if (error) console.error(`Error generating tracking QR ${index}:`, error);
                });
            }
            
            // QR for sort zone
            const szCanvas = document.getElementById(`qr-sz-${index}`);
            if (szCanvas) {
                QRCode.toCanvas(szCanvas, pkg.resourceId, {
                    width: 200,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#ffffff'
                    },
                    errorCorrectionLevel: 'M'
                }, function(error) {
                    if (error) console.error(`Error generating sort zone QR ${index}:`, error);
                });
            }
        });
    }, 100);
}

// Make navigation functions available globally
window.navigateBarcode = navigateBarcode;
window.toggleShowAll = toggleShowAll;

// Generate HVTS sheets - FIXED VERSION
function generateHVTS() {
    console.log('=== Generate HVTS Called ===');
    console.log('dspData exists:', !!dspData);
    console.log('dspData length:', dspData ? dspData.length : 0);
    
    if (!dspData || dspData.length === 0) {
        showNotification('No DSP data available. Please reload search results with DSP information.', 'error');
        return;
    }
    
    const resultsContainer = document.getElementById('hvtsResults');
    resultsContainer.innerHTML = '';
    
    // Group packages by DSP
    const dspPackages = new Map();
    
    console.log('=== Processing DSP Data for HVTS ===');
    dspData.forEach((item, index) => {
        if (index < 3) { // Log first 3 items in detail
            console.log(`DSP Item ${index}:`, item);
            console.log(`  Keys:`, Object.keys(item));
        }
        
        const trackingId = item['Tracking ID'] || 
                          item['TrackingID'] || 
                          item['tracking id'] || 
                          item['TRACKING ID'] ||
                          item['Tracking Id'] ||
                          item['trackingId'];
        
        const dspName = item['DSP Name'] || 
                       item['dsp name'] || 
                       item['DSP'] ||
                       item['dspName'] ||
                       item['Dsp Name'];
        
        const routeCode = item['Route Code'] || 
                         item['route code'] || 
                         item['RouteCode'] ||
                         item['routeCode'] ||
                         '';
        
        const orderAmount = item['Order Amount'] || 
                           item['order amount'] || 
                           item['OrderAmount'] ||
                           item['orderAmount'] ||
                           '0';
        
        if (index < 3) {
            console.log(`  Tracking ID: "${trackingId}"`);
            console.log(`  DSP Name: "${dspName}"`);
            console.log(`  Route Code: "${routeCode}"`);
            console.log(`  Order Amount: "${orderAmount}"`);
        }
        
        if (!trackingId || !dspName) {
            if (index < 3) {
                console.log(`  ✗ Skipped (missing trackingId or dspName)`);
            }
            return;
        }
        
        if (!dspPackages.has(dspName)) {
            dspPackages.set(dspName, []);
            console.log(`  ✓ Created new DSP group: "${dspName}"`);
        }
        
        dspPackages.get(dspName).push({
            trackingId: trackingId,
            routeCode: routeCode,
            orderAmount: orderAmount
        });
        
        if (index < 3) {
            console.log(`  ✓ Added to DSP group`);
        }
    });
    
    console.log('=== DSP Packages Map Created ===');
    console.log('Total DSPs:', dspPackages.size);
    console.log('DSP Names:', Array.from(dspPackages.keys()));
    
    if (dspPackages.size === 0) {
        showNotification('No valid DSP packages found. Check that your file has "Tracking ID" and "DSP Name" columns.', 'error');
        return;
    }
    
    // Create HVTS items for each DSP
    dspPackages.forEach((packages, dspName) => {
        console.log(`Creating HVTS for ${dspName} with ${packages.length} packages`);
        
        // Find DSP info
        let dspDetails = dspInfo[dspName];
        
        // If not found by exact name, try to find by code
        if (!dspDetails) {
            for (let key in dspInfo) {
                if (dspInfo[key].name === dspName) {
                    dspDetails = dspInfo[key];
                    break;
                }
            }
        }
        
        // If still not found, create basic info
        if (!dspDetails) {
            dspDetails = {
                wave: 0,
                name: dspName,
                email: 'Not available'
            };
            console.log(`  ⚠ DSP "${dspName}" not in dspInfo database, using defaults`);
        }
        
        const hvtsItem = createHVTSItem(dspDetails, packages);
        resultsContainer.appendChild(hvtsItem);
    });
    
    // Enable Chime notification button and Download All button
    document.getElementById('sendChime').disabled = false;
    document.getElementById('downloadAllHVTS').disabled = false;
    
    showNotification(`Generated HVTS for ${dspPackages.size} DSPs`, 'success');
}

// Create HVTS item
function createHVTSItem(dsp, packages) {
    
    const totalValue = packages.reduce((sum, pkg) => sum + parseFloat(pkg.orderAmount || 0), 0);
    
    const item = document.createElement('div');
    item.className = 'hvts-item';
    
    // Store DSP info in data attributes for the download function
    item.innerHTML = `
        <div class="hvts-info">
            <h4>${dsp.name} ${dsp.wave ? `(Wave ${dsp.wave})` : ''}</h4>
            <p>Packages: ${packages.length} | Total Value: €${totalValue.toFixed(2)}</p>
            <p style="font-size: 0.8rem; color: var(--secondary-color);">${dsp.email}</p>
        </div>
        <button class="download-btn" 
                data-dsp-name="${dsp.name}" 
                data-dsp-email="${dsp.email}"
                data-dsp-wave="${dsp.wave || 0}"
                data-packages='${JSON.stringify(packages)}'
                onclick="downloadHVTSFromButton(this)">
            Download PDF
        </button>
    `;
    
    return item;
}

// Download HVTS PDF from button
function downloadHVTSFromButton(button) {
    const packages = JSON.parse(button.getAttribute('data-packages'));
    const dspName = button.getAttribute('data-dsp-name');
    const dspEmail = button.getAttribute('data-dsp-email');
    const dspWave = button.getAttribute('data-dsp-wave');
    
    downloadHVTS(dspName, dspEmail, dspWave, packages);
}

// Download HVTS PDF - FIXED VERSION
function downloadHVTS(dspName, dspEmail, dspWave, packages) {
    // Create PDF using jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(30, 58, 95);
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    // Show DSP code instead of full name in header
    const dspCode = Object.keys(dspInfo).find(key => dspInfo[key].name === dspName && key.length <= 4) || 'DSP';
    doc.text(`High-Value Transfer Sheet - ${dspCode}`, 105, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 25);
    doc.text(`Total Parcels: ${packages.length}`, 80, 25);
    if (dspWave && dspWave !== '0') {
        doc.text(`Wave: ${dspWave}`, 140, 25);
    }
    
    // DSP Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`DSP: ${dspName}`, 20, 45);
    doc.setFontSize(10);
    doc.text(`Contact: ${dspEmail}`, 20, 52);
    
    // DSP Signature section - larger and more prominent
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('DSP OSM signature and name at dispatch:', 20, 62);
    doc.setFont(undefined, 'normal');
    doc.setDrawColor(0, 0, 0);
    doc.line(20, 70, 190, 70);
    
    // Table headers
    doc.setFillColor(135, 206, 235);
    doc.rect(20, 80, 170, 10, 'F');
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Tracking ID', 25, 87);
    doc.text('Route Code', 100, 87);
    doc.text('Check', 160, 87);
    doc.setFont(undefined, 'normal');
    
    // Table content
    let yPos = 95;
    packages.forEach((pkg, index) => {
        if (yPos > 270) {
            doc.addPage();
            
            // Add header on new page
            doc.setFillColor(135, 206, 235);
            doc.rect(20, 20, 170, 10, 'F');
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.text('Tracking ID', 25, 27);
            doc.text('Route Code', 100, 27);
            doc.text('Check', 160, 27);
            doc.setFont(undefined, 'normal');
            yPos = 35;
        }
        
        if (index % 2 === 0) {
            doc.setFillColor(240, 248, 255);
            doc.rect(20, yPos - 5, 170, 8, 'F');
        }
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(pkg.trackingId, 25, yPos);
        doc.text(pkg.routeCode || '-', 100, yPos);
        doc.rect(160, yPos - 4, 7, 7);
        
        yPos += 10;
    });
    
    // Save PDF
    const fileName = `HVTS_${dspCode}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    showNotification(`PDF downloaded: ${fileName}`, 'success');
}

// Download All HVTS PDFs
function downloadAllHVTS() {
    const resultsContainer = document.getElementById('hvtsResults');
    const dspItems = resultsContainer.querySelectorAll('.hvts-item');
    
    if (dspItems.length === 0) {
        showNotification('No HVTS generated. Please generate HVTS first.', 'error');
        return;
    }
    
    showNotification(`Downloading ${dspItems.length} HVTS PDFs...`, 'success');
    
    // Download each PDF with a small delay to avoid browser blocking
    let downloadCount = 0;
    dspItems.forEach((item, index) => {
        setTimeout(() => {
            const downloadBtn = item.querySelector('.download-btn');
            if (downloadBtn) {
                const packages = JSON.parse(downloadBtn.getAttribute('data-packages'));
                const dspName = downloadBtn.getAttribute('data-dsp-name');
                const dspEmail = downloadBtn.getAttribute('data-dsp-email');
                const dspWave = downloadBtn.getAttribute('data-dsp-wave');
                
                downloadHVTS(dspName, dspEmail, dspWave, packages);
                downloadCount++;
                
                // Show final notification after last download
                if (downloadCount === dspItems.length) {
                    showNotification(`✅ Downloaded all ${downloadCount} HVTS PDFs!`, 'success');
                }
            }
        }, index * 500); // 500ms delay between each download
    });
}

// Send Chime notifications
async function sendChimeNotifications() {
    const resultsContainer = document.getElementById('hvtsResults');
    const dspItems = resultsContainer.querySelectorAll('.hvts-item');
    
    if (dspItems.length === 0) {
        showNotification('No HVTS generated. Please generate HVTS first.', 'error');
        return;
    }
    
    let successCount = 0;
    let failCount = 0;
    const notifications = [];
    
    // Gather DSP information
    dspItems.forEach(item => {
        const dspName = item.querySelector('h4').textContent;
        const packageInfo = item.querySelector('p').textContent;
        
        // Extract just the DSP name without wave
        const cleanName = dspName.replace(/\s*\(Wave \d+\)/, '');
        
        // Find DSP info
        let dspData = null;
        for (let key in dspInfo) {
            if (dspInfo[key].name === cleanName) {
                dspData = dspInfo[key];
                break;
            }
        }
        
        if (dspData && dspData.webhook) {
            notifications.push({
                dsp: dspData.name,
                webhook: dspData.webhook,
                info: packageInfo
            });
        }
    });
    
    // Send notifications
    showNotification('Sending Chime notifications...', 'success');
    
    for (const notif of notifications) {
        const message = {
            Content: `📦 High-Value Package Alert for ${notif.dsp}\n\n${notif.info}\n\nPlease check your HVTS sheet for details.\n\nDate: ${new Date().toLocaleString()}`
        };
        
        try {
            const response = await fetch(notif.webhook, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
                mode: 'no-cors' // Required for Chime webhooks
            });
            
            // With no-cors, we can't read the response, so we assume success
            successCount++;
            console.log(`Notification sent to ${notif.dsp}`);
        } catch (error) {
            console.error(`Failed to send notification to ${notif.dsp}:`, error);
            failCount++;
        }
    }
    
    // Show final status
    const statusMessage = failCount === 0 
        ? `✅ Successfully sent Chime notifications to ${successCount} DSPs!`
        : `⚠️ Sent ${successCount} notifications, ${failCount} failed.`;
    
    showNotification(statusMessage, failCount === 0 ? 'success' : 'warning');
    
    // Disable send button temporarily
    document.getElementById('sendChime').disabled = true;
    setTimeout(() => {
        document.getElementById('sendChime').disabled = false;
    }, 30000); // Re-enable after 30 seconds
}

// Show notification
function showNotification(message, type) {
    const statusDiv = document.getElementById('notificationStatus');
    statusDiv.textContent = message;
    statusDiv.className = `notification-status show ${type}`;
    
    setTimeout(() => {
        statusDiv.classList.remove('show');
    }, 5000);
}

// Make downloadHVTS available globally
window.downloadHVTS = downloadHVTS;
window.downloadHVTSFromButton = downloadHVTSFromButton;