// Disable right-click menu everywhere on the page
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

// LIVE CURRENCY FETCHING API
async function fetchLiveCurrencyRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        if (data && data.rates && data.rates.INR) {
            liveUsdToInrRate = data.rates.INR;
        }
    } catch (error) {
        console.log('Using default currency rate');
    }
    updateDynamicPrices();
}

let liveUsdToInrRate = 83.0;

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

    updateLiveSpotsCounter();
}

fetchLiveCurrencyRates();

// TOTAL 500 PREMIUM SPOTS DATABASE
const totalPremiumSpotsCount = 500;
let allSpots = [];

for (let i = 1; i <= totalPremiumSpotsCount; i++) {
    if (i === 1) {
        allSpots.push({ rank: 1, isBought: true, isUserOwned: false, name: 'APPLE', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', url: 'https://apple.com' });
    } else if (i === 2) {
        allSpots.push({ rank: 2, isBought: true, isUserOwned: false, name: 'TESLA', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png', url: 'https://tesla.com' });
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

// MODAL CONTROLS
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
            alert('Sorry, all 1,000,000 Normal spots are full!');
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
        if (brandNameWrapper) brandNameWrapper.style.display = 'none';
        if (btnPaySubmit) btnPaySubmit.innerText = `Pay $1.00 (₹${calculatedInrNormal}) & Publish`;
    }

    const buyModal = document.getElementById('buyModal');
    if (buyModal) buyModal.style.display = 'flex';
}

function closeBuyModal() {
    const buyModal = document.getElementById('buyModal');
    if (buyModal) buyModal.style.display = 'none';
}

function confirmPurchase() {
    const fileInput = document.getElementById('inputLogoFile');
    const targetUrlEl = document.getElementById('inputTargetUrl');
    const targetUrl = targetUrlEl ? targetUrlEl.value || 'https://google.com' : 'https://google.com';

    const selectedPayEl = document.querySelector('input[name="payMethod"]:checked');
    const selectedPayment = selectedPayEl ? selectedPayEl.value : 'online';

    if (currentBoardType === 'premium') {
        const brandNameEl = document.getElementById('inputBrandName');
        const brandName = brandNameEl ? brandNameEl.value || 'MY BRAND' : 'MY BRAND';
        const availableSpot = allSpots.find(item => !item.isBought);

        if (!availableSpot) {
            alert('All 500 Premium spots are sold out!');
            return;
        }

        if (fileInput && fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                applyPurchase(availableSpot, brandName, e.target.result, targetUrl, selectedPayment);
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            const defaultLogo = 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Android_O_Preview_Logo.png';
            applyPurchase(availableSpot, brandName, defaultLogo, targetUrl, selectedPayment);
        }
    } else {
        if (fileInput && fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                addNewUserNormalSpot(e.target.result, targetUrl);
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            const defaultLogo = 'https://i.pravatar.cc/100?img=33';
            addNewUserNormalSpot(defaultLogo, targetUrl);
        }
    }
}

function showInstantCongratulationsPopup(spot) {
    const existingPopup = document.getElementById('rewardBlurOverlay');
    if (existingPopup) existingPopup.remove();

    if (!document.getElementById('rewardAnimStyle')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'rewardAnimStyle';
        styleSheet.type = 'text/css';
        styleSheet.innerText = `
            @keyframes slowZoomReward {
                0% { transform: scale(0.2); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
            .blur-bg-active {
                backdrop-filter: blur(12px) !important;
                -webkit-backdrop-filter: blur(12px) !important;
                background: rgba(0, 0, 0, 0.75) !important;
            }
        `;
        document.head.appendChild(styleSheet);
    }

    const overlay = document.createElement('div');
    overlay.id = 'rewardBlurOverlay';
    overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; z-index:99999; display:flex; flex-direction:column; align-items:center; justify-content:center;';
    overlay.className = 'blur-bg-active';

    overlay.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; animation: slowZoomReward 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;">
            <div style="font-size:32px; font-weight:bold; color:#ffd700; margin-bottom:15px; text-shadow: 0 0 20px rgba(255,215,0,0.6); letter-spacing:1px;">🎉 CONGRATULATIONS! 🎉</div>
            <div style="font-size:14px; color:#ddd; margin-bottom:20px;">Spot #${spot.rank} Unlocked Successfully</div>
            
            <div style="width:220px; height:320px; background:linear-gradient(135deg, #1a1a1a, #2a2a2a); border:3px solid #ffd700; border-radius:16px; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; box-shadow: 0 0 50px rgba(255,215,0,0.5); box-sizing: border-box; position:relative;">
                <div style="position:absolute; top:12px; left:15px; font-size:13px; color:#aaa; font-weight:bold;">#${spot.rank}</div>
                <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; flex-grow:1; width:100%;">
                    <div style="display:flex; align-items:center; justify-content:center; height:110px; margin-bottom:15px;">
                      <img src="${spot.logo}" alt="${spot.name}" style="max-width:100px; max-height:100px; width:auto; height:auto; object-fit:contain;">
                    </div>
                    <div style="font-size:18px; font-weight:bold; color:#fff; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; width:100%;">${spot.name}</div>
                </div>
            </div>

            <div style="margin-top:25px; font-size:13px; color:#aaa; background:rgba(255,255,255,0.08); padding:8px 18px; border-radius:20px; border:1px solid rgba(255,215,0,0.3);">
                Adjusting to board in <span id="rewardCountdown" style="color:#ffd700; font-weight:bold;">3</span>s...
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    let sec = 3;
    const secSpan = document.getElementById('rewardCountdown');
    const timerInterval = setInterval(() => {
        sec--;
        if (secSpan) secSpan.innerText = sec;
        if (sec <= 0) {
            clearInterval(timerInterval);
            overlay.remove();
        }
    }, 1000);
}

function applyPurchase(spot, name, logo, url, payMethod) {
    spot.isBought = true;
    spot.isUserOwned = true;
    spot.name = name;
    spot.logo = logo;
    spot.url = url;

    const boughtSpots = allSpots.filter(s => s.isBought);
    const boughtIndex = boughtSpots.findIndex(s => s.rank === spot.rank);
    currentBatchIndex = Math.floor(boughtIndex / 5);

    timeLeft = 25;
    if (timerText) timerText.innerText = `${timeLeft}s`;

    renderBoard();
    closeBuyModal();
    showInstantCongratulationsPopup(spot);
}


// ==========================================================================
// 🌌 REALISTIC DEEP SPACE, SHOOTING STARS & STRAIGHT STREAMING LOGOS ENGINE
// ==========================================================================
const MAX_NORMAL_SPOTS = 1000000;
let currentNormalSpotsFilled = 15420;

let spaceScene, spaceCamera, spaceRenderer;
const spaceLogoPool = [];
const shootingStarsPool = [];
const maxActiveStreamLogos = 28;

const sampleBrandLogos = [
    { name: "GOOGLE", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", url: "https://google.com" },
    { name: "AMAZON", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", url: "https://amazon.com" },
    { name: "NETFLIX", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", url: "https://netflix.com" },
    { name: "YOUTUBE", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg", url: "https://youtube.com" },
    { name: "SPOTIFY", logo: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg", url: "https://spotify.com" },
    { name: "MICROSOFT", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg", url: "https://microsoft.com" },
    { name: "INSTAGRAM", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg", url: "https://instagram.com" },
    { name: "DISCORD", logo: "https://upload.wikimedia.org/wikipedia/commons/9/98/Discord_logo_%282006-2021%29.svg", url: "https://discord.com" }
];

const userCustomQueue = [];

function setupNormalCounterUI() {
    const gridContainer = document.getElementById('pixelBoardGrid');
    if (!gridContainer) return;

    gridContainer.innerHTML = '';
    gridContainer.style.position = 'relative';
    gridContainer.style.overflow = 'hidden';
    gridContainer.style.width = '100%';
    gridContainer.style.height = '450px';
    gridContainer.style.background = '#010105';
    gridContainer.style.borderRadius = '12px';

    if (typeof THREE === 'undefined') {
        gridContainer.innerHTML = '<div style="color:#fff; text-align:center; padding:50px;">Three.js library is loading... Please check internet connection.</div>';
        return;
    }

    // 1. Scene, Camera & Renderer
    spaceScene = new THREE.Scene();
    spaceScene.fog = new THREE.FogExp2(0x010105, 0.025);

    spaceCamera = new THREE.PerspectiveCamera(60, gridContainer.clientWidth / gridContainer.clientHeight, 0.1, 1000);
    spaceCamera.position.set(0, 0, 10);

    spaceRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    spaceRenderer.setSize(gridContainer.clientWidth, gridContainer.clientHeight);
    spaceRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    gridContainer.appendChild(spaceRenderer.domElement);

    // 2. Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
    spaceScene.add(ambientLight);

    // 3. Realistic Twinkling Starfield (Antariksh ke hazaro taare)
    const starsCount = 2000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
        starPositions[i] = (Math.random() - 0.5) * 150;     // X spread
        starPositions[i + 1] = (Math.random() - 0.5) * 100; // Y spread
        starPositions[i + 2] = (Math.random() - 0.5) * 350; // Z depth
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.8
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    spaceScene.add(starField);

    // 4. Create Shooting Stars (Tutte hue tare / Meteors streak)
    for (let i = 0; i < 6; i++) {
        spawnShootingStar();
    }

    // 5. Initialize Wide Spread Straight Logos Highway
    for (let i = 0; i < maxActiveStreamLogos; i++) {
        spawnHighwayLogoMesh(-260 + (i * 10));
    }

    // 6. High Performance Animation Loop
    function animateSpace() {
        requestAnimationFrame(animateSpace);

        // Move Logos straight forward towards and past camera
        for (let i = 0; i < spaceLogoPool.length; i++) {
            const item = spaceLogoPool[i];
            item.mesh.position.z += 0.25; // Forward speed

            // Recycler: Jab logo camera ke peeche nikal jaye, to wapas deep space me bhej do
            if (item.mesh.position.z > 12) {
                resetAndRecycleLogoMesh(item);
            }
        }

        // Animate Shooting Stars (Tezi se diagonal gujarne wale tute hue tare)
        for (let i = 0; i < shootingStarsPool.length; i++) {
            const sStar = shootingStarsPool[i];
            sStar.position.x -= sStar.userData.vx;
            sStar.position.y -= sStar.userData.vy;
            sStar.position.z += sStar.userData.vz;

            // Reset shooting star when it goes off screen
            if (sStar.position.z > 15 || sStar.position.x < -80 || sStar.position.y < -50) {
                resetShootingStar(sStar);
            }
        }

        spaceRenderer.render(spaceScene, spaceCamera);
    }
    animateSpace();

    // Responsive Resize
    window.addEventListener('resize', () => {
        if (!gridContainer) return;
        spaceCamera.aspect = gridContainer.clientWidth / gridContainer.clientHeight;
        spaceCamera.updateProjectionMatrix();
        spaceRenderer.setSize(gridContainer.clientWidth, gridContainer.clientHeight);
    });

    updateLiveSpotsCounter();
}

// Helper: Spawn Shooting Star (Tuta hua tara)
function spawnShootingStar() {
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array([0, 0, 0, -3, -1.5, 5]); // Tail length
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.7
    });

    const shootingStar = new THREE.Line(starGeo, starMat);

    resetShootingStar(shootingStar);
    spaceScene.add(shootingStar);
    shootingStarsPool.push(shootingStar);
}

function resetShootingStar(star) {
    const rx = (Math.random() - 0.5) * 80;
    const ry = (Math.random() - 0.5) * 50 + 20;
    const rz = (Math.random() - 0.5) * 150 - 50;

    star.position.set(rx, ry, rz);
    star.userData = {
        vx: 0.8 + Math.random() * 0.6,
        vy: 0.4 + Math.random() * 0.3,
        vz: 1.2 + Math.random() * 0.8
    };
}

// Helper: Spawn Straight Facing Highway Logos across wide space
function spawnHighwayLogoMesh(initialZ) {
    let brandData;
    if (userCustomQueue.length > 0) {
        brandData = userCustomQueue.shift();
    } else {
        brandData = sampleBrandLogos[Math.floor(Math.random() * sampleBrandLogos.length)];
    }

    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';

    textureLoader.load(brandData.logo, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;

        const planeGeo = new THREE.PlaneGeometry(3.0, 3.0);
        const planeMat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });

        const logoMesh = new THREE.Mesh(planeGeo, planeMat);

        // Wide spread across entire space (not just center)
        const posX = (Math.random() - 0.5) * 22; // Wide left to right spread
        const posY = (Math.random() - 0.5) * 14; // Wide top to bottom spread
        const posZ = initialZ;

        logoMesh.position.set(posX, posY, posZ);

        // Ensure rotation is perfectly 0,0,0 so text/logos come completely straight facing the screen
        logoMesh.rotation.set(0, 0, 0);

        logoMesh.userData = { targetUrl: brandData.url || 'https://google.com' };

        spaceScene.add(logoMesh);
        spaceLogoPool.push({ mesh: logoMesh, data: brandData });
    }, undefined, () => { });
}

// Recycle logo mesh in infinite loop maintaining straight flat posture
function resetAndRecycleLogoMesh(item) {
    let nextBrand;
    if (userCustomQueue.length > 0) {
        nextBrand = userCustomQueue.shift();
    } else {
        nextBrand = sampleBrandLogos[Math.floor(Math.random() * sampleBrandLogos.length)];
    }

    item.data = nextBrand;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';
    textureLoader.load(nextBrand.logo, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        item.mesh.material.map = tex;
        item.mesh.material.needsUpdate = true;
    });

    // Reset wide coordinates deep into space tunnel
    const newX = (Math.random() - 0.5) * 22;
    const newY = (Math.random() - 0.5) * 14;
    item.mesh.position.set(newX, newY, -280);
    item.mesh.rotation.set(0, 0, 0); // Keep straight
    item.mesh.userData.targetUrl = nextBrand.url || 'https://google.com';
}

function updateLiveSpotsCounter() {
    const counterDisplay = document.getElementById('liveSpotsCounter');
    if (counterDisplay) {
        counterDisplay.innerText = `${currentNormalSpotsFilled.toLocaleString()} / ${MAX_NORMAL_SPOTS.toLocaleString()} Spots Filled`;
    }
}

// Initialise space canvas
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setupNormalCounterUI();
} else {
    window.addEventListener('DOMContentLoaded', setupNormalCounterUI);
}

// Function when a user buys a new $1 normal spot
function addNewUserNormalSpot(logoUrl, targetUrl) {
    if (currentNormalSpotsFilled >= MAX_NORMAL_SPOTS) {
        alert('Seat Full! All 1,000,000 spots are booked.');
        return;
    }

    currentNormalSpotsFilled++;
    updateLiveSpotsCounter();
    closeBuyModal();

    userCustomQueue.unshift({
        name: "USER BRAND",
        logo: logoUrl,
        url: targetUrl
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

// Raycaster for clicking floating space logos
const raycaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector2();

document.write = document.write || function () { }; // Safety mock

document.addEventListener('click', (event) => {
    const gridContainer = document.getElementById('pixelBoardGrid');
    if (!gridContainer || !spaceRenderer || !spaceCamera) return;

    const rect = spaceRenderer.domElement.getBoundingClientRect();
    if (
        event.clientX >= rect.left && event.clientX <= rect.right &&
        event.clientY >= rect.top && event.clientY <= rect.bottom
    ) {
        mouseVector.x = ((event.clientX - rect.left) / gridContainer.clientWidth) * 2 - 1;
        mouseVector.y = -((event.clientY - rect.top) / gridContainer.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouseVector, spaceCamera);

        const meshesOnly = spaceLogoPool.map(item => item.mesh);
        const intersects = raycaster.intersectObjects(meshesOnly);

        if (intersects.length > 0) {
            const clickedMesh = intersects.object;
            if (clickedMesh.userData && clickedMesh.userData.targetUrl) {
                window.open(clickedMesh.userData.targetUrl, '_blank');
            }
        }
    }
});