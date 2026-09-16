/* =======================================================
   🏆 THE DOLLAR MILLION SPOT - OFFICIAL JAVA-SCRIPT 🏆
   ======================================================= */

// १. लीगल पॉपअप ओपन और क्लोज करने का फिक्स
window.openLegalModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
    }
};

window.closeLegalModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
};

// ESC की दबाने पर मोडल बंद हो जाएगा
window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.legal-modal-overlay, .modal-overlay');
        modals.forEach(m => m.style.display = 'none');
    }
});

// Disable right-click menu everywhere on the page
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

// LIVE CURRENCY FETCHING API & GLOBAL VARIABLES
let liveUsdToInrRate = 95.9159; // 🚨 आज का असली लाइव रेट सेट किया ताकि इंटरनेट ब्लॉक होने पर भी सटीक दिखे

async function fetchLiveCurrencyRates() {
    try {
        const response = await fetch('https://exchangerate-api.com');
        const data = await response.json();
        if (data && data.rates && data.rates.INR) {
            liveUsdToInrRate = data.rates.INR;
        }
    } catch (error) {
        console.log('Using default currency rate');
    }
    updateDynamicPrices();
}

function updateDynamicPrices() {
    const fixedUsdPremium = 1050;
    const calculatedInrPremium = Math.round(fixedUsdPremium * liveUsdToInrRate);

    const premiumInrEl = document.getElementById('premiumInrPrice');
    if (premiumInrEl) premiumInrEl.innerText = `₹${calculatedInrPremium.toLocaleString('en-IN')}.00`;

    const premiumUsdEl = document.getElementById('premiumUsdPrice');
    if (premiumUsdEl) premiumUsdEl.innerText = `$${fixedUsdPremium.toLocaleString('en-US')}.00`;

    const btnPremTextEl = document.getElementById('btnPremiumText');
    if (btnPremTextEl) btnPremTextEl.innerText = `$${fixedUsdPremium.toLocaleString('en-US')}.00`;

    const calculatedInrNormal = Math.round(liveUsdToInrRate);
    const btnNormalInrEl = document.getElementById('btnNormalInr');
    if (btnNormalInrEl) btnNormalInrEl.innerText = `₹${calculatedInrNormal}`;

    const btnNormalWrapper = document.querySelector('.btn-buy-purple');
    if (btnNormalWrapper) btnNormalWrapper.innerHTML = `Buy Your Space Now - $1 (₹${calculatedInrNormal}) &rarr;`;

    updateLiveSpotsCounter(); // 🚨 अब यह फंक्शन सेफली कॉल होगा
}

// 🚨 महा-फिक्स: कंसोल के उस लाल एरर को जड़ से खत्म करने के लिए नया काउंटर फंक्शन जोड़ा
function updateLiveSpotsCounter() {
    const counterDisplay = document.getElementById('liveSpotsCounter') || document.getElementById('normalCounterDisplay');
    if (counterDisplay) {
        counterDisplay.innerText = `${currentNormalSpotsFilled.toLocaleString()} / ${MAX_NORMAL_SPOTS.toLocaleString()} Spots Filled`;
    }
}

// TOTAL 500 PREMIUM SPOTS DATABASE
const totalPremiumSpotsCount = 500;
let allSpots = [];

// एप्पल और टेस्ला वाले शुरुआती बॉक्स को भी बाकी सब की तरह पूरी तरह खाली और अवेलेबल रखा
for (let i = 1; i <= totalPremiumSpotsCount; i++) {
    allSpots.push({ rank: i, isBought: false, isUserOwned: false });
}

let currentBatchIndex = 0;
let timeLeft = 25;

const pillarsGrid = document.getElementById('pillarsGrid');
const timerText = document.getElementById('timerText');
const dotsContainer = document.getElementById('dotsContainer');

function renderBoard() {
    if (!pillarsGrid) return;
    pillarsGrid.innerHTML = '';

    const boughtSpots = allSpots.filter(s => s.isBought);
    const boughtCount = boughtSpots.length;
    const spotsLeft = totalPremiumSpotsCount - boughtCount;

    const liveSeatsText = document.getElementById('liveSeatsText');
    const btnBuyGold = document.querySelector('.btn-buy-gold');

    if (spotsLeft <= 0) {
        if (liveSeatsText) liveSeatsText.innerText = 'SEAT FULL';
        if (btnBuyGold) {
            btnBuyGold.innerText = 'SOLD OUT (ALL SPOTS BOOKED)';
            btnBuyGold.style.pointerEvents = 'none';
        }
    } else {
        if (liveSeatsText) liveSeatsText.innerText = `${spotsLeft} Seats Left`;
    }

    const maxActiveBatches = Math.max(1, Math.ceil(boughtCount / 5));
    if (currentBatchIndex >= maxActiveBatches) {
        currentBatchIndex = 0;
    }

    const batchStartIndex = currentBatchIndex * 5;

    for (let slotIndex = 0; slotIndex < 5; slotIndex++) {
        const itemIndex = batchStartIndex + slotIndex;
        const currentBatchItem = boughtSpots[itemIndex];
        const card = document.createElement('div');
        card.className = 'pillar-3d';

        if (currentBatchItem) {
            card.innerHTML = `
                <div style="position:relative; width:100%; height:100%; background: linear-gradient(135deg, #FBF4DB 0%, #EEDC9A 50%, #D4BE75 100%); border:2px solid #ffd700; border-radius:12px; display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 15px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); box-sizing: border-box;">
                    <div style="position:absolute; top:8px; left:10px; font-size:11px; color:#aaa;">#${currentBatchItem.rank}</div>
                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; flex-grow:1; width:100%;">
                        <a href="${currentBatchItem.url || '#'}" target="_blank" style="display:flex; align-items:center; justify-content:center; height:95px; margin-bottom:10px; pointer-events:auto;">
                          <img src="${currentBatchItem.logo}" alt="${currentBatchItem.name}" style="max-width:100px; max-height:100px; width:auto; height:auto; object-fit:contain;">
                        </a>
                       <div style="font-size:18px; font-weight:900; color:#000; text-shadow: 0px 1px 2px rgba(255, 215, 0, 0.8), 0px 0px 8px rgba(255, 235, 150, 0.6); text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; width:100%;">${currentBatchItem.name}</div>
                    </div>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div style="width:100%; height:100%; background:#161616; border:2px dashed #333; border-radius:12px; display:flex; flex-direction:column; align-items:center; justify-content:center; opacity:0.5;">
                    <div style="font-size:22px; color:#555;">⭐</div>
                    <div style="color:#666; font-size:11px; margin-top:5px;">Available Spot</div>
                </div>
            `;
        }

        pillarsGrid.appendChild(card);
    }

    updateDotsUI(maxActiveBatches);
}

function updateDotsUI(maxBatches) {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < maxBatches; i++) {
        const dot = document.createElement('span');
        dot.className = `s-dot ${i === currentBatchIndex ? 'active' : ''}`;
        dotsContainer.appendChild(dot);
    }
}

// जादुई क्रम फिक्स: पहले रेंडर बोर्ड चलेगा, फिर लाइव प्राइस कैलकुलेट होगी
renderBoard();
fetchLiveCurrencyRates();

if (timerText) {
    setInterval(() => {
        timeLeft--;
        if (timeLeft < 0) {
            timeLeft = 25;
            const boughtCount = allSpots.filter(s => s.isBought).length;
            const maxBatches = Math.max(1, Math.ceil(boughtCount / 5));
            currentBatchIndex = (currentBatchIndex + 1) % maxBatches;
            renderBoard();
        }
        timerText.innerText = `${timeLeft}s`;
    }, 1000);
}
// MODAL CONTROLS & BUY BUTTON LOGIC
let currentBoardType = 'premium';
function openBuyModal(type) {
    if (type === 'premium') {
        const boughtCount = allSpots.filter(s => s.isBought).length;
        if (boughtCount >= totalPremiumSpotsCount) {
            alert('Sorry, all 500 Premium spots are full!');
            return;
        }
    } else {
        if (currentNormalSpotsFilled >= MAX_NORMAL_SPOTS) {
            alert('Sorry, all 10,000,000 Normal spots are full!');
            return;
        }
    }

    currentBoardType = type;
    const modalTitle = document.getElementById('modalTitle');
    const brandNameWrapper = document.getElementById('brandNameWrapper');
    const btnPaySubmit = document.getElementById('btnPaySubmit');
    const modalPriceDisplay = document.getElementById('modalPriceDisplay');

    if (type === 'premium') {
        const calculatedInrPremium = Math.round(1050 * liveUsdToInrRate);
        if (modalTitle) modalTitle.innerText = 'BUY PREMIUM SPOT';
        if (modalPriceDisplay) modalPriceDisplay.innerText = `$1,050.00 (~₹${calculatedInrPremium.toLocaleString('en-IN')})`;
        if (brandNameWrapper) brandNameWrapper.style.display = 'block';
        if (btnPaySubmit) btnPaySubmit.innerText = `Pay ₹${calculatedInrPremium.toLocaleString('en-IN')} ($1,050) & Publish`;
    } else {
        const calculatedInrNormal = Math.round(liveUsdToInrRate);
        if (modalTitle) modalTitle.innerText = 'BUY $1 SPOT';
        if (modalPriceDisplay) modalPriceDisplay.innerText = `$1.00 (~₹${calculatedInrNormal})`;
        if (brandNameWrapper) brandNameWrapper.style.display = 'block';
        if (btnPaySubmit) btnPaySubmit.innerText = `$1.00 (₹${calculatedInrNormal}) & Publish`;
    }

    const buyModal = document.getElementById('buyModal');
    if (buyModal) buyModal.style.display = 'flex';
}

function closeBuyModal() {
    const buyModal = document.getElementById('buyModal');
    if (buyModal) buyModal.style.display = 'none';
}

// EVENT DELEGATION FOR BUY SUBMIT BUTTON
document.addEventListener('click', (event) => {
    if (event.target && event.target.id === 'btnPaySubmit') {
        event.preventDefault();

        const fileInput = document.querySelector('input[type="file"]');
        const urlInput = document.getElementById('userTargetUrl') ||
            document.getElementById('targetUrlInput') ||
            document.getElementById('urlInput') ||
            document.getElementById('targetUrl') ||
            document.querySelector('input[name*="url"]') ||
            document.querySelector('input[type="url"]');
        const brandInput = document.querySelector('#brandNameWrapper input') || document.querySelector('input[type="text"]');

        let targetUrl = '';
        if (urlInput && urlInput.value.trim() !== '') {
            targetUrl = urlInput.value.trim();
        } else {
            alert('कृपया अपनी वेबसाइट या सोशल मीडिया (जैसे इंस्टाग्राम) का सही लिंक दर्ज करें!');
            return;
        }

        if (targetUrl && !targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = 'https://' + targetUrl;
        }

        const brandName = brandInput && brandInput.value.trim() !== '' ? brandInput.value.trim() : 'MY BRAND';

        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert('Please select/upload an image or logo from your gallery first!');
            return;
        }

        const imageFile = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageDataUrl = e.target.result;
            if (currentBoardType === 'normal') {
                addNewUserNormalSpot(brandName, imageDataUrl, targetUrl);
            } else {
                addNewUserPremiumSpot(brandName, imageDataUrl, targetUrl);
            }
        };
        reader.readAsDataURL(imageFile);
    }
});

// ================= THREE.JS 10M SPOTS ENGINE =================
const MAX_NORMAL_SPOTS = 10000000;
let currentNormalSpotsFilled = 0;
let spaceScene, spaceCamera, spaceRenderer;
let spaceLogoQueue = [];
let activeMeshPool = [];
const MAX_ACTIVE_MESHES = 120;
let starField;
let queuePointer = 0;

function setupNormalCounterUI() {
    const gridContainer = document.getElementById('pixelBoardGrid');
    if (!gridContainer) return;

    let existingSearchBox = document.getElementById('spaceSearchWrapper');
    if (!existingSearchBox) {
        const searchHTML = `<div id="spaceSearchWrapper" style="display:flex; justify-content:center; align-items:center; padding:10px; background:rgba(0,0,0,0.6); border-bottom:1px solid #333; gap:10px; width:100%; box-sizing:border-box;"> <input type="text" id="spaceSearchInput" placeholder="🔍 Search logo / brand name in Space..." style="width:280px; padding:8px 12px; border-radius:8px; border:1px solid #ffd700; background:#111; color:#fff; font-size:14px; outline:none;"> <button id="spaceSearchBtn" style="padding:8px 18px; background:linear-gradient(135deg, #FFD700 0%, #FFA500 100%); border:none; border-radius:8px; color:#000; font-weight:bold; cursor:pointer; font-size:14px;">Search</button> </div>`;
        gridContainer.insertAdjacentHTML('beforebegin', searchHTML);
    }

    gridContainer.innerHTML = '';
    gridContainer.style.position = 'relative';
    gridContainer.style.overflow = 'hidden';
    gridContainer.style.width = '100%';
    gridContainer.style.height = '450px';

    spaceScene = new THREE.Scene();
    spaceCamera = new THREE.PerspectiveCamera(60, gridContainer.clientWidth / gridContainer.clientHeight, 0.1, 1500);
    spaceCamera.position.z = 5;

    spaceRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    spaceRenderer.setSize(gridContainer.clientWidth, gridContainer.clientHeight);
    spaceRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    gridContainer.appendChild(spaceRenderer.domElement);

    // STARFIELD
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 1200;
    const starPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
        starPositions[i] = (Math.random() - 0.5) * 400;
        starPositions[i + 1] = (Math.random() - 0.5) * 400;
        starPositions[i + 2] = (Math.random() - 0.5) * 1000;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.8, transparent: true, opacity: 0.8 });
    starField = new THREE.Points(starsGeometry, starsMaterial);
    spaceScene.add(starField);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';

    for (let i = 0; i < MAX_ACTIVE_MESHES; i++) {
        const planeGeo = new THREE.PlaneGeometry(2.0, 2.0);
        const planeMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        const sideMultiplier = Math.random() < 0.5 ? -1 : 1;
        const posX = sideMultiplier * (4.0 + Math.random() * 4.0);
        const posY = (Math.random() - 0.5) * 6.0;
        const initialZ = -800 - (i * 35);
        mesh.position.set(posX, posY, initialZ);
        mesh.userData = { brandName: '', targetUrl: '', hasData: false, isPaused: false, resumeTimeout: null };
        spaceScene.add(mesh);
        activeMeshPool.push(mesh);
    }

    function animateSpace() {
        requestAnimationFrame(animateSpace);
        if (starField) {
            const positions = starField.geometry.attributes.position.array;
            for (let i = 2; i < positions.length; i += 3) {
                positions[i] += 0.15;
                if (positions[i] > 100) positions[i] = -800;
            }
            starField.geometry.attributes.position.needsUpdate = true;
        }

        const moveSpeed = 0.12;
        for (let i = 0; i < activeMeshPool.length; i++) {
            let mesh = activeMeshPool[i];
            if (!mesh.userData.hasData) continue;
            if (!mesh.userData.isPaused) {
                mesh.position.z += moveSpeed;
            }
            if (mesh.position.z > 10) {
                mesh.position.z = -800;
                mesh.userData.isPaused = false;
                const sideMultiplier = Math.random() < 0.5 ? -1 : 1;
                mesh.position.x = sideMultiplier * (4.0 + Math.random() * 4.0);
                mesh.position.y = (Math.random() - 0.5) * 6.0;
                if (spaceLogoQueue.length > 0) {
                    const nextItem = spaceLogoQueue[queuePointer];
                    queuePointer = (queuePointer + 1) % spaceLogoQueue.length;
                    mesh.userData.brandName = nextItem.name;
                    mesh.userData.targetUrl = nextItem.url;
                    textureLoader.load(nextItem.logo, (tex) => {
                        tex.colorSpace = THREE.SRGBColorSpace;
                        mesh.material.map = tex;
                        mesh.material.opacity = 1.0;
                        mesh.material.needsUpdate = true;
                    });
                }
            }
        }
        spaceRenderer.render(spaceScene, spaceCamera);
    }
    animateSpace();

    window.addEventListener('resize', () => {
        if (!gridContainer || !spaceRenderer || !spaceCamera) return;
        spaceCamera.aspect = gridContainer.clientWidth / gridContainer.clientHeight;
        spaceCamera.updateProjectionMatrix();
        spaceRenderer.setSize(gridContainer.clientWidth, gridContainer.clientHeight);
    });

    // --- 🚨 सर्च बॉक्स का असली 100% वर्किंग लॉजिक 🚨 ---
    setTimeout(() => {
        const searchBtn = document.getElementById('spaceSearchBtn');
        const searchInput = document.getElementById('spaceSearchInput');
        if (searchBtn && searchInput) {
            const executeSearch = () => {
                const query = searchInput.value.trim().toLowerCase();
                if (!query) {
                    alert('Please enter a brand name to search!');
                    return;
                }
                let modal = activeMeshPool.find(m => m.userData.hasData && m.userData.brandName && m.userData.brandName.toLowerCase().includes(query));
                if (modal) {
                    document.getElementById('searchResultLogo').src = modal.material.map.image.src || '';
                    document.getElementById('searchResultLogo').style.display = 'block';
                    document.getElementById('searchResultBrandName').innerText = modal.userData.brandName;
                    document.getElementById('searchResultLink').href = modal.userData.targetUrl || '#';
                    document.getElementById('searchResultModal').style.display = 'flex';
                } else {
                    let foundQueueItem = spaceLogoQueue.find(item => item.name && item.name.toLowerCase().includes(query));
                    if (foundQueueItem) {
                        document.getElementById('searchResultLogo').src = foundQueueItem.logo || '';
                        document.getElementById('searchResultLogo').style.display = 'block';
                        document.getElementById('searchResultBrandName').innerText = foundQueueItem.name;
                        document.getElementById('searchResultLink').href = foundQueueItem.url || '#';
                        document.getElementById('searchResultModal').style.display = 'flex';
                    } else {
                        alert('इस नाम से कोई स्पॉट नहीं मिला! कृपया सही नाम दर्ज करें।');
                    }
                }
            };
            searchBtn.onclick = executeSearch;
            searchInput.onkeydown = (e) => {
                if (e.key === 'Enter') executeSearch();
            };
        }
    }, 500);
}

function updateLiveSpotsCounter() {
    const counterDisplay = document.getElementById('liveSpotsCounter');
    if (counterDisplay) {
        counterDisplay.innerText = `${currentNormalSpotsFilled.toLocaleString()} / ${MAX_NORMAL_SPOTS.toLocaleString()} Spots Filled`;
    }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setupNormalCounterUI();
} else {
    window.addEventListener('DOMContentLoaded', setupNormalCounterUI);
}

function addNewUserNormalSpot(brandName, logoDataUrl, targetUrl) {
    if (currentNormalSpotsFilled >= MAX_NORMAL_SPOTS) {
        alert('Seat Full! All 10,000,000 spots are booked.');
        return;
    }
    currentNormalSpotsFilled++;
    updateLiveSpotsCounter();
    closeBuyModal();
    spaceLogoQueue.push({ name: brandName, logo: logoDataUrl, url: targetUrl });

    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';
    textureLoader.load(logoDataUrl, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        const targetMesh = activeMeshPool.find(m => !m.userData.hasData) || activeMeshPool[Math.floor(Math.random() * activeMeshPool.length)];
        if (targetMesh) {
            targetMesh.material.map = texture;
            targetMesh.material.opacity = 1.0;
            targetMesh.material.needsUpdate = true;
            targetMesh.userData.brandName = brandName;
            targetMesh.userData.targetUrl = targetUrl;
            targetMesh.userData.hasData = true;
            targetMesh.userData.isPaused = false;
            targetMesh.position.z = -50;
            const sideMultiplier = Math.random() < 0.5 ? -1 : 1;
            targetMesh.position.x = sideMultiplier * (4.0 + Math.random() * 4.0);
            targetMesh.position.y = (Math.random() - 0.5) * 6.0;
        }
    });

    if (currentNormalSpotsFilled >= MAX_NORMAL_SPOTS) {
        const buyPurpleBtn = document.querySelector('.btn-buy-purple');
        if (buyPurpleBtn) {
            buyPurpleBtn.innerText = "SEAT FULL - SOLD OUT";
            buyPurpleBtn.style.background = "#555";
            buyPurpleBtn.style.cursor = "not-allowed";
        }
    }
}

// 🚨 करन भाई का असली 'बैच-लॉक और लाइव रीसेट' प्रीमियम बाय इंजन 🚨
function addNewUserPremiumSpot(brandName, logoDataUrl, targetUrl) {
    const emptySpotIndex = allSpots.findIndex(s => !s.isBought);
    if (emptySpotIndex === -1) {
        alert('Sorry, all 500 Premium spots are full!');
        closeBuyModal();
        return;
    }

    const assignedRank = emptySpotIndex + 1;

    // १. डेटाबेस में नया खरीदा हुआ कार्ड सेव करना
    allSpots[emptySpotIndex] = {
        rank: assignedRank,
        isBought: true,
        isUserOwned: true,
        name: brandName,
        logo: logoDataUrl,
        url: targetUrl
    };

    closeBuyModal();

    // 🚨 २. असली बैच-लॉक लॉजिक: खरीदे गए रैंक के हिसाब से सीधे सही ५ कार्ड का बैच ढूंढना
    // उदाहरण: अगर रैंक 47 है, तो (47-1)/5 = 9.2, Math.floor से यह सीधे 9वां बैच (यानी 46-50) लॉक कर देगा
    currentBatchIndex = Math.floor((assignedRank - 1) / 5);

    // 🚨 ३. टाइमर को तुरंत फिर से २५ सेकंड पर रीसेट किया ताकि यूजर का पूरा बैच २५s तक टिका रहे
    timeLeft = 25;

    // स्क्रीन पर तुरंत नया लाइव बोर्ड उसी बैच के साथ रेंडर करना
    renderBoard();

    // भव्य बधाई पॉपअप स्क्रीन पर दिखाना
    showLuxuryCongratulationPopup(brandName, logoDataUrl);
}// 👑 करन भाई का असली मुख्य प्रीमियम कार्ड वाला ३-सेकंड ऑटो पॉपअप इंजन 👑
function showLuxuryCongratulationPopup(brandName, logoUrl) {
    const oldPopup = document.getElementById('luxuryCongratPopup');
    if (oldPopup) oldPopup.remove();

    // 🚨 महा-फिक्स: पूरा बैकग्राउंड और बटन साफ़, सीधे आपका असली चमचमाता सुनहरी प्रीमियम कार्ड ही पॉपअप बनेगा
    const popupHTML = `
        <div id="luxuryCongratPopup" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.85); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:99999999; animation: fadeIn 0.4s ease; padding: 20px; box-sizing: border-box;">
            
            <!-- ऊपर का संदेश बिल्कुल साफ़ और चमकदार -->
            <div style="text-align:center; margin-bottom: 25px; animation: slideDown 0.5s ease; width: 100%;">
                <div style="font-size: 15px; letter-spacing: 5px; color: #ffd700; font-weight: 900; text-transform: uppercase; text-shadow: 0 0 12px rgba(255,215,0,0.7);">✨ Elite Spot Booked ✨</div>
                <h1 style="color: #ffffff; font-size: 40px; font-weight: 900; margin: 10px 0; text-shadow: 0 0 25px rgba(255,215,0,0.8); letter-spacing: 3px; text-transform: uppercase;">CONGRATULATIONS!</h1>
                <p style="color: #eedc9a; font-size: 16px; margin: 0; font-weight: 700; font-style: italic; letter-spacing: 0.5px;">आपका प्रीमियम स्पॉट बोर्ड पर लाइव हो गया है</p>
            </div>

            <!-- 🏆 आपका मुख्य असली प्रीमियम कार्ड (Pillar Card) - हूबहू वैसा ही जैसा मुख्य वेबसाइट पर है -->
            <div style="position: relative; width: 300px; height: 400px; background: linear-gradient(135deg, #FBF4DB 0%, #EEDC9A 50%, #D4BE75 100%); border: 2.5px solid #ffd700; border-radius: 12px; display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 15px 10px; box-shadow: 0 0 50px rgba(255, 215, 0, 0.6); box-sizing: border-box; animation: cardPopupZoom 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;">
                
                <!-- कोने का छोटा #VIP रैंक नंबर -->
                <div style="position:absolute; top:8px; left:10px; font-size:11px; font-weight:bold; color:#776622;">#VIP</div>

                <!-- बीच का मुख्य ब्रांड लोगो और नाम (बिना किसी इनर बैकग्राउंड के, सीधे कड़क लुक) -->
                <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; flex-grow:1; width:100%;">
                    <div style="display:flex; align-items:center; justify-content:center; height:200px; margin-bottom:12px; width:100%;">
                        <img src="${logoUrl}" alt="${brandName}" style="max-width:200px; max-height:200px; width:auto; height:auto; object-fit:contain; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.4));">
                    </div>
                    <div style="font-size:25px; font-weight:900; color:#000000; text-shadow: 0px 1px 2px rgba(255, 215, 0, 0.8), 0px 0px 8px rgba(255, 235, 150, 0.6); text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; width:100%; text-transform: uppercase;">${brandName}</div>
                </div>
            </div>

        </div>
        <style>
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideDown { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            @keyframes cardPopupZoom { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        </style>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);

    // 🚨 ३ सेकंड बाद ऑटोमेटिक बिना किसी बटन के बंद होने का टाइमर फिक्स
    setTimeout(() => {
        const popup = document.getElementById('luxuryCongratPopup');
        if (popup) {
            popup.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            popup.style.opacity = '0';
            popup.style.transform = 'scale(0.9)';
            setTimeout(() => popup.remove(), 400);
        }
    }, 3000); // पूरे ३ सेकंड (3000ms) पर लॉक किया भाई
}
// Raycaster & Interaction Handler for 3D Space Logos
const raycaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector2();
const gridContainer = document.getElementById('pixelBoardGrid');

if (gridContainer) {
    gridContainer.addEventListener('click', (event) => {
        if (!spaceRenderer || !spaceCamera) return;
        const rect = spaceRenderer.domElement.getBoundingClientRect();
        if (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) {
            mouseVector.x = ((event.clientX - rect.left) / gridContainer.clientWidth) * 2 - 1;
            mouseVector.y = -((event.clientY - rect.top) / gridContainer.clientHeight) * 2 + 1;
            raycaster.setFromCamera(mouseVector, spaceCamera);
            const intersects = raycaster.intersectObjects(activeMeshPool);
            if (intersects.length > 0) {
                const clickedMesh = intersects[0].object;
                if (clickedMesh.userData && clickedMesh.userData.hasData) {
                    if (!clickedMesh.userData.isPaused) {
                        clickedMesh.userData.isPaused = true;
                        document.getElementById('searchResultLogo').src = clickedMesh.material.map.image.src || '';
                        document.getElementById('searchResultLogo').style.display = 'block';
                        document.getElementById('searchResultBrandName').innerText = clickedMesh.userData.brandName;
                        document.getElementById('searchResultLink').href = clickedMesh.userData.targetUrl || '#';
                        document.getElementById('searchResultModal').style.display = 'flex';
                        clearTimeout(clickedMesh.userData.resumeTimeout);
                        clickedMesh.userData.resumeTimeout = setTimeout(() => {
                            clickedMesh.userData.isPaused = false;
                        }, 5000);
                    } else {
                        if (clickedMesh.userData.targetUrl) {
                            window.open(clickedMesh.userData.targetUrl, '_blank');
                        }
                    }
                }
            }
        }
    });
}

// ऑटो-फिक्स क्लिक्स के लिए
document.addEventListener("DOMContentLoaded", () => {
    const linkMap = {
        "$1 Spot": "dollarSpotModal",
        "Premium Board": "navPremiumModal",
        "How It Works": "howItWorksModal",
        "Terms & Conditions": "termsModal",
        "Privacy Policy": "privacyModal",
        "Refund Policy": "refundModal",
        "Contact Us": "contactModal"
    };

    document.querySelectorAll("a").forEach(anchor => {
        const text = anchor.innerText.trim();
        if (linkMap[text]) {
            anchor.setAttribute("href", "javascript:void(0);");
            anchor.onclick = (e) => {
                e.preventDefault();
                openLegalModal(linkMap[text]);
            };
        }
    });
});
/* =======================================================
   🔒 करन भाई का कीबोर्ड और माउस व्हील ज़ूम लॉकिंग सिस्टम 🔒
   ======================================================= */
// १. कीबोर्ड के Ctrl और (+ / - / 0) बटन को ब्लॉक करना
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && (e.key === '=' || e.key === '-' || e.key === '+' || e.key === '0')) {
        e.preventDefault();
    }
});

// २. माउस व्हील के साथ Ctrl दबाकर ज़ूम करना ब्लॉक करना
document.addEventListener('wheel', function (e) {
    if (e.ctrlKey) {
        e.preventDefault();
    }
}, { passive: false });

// ३. मोबाइल पर डबल टैप (Double Tap) करने से होने वाले ऑटो-ज़ूम को रोकना
let lastTouchEnd = 0;
document.addEventListener('touchend', function (e) {
    let now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);
/* =======================================================
   🔒 करन भाई का यूनिवर्सल स्क्रीन ऑटो-फ़िट लॉकिंग इंजन 🔒
   ======================================================= */
function lockAndStretchFullMobileScreen() {
    // १. चेक करना कि क्या यूज़र मोबाइल या टैबलेट पर है
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        // २. मोबाइल की स्क्रीन की असली उपलब्ध चौड़ाई और ऊँचाई नापना
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // ३. हमारे मुख्य रैपर या बॉडी एलिमेंट को टारगेट करना
        // (अगर आपकी मुख्य क्लास का नाम अलग है तो यहाँ बॉडी पर सीधे जादू चलेगा)
        const targetEl = document.body;

        if (targetEl) {
            // ४. हमारी १२box की वेबसाइट को मोबाइल स्क्रीन की चौड़ाई में ज़बरदस्ती खींचने का गणित
            const scaleX = windowWidth / 1200;

            // ५. पेज को बिना कटे, बिना किनारों पर खाली जगह छोड़े १००% स्क्रीन पर फैलाना
            targetEl.style.width = "1200px";
            targetEl.style.transform = `scale(${scaleX})`;
            targetEl.style.transformOrigin = "top center";
            targetEl.style.margin = "0 auto";

            // ६. नीचे का जो ब्लैक स्पेस खाली रह जाता है, उसे ऊँचाई के हिसाब से बैलेंस करना
            document.documentElement.style.overflowX = "hidden";
        }
    }
}

// वेबसाइट लोड होते ही और फोन घुमाने (Resize) पर तुरंत स्क्रीन को फिट करें
window.addEventListener('DOMContentLoaded', lockAndStretchFullMobileScreen);
window.addEventListener('load', lockAndStretchFullMobileScreen);
window.addEventListener('resize', lockAndStretchFullMobileScreen);
/* =======================================================
   🔒 करन भाई का यूनिवर्सल जावास्क्रिप्ट ऑल-पॉपअप सेंटर लॉकर 🔒
   ======================================================= */
function forceAllModalsToCenter() {
    // १. वेबसाइट के सभी पॉपअप पर्दों और अंदर के डिब्बों को ढूंढना
    const overlays = document.querySelectorAll('.legal-modal-overlay, .modal-overlay, #searchResultModal, #buyModal');
    const boxes = document.querySelectorAll('.legal-modal-box, .modal-box, .modal-content, #searchResultModal > div, #buyModal > div');

    // २. सभी बाहरी पर्दों पर ज़बरदस्ती रॉयल ब्लैक-ब्लर और सेंटर का ताला जड़ना
    overlays.forEach(overlay => {
        if (overlay) {
            overlay.style.setProperty('align-items', 'center', 'important');
            overlay.style.setProperty('justify-content', 'center', 'important');
            overlay.style.setProperty('position', 'fixed', 'important');
            overlay.style.setProperty('top', '0', 'important');
            overlay.style.setProperty('left', '0', 'important');
            overlay.style.setProperty('width', '100vw', 'important');
            overlay.style.setProperty('height', '100vh', 'important');
            overlay.style.setProperty('background', 'rgba(0, 0, 0, 0.90)', 'important');
            overlay.style.setProperty('backdrop-filter', 'blur(12px)', 'important');
            overlay.style.setProperty('-webkit-backdrop-filter', 'blur(12px)', 'important');
        }
    });

    // ३. सभी अंदर के डिब्बों के पुराने मार्जिन को साफ करके बिल्कुल सुडौल बीच में रोकना
    boxes.forEach(box => {
        if (box) {
            box.style.setProperty('margin', '0 auto', 'important');
            box.style.setProperty('top', '0', 'important');
            box.style.setProperty('left', '0', 'important');
            box.style.setProperty('position', 'relative', 'important');
            box.style.setProperty('transform', 'none', 'important');
            box.style.setProperty('box-shadow', '0 0 50px rgba(255, 215, 0, 0.5)', 'important');
        }
    });

    // ४. सर्च रिज़ल्ट का महा-फिक्स: ब्रांड नेम को वापस बिल्कुल बीच में लाना
    const searchBrandText = document.getElementById('searchResultBrandName');
    if (searchBrandText) {
        searchBrandText.style.setProperty('text-align', 'center', 'important');
        searchBrandText.style.setProperty('width', '100%', 'important');
        searchBrandText.style.setProperty('display', 'block', 'important');
    }
}

// वेबसाइट पर कहीं भी क्लिक होने पर या कोई भी बटन दबाने पर यह जादुई सेंटर लॉक तुरंत काम करेगा
document.addEventListener('click', () => {
    setTimeout(forceAllModalsToCenter, 50);
});
window.addEventListener('resize', forceAllModalsToCenter);