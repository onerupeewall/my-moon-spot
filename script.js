/* =======================================================
   🏆 THE DOLLAR MILLION SPOT - OFFICIAL JAVA-SCRIPT 🏆
   ======================================================= */

// १. लीगल पॉपअप ओपन और क्लोज करने का फिक्स
window.openLegalModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex'; // क्लास के बजाय सीधे डिस्प्ले फ्लेक्स किया ताकि तुरंत दिखे
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
let liveUsdToInrRate = 83.0;

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
    // 🚨 बैकअप लाइव गार्ड: अगर लोकल में इंटरनेट ब्लॉक है तो आज का असली मार्केट रेट ₹96.15 मान कर गुणा करेगा
    if (!liveUsdToInrRate || liveUsdToInrRate === 83.0) {
        liveUsdToInrRate = 96.15;
    }

    // 🏆 करन भाई का असली नियम: फिक्स $1050 को लाइव रेट से गुना करके लाइव इंडियन रुपीस बनाना
    const calculatedInrPremium = Math.round(1050 * liveUsdToInrRate);

    // १. इंडियन रुपीस का डिब्बा - यह हमेशा लाइव ऊपर-नीचे घूमता रहेगा
    const premiumInrEl = document.getElementById('premiumInrPrice');
    if (premiumInrEl) premiumInrEl.innerText = `₹${calculatedInrPremium.toLocaleString('en-IN')}.00`;

    // २. डॉलर का डिब्बा - यह हमेशा $1,050.00 पर ही फिक्स (स्थिर) लॉक रहेगा
    const premiumUsdEl = document.getElementById('premiumUsdPrice');
    if (premiumUsdEl) premiumUsdEl.innerText = `$1,050.00`;

    // ३. प्रीमियम बटन का टेक्स्ट - यह भी हमेशा $1,050.00 पर ही फिक्स लॉक रहेगा
    const btnPremTextEl = document.getElementById('btnPremiumText');
    if (btnPremTextEl) btnPremTextEl.innerText = `$1,050.00`;

    // ४. नॉर्मल $1 वाला इंडियन बटन - यह भी लाइव रेट के हिसाब से बदलेगा
    const calculatedInrNormal = Math.round(liveUsdToInrRate);
    const btnNormalInrEl = document.getElementById('btnNormalInr');
    if (btnNormalInrEl) btnNormalInrEl.innerText = `₹${calculatedInrNormal}`;

    if (typeof updateLiveSpotsCounter === 'function') {
        updateLiveSpotsCounter();
    }
}

// TOTAL 500 PREMIUM SPOTS DATABASE
const totalPremiumSpotsCount = 500;
let allSpots = [];

for (let i = 1; i <= totalPremiumSpotsCount; i++) {
    if (i === 1) {
        allSpots.push({ rank: 1, isBought: true, isUserOwned: false, name: 'APPLE', logo: 'https://wikimedia.org', url: 'https://apple.com' });
    } else if (i === 2) {
        allSpots.push({ rank: 2, isBought: true, isUserOwned: false, name: 'TESLA', logo: 'https://wikimedia.org', url: 'https://tesla.com' });
    } else {
        allSpots.push({ rank: i, isBought: false, isUserOwned: false });
    }
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

renderBoard();

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

function addNewUserPremiumSpot(brandName, logoDataUrl, targetUrl) {
    const emptySpotIndex = allSpots.findIndex(s => !s.isBought);
    if (emptySpotIndex === -1) {
        alert('Sorry, all 500 Premium spots are full!');
        closeBuyModal();
        return;
    }
    allSpots[emptySpotIndex] = {
        rank: emptySpotIndex + 1,
        isBought: true,
        isUserOwned: true,
        name: brandName,
        logo: logoDataUrl,
        url: targetUrl
    };
    closeBuyModal();
    renderBoard();
    showLuxuryCongratulationPopup(brandName, logoDataUrl);
}

// --- लग्जरी 'Congratulations' पॉपअप ---
function showLuxuryCongratulationPopup(brandName, logoUrl) {
    const oldPopup = document.getElementById('luxuryCongratPopup');
    if (oldPopup) oldPopup.remove();

    const popupHTML = `<div id="luxuryCongratPopup" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:radial-gradient(circle, #1c1c24 0%, #111116 100%); border:4px solid #ffd700; border-radius:20px; padding:35px; box-shadow:0 0 50px rgba(255,215,0,0.5); z-index:10000000; text-align:center; color:#fff; width:450px; max-width:90%;">✨ Elite Spot Booked ✨<br>CONGRATULATIONS!<br>आपका प्रीमियम स्पॉट बोर्ड पर लाइव हो गया है<br>#VIP ${brandName}</div>`;
    document.body.insertAdjacentHTML('beforeend', popupHTML);

    setTimeout(() => {
        const popup = document.getElementById('luxuryCongratPopup');
        if (popup) {
            popup.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            popup.style.opacity = '0';
            popup.style.transform = 'translate(-50%, -50%) scale(1.05)';
            setTimeout(() => popup.remove(), 400);
        }
    }, 3000);
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