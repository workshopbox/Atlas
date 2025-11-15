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
        webhook: 'https://hooks.chime.aws/incomingwebhooks/07b12ac5-055e-48d9-a9db-dfa6c189ce01?token=YWJGcGRCV298MXxfc09OYmlCajBta0Fkek1qaTJGVlQwUDVsaUswTTlhaDJyd1N1eVZZOF9r'
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
        delimiter: ';'
    });
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
            document.querySelector('#stemFileInfo .file-name').textContent = `📄 ${cachedFilename} (Cached)`;
            document.querySelector('#stemFileInfo .file-stats').textContent = `${stemData.length} locations loaded - Cached on ${dateStr}`;
            document.getElementById('stemStatus').textContent = 'Loaded (Cached)';
            document.getElementById('stemStatus').classList.add('loaded');
            
            checkEnableButtons();
        }
    } catch (e) {
        console.log('Unable to load cached stem data');
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
    // Parse different CSV formats (with quotes and semicolons or regular)
    if (data.length > 0 && Object.keys(data[0]).length === 1) {
        // Unfiltered format with quotes
        const cleanData = [];
        data.forEach(row => {
            const firstKey = Object.keys(row)[0];
            const values = row[firstKey].split('","').map(v => v.replace(/^"|"$/g, ''));
            
            if (values.length > 1) {
                const obj = {};
                const headers = firstKey.split(',').map(h => h.replace(/^"|"$/g, ''));
                headers.forEach((header, index) => {
                    obj[header] = values[index] || '';
                });
                cleanData.push(obj);
            }
        });
        searchData = cleanData;
    } else {
        searchData = data;
    }
    
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
    // Parse different CSV formats
    if (data.length > 0 && Object.keys(data[0]).length === 1) {
        // Unfiltered format with quotes
        const cleanData = [];
        data.forEach(row => {
            const firstKey = Object.keys(row)[0];
            const values = row[firstKey].split('","').map(v => v.replace(/^"|"$/g, ''));
            
            if (values.length > 1) {
                const obj = {};
                const headers = firstKey.split(',').map(h => h.replace(/^"|"$/g, ''));
                headers.forEach((header, index) => {
                    obj[header] = values[index] || '';
                });
                cleanData.push(obj);
            }
        });
        dspData = cleanData;
    } else {
        dspData = data;
    }
    
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

// Generate barcodes
function generateBarcodes() {
    if (!stemData || !searchData) return;
    
    const resultsContainer = document.getElementById('barcodeResults');
    resultsContainer.innerHTML = '';
    processedBarcodes.clear();
    
    // Get unique packages from search data
    const packages = new Map();
    
    searchData.forEach(item => {
        const trackingId = item['Tracking ID'];
        const sortZone = item['Sort Zone'] || item['Manifest Route Code'] || 'Unknown';
        
        if (trackingId && !packages.has(trackingId)) {
            packages.set(trackingId, {
                trackingId: trackingId,
                sortZone: sortZone,
                cluster: item['Cluster'] || '',
                aisle: item['Aisle'] || ''
            });
        }
    });
    
    // Convert to array for navigation
    const packagesArray = Array.from(packages.values());
    
    if (packagesArray.length === 0) {
        resultsContainer.innerHTML = '<p style="text-align: center; color: var(--secondary-color);">No packages to process</p>';
        return;
    }
    
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
    `;
    
    resultsContainer.appendChild(navContainer);
    
    // Create container for single barcode
    const barcodeContainer = document.createElement('div');
    barcodeContainer.id = 'singleBarcodeContainer';
    resultsContainer.appendChild(barcodeContainer);
    
    // Display first barcode
    displaySingleBarcode(0);
    
    // Store all packages for later use
    packagesArray.forEach(pkg => {
        processedBarcodes.set(pkg.trackingId, pkg);
    });
    
    showNotification(`Generated barcodes for ${packagesArray.length} packages. Use arrows to navigate.`, 'success');
}

// Display single barcode
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
                <div class="qr-wrapper" id="qr-tracking-wrapper">
                    <canvas id="qr-tracking-current"></canvas>
                </div>
                <div class="barcode-label">QR Tracking</div>
                <div class="barcode-value">${pkg.trackingId}</div>
            </div>
            <div class="barcode-container-single">
                <div class="qr-wrapper" id="qr-sz-wrapper">
                    <canvas id="qr-sz-current"></canvas>
                </div>
                <div class="barcode-label">QR Sort Zone</div>
                <div class="barcode-value">${pkg.sortZone}</div>
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
        // QR for tracking ID - solid black
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
            if (!error) {
                // Ensure square aspect ratio
                trackingCanvas.style.width = '200px';
                trackingCanvas.style.height = '200px';
            }
        });
        
        // QR for sort zone - solid black
        const szCanvas = document.getElementById('qr-sz-current');
        QRCode.toCanvas(szCanvas, pkg.sortZone, {
            width: 256,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            },
            errorCorrectionLevel: 'M'
        }, function(error) {
            if (!error) {
                // Ensure square aspect ratio
                szCanvas.style.width = '200px';
                szCanvas.style.height = '200px';
            }
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

// Make navigation functions available globally
window.navigateBarcode = navigateBarcode;

// Generate HVTS sheets
function generateHVTS() {
    if (!dspData || dspData.length === 0) {
        showNotification('No DSP data available. Please reload search results with DSP information.', 'error');
        return;
    }
    
    const resultsContainer = document.getElementById('hvtsResults');
    resultsContainer.innerHTML = '';
    
    // Group packages by DSP
    const dspPackages = new Map();
    
    dspData.forEach(item => {
        const dspName = item['DSP Name'] || item['DSP'];
        const trackingId = item['Tracking ID'];
        const route = item['Route Code'] || item['Manifest Route Code'] || '';
        
        if (dspName && trackingId) {
            if (!dspPackages.has(dspName)) {
                dspPackages.set(dspName, []);
            }
            
            dspPackages.get(dspName).push({
                trackingId: trackingId,
                route: route,
                orderAmount: item['Order Amount'] || '0'
            });
        }
    });
    
    // Generate HVTS for each DSP
    dspPackages.forEach((packages, dspCode) => {
        const hvtsItem = createHVTSItem(dspCode, packages);
        resultsContainer.appendChild(hvtsItem);
    });
    
    if (dspPackages.size === 0) {
        resultsContainer.innerHTML = '<p style="text-align: center; color: var(--secondary-color);">No DSP assignments found</p>';
    } else {
        document.getElementById('sendChime').disabled = false;
        showNotification(`Generated HVTS for ${dspPackages.size} DSPs`, 'success');
    }
}

// Create HVTS item
function createHVTSItem(dspCode, packages) {
    // Try to find DSP info by code or name
    let dsp = dspInfo[dspCode];
    
    // If not found, try to find by partial match
    if (!dsp) {
        for (let key in dspInfo) {
            if (key.toLowerCase().includes(dspCode.toLowerCase()) || 
                dspCode.toLowerCase().includes(key.toLowerCase())) {
                dsp = dspInfo[key];
                break;
            }
        }
    }
    
    // If still not found, create default
    if (!dsp) {
        dsp = { name: dspCode, email: 'dap8-dispatcher@amazon.com', wave: 0 };
    }
    
    const totalValue = packages.reduce((sum, pkg) => sum + parseFloat(pkg.orderAmount || 0), 0);
    
    const item = document.createElement('div');
    item.className = 'hvts-item';
    
    // Store DSP info in data attributes for the download function
    item.innerHTML = `
        <div class="hvts-info">
            <h4>${dsp.name} ${dsp.wave ? `(Wave ${dsp.wave})` : ''}</h4>
            <p>Packages: ${packages.length} | Total Value: €${totalValue.toFixed(2)}</p>
            <p style="font-size: 0.8rem; color: var(--ice-blue);">${dsp.email}</p>
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

// Download HVTS PDF
function downloadHVTS(dspName, dspEmail, dspWave, packages) {
    // Create PDF using jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(30, 58, 95);
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    // Show DSP code instead of STSA
    const dspCode = Object.keys(dspInfo).find(key => dspInfo[key].name === dspName) || 'DSP';
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
    doc.text('Tracking ID', 25, 87);
    doc.text('Route', 100, 87);
    doc.text('Check', 150, 87);
    
    // Table content
    let yPos = 95;
    packages.forEach((pkg, index) => {
        if (yPos > 270) {
            doc.addPage();
            
            // Add header on new page
            doc.setFillColor(135, 206, 235);
            doc.rect(20, 20, 170, 10, 'F');
            doc.setFontSize(11);
            doc.text('Tracking ID', 25, 27);
            doc.text('Route', 100, 27);
            doc.text('Check', 150, 27);
            yPos = 35;
        }
        
        if (index % 2 === 0) {
            doc.setFillColor(240, 248, 255);
            doc.rect(20, yPos - 5, 170, 8, 'F');
        }
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(pkg.trackingId, 25, yPos);
        doc.text(pkg.route || '-', 100, yPos);
        doc.rect(150, yPos - 4, 7, 7);
        
        yPos += 10;
    });
    
    // Save PDF
    const fileName = `HVTS_${dspCode}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    showNotification(`PDF downloaded: ${fileName}`, 'success');
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
window.navigateBarcode = navigateBarcode;