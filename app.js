let currentPage = 'home';
let currentVersion = null;
let selectedPack = null;
let gameResults = [];
let cart = [];
let history = [];
let currentGame = '';
let selectedCategory = null;

function render() {
    const app = document.getElementById('app');
    
    if (currentPage === 'home') {
        app.innerHTML = renderHome();
    } 
    else if (currentPage.startsWith('category-')) {
        const category = currentPage.replace('category-', '');
        app.innerHTML = renderCategory(category);
    }
    else if (currentPage.startsWith('game-')) {
        const [, category, version] = currentPage.split('-');
        currentGame = category;
        currentVersion = version;
        app.innerHTML = renderGame(category, version);

        attachDiceHandlers();

        requestAnimationFrame(() => {
            const d1 = document.getElementById('dice1');
            if (d1) d1.focus();
        });
    } 
    else if (currentPage === 'calculator') {
        app.innerHTML = renderCalculator();
    }
}

function openCategory(category) {
    navigateTo(`category-${category}`);
}

function renderCategory(category) {
    const config = CATEGORY_VERSIONS[category];
    if (!config) return '';

    return `
        <div class="navbar">
            <h1>⚡ Furiosos Planet</h1>
            <button class="back-btn" onclick="navigateTo('home')">← Atrás</button>
        </div>

        <div class="container">
            <div class="hero">
                <h2>${config.title}</h2>
                <p>Selecciona la versión</p>
            </div>

            <div class="games-grid">
                ${config.versions.map(v => `
                    <div class="game-card" onclick="navigateTo('game-${category}-${v.id}')">
                        <h3>${v.name}</h3>
                        <p>${v.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderHome() {
    return `
        <div class="navbar">
            <h1>⚡ Furiosos Planet</h1>
            <button onclick="navigateTo('calculator')">Caja Registradora</button>
        </div>

        <div class="container">
            <div class="hero">
                <h2>🎲 Bienvenido a Furiosos Planet</h2>
                <p>Elige una categoría</p>
            </div>

            <div class="games-grid">
                <div class="game-card" onclick="openCategory('cars')">
                    <h3>🏎️ Coches</h3>
                    <p>Elige tu versión de coches premium</p>
                </div>

                <div class="game-card" onclick="openCategory('funkos')">
                    <h3>🎨 Funkos</h3>
                    <p>Versiones clásicas y variadas</p>
                </div>

                <div class="game-card" onclick="openCategory('plushies')">
                    <h3>🧸 Peluches</h3>
                    <p>Peluches Furioso y Furioso 2.0</p>
                </div>
            </div>

            ${renderHistory()}
        </div>
    `;
}


function renderGame(category, version) {
    const title =
        category === 'cars' ? '🏎️ Coches Premium' :
        category === 'funkos' ? '🎨 Funkos Coleccionables' :
        '🧸 Peluches Furioso';

    const emoji =
        category === 'cars' ? '🏎️' :
        category === 'funkos' ? '🎨' :
        '🧸';
    
    return `
        <div class="navbar">
            <h1>⚡ Furiosos Planet</h1>
            <button class="back-btn" onclick="navigateTo('home')">← Atrás</button>
        </div>
        <div class="container">
            <div class="game-header">
                <h2>${emoji} ${title}</h2>
                <p>Selecciona un pack y comienza a jugar</p>
            </div>
            
            <div class="packs-container">
                ${PACKS.map(pack => `
                    <div class="pack-btn ${selectedPack?.id === pack.id ? 'selected' : ''}"
                        onclick="selectPack(${pack.id}, '${category}')">
                        <div class="pack-name">${pack.name}</div>
                        <div class="pack-info">
                            <div>${pack.tiradas} tiradas</div>
                            <div style="color: #ff6b6b; font-weight: bold;">${pack.precio}</div>
                            <div style="font-size: 0.75rem; margin-top: 0.5rem;">
                                ${pack.description}
                            </div>
                        </div>
                    </div>
                `).join('')}

            </div>
            
            ${selectedPack ? renderGameInterface(category, version) : ''}
        </div>
    `;
}

function renderGameInterface(category, version) {
    const table = GAME_TABLES[category][version];
    const tiradaCount = gameResults.length;
    const tiradaTotal = selectedPack.tiradas;
    const progress = (tiradaCount / tiradaTotal) * 100;
    
    return `
    <div class="game-interface">
        <div class="left-panel">
            <div class="input-section">
                <h3>Ingresa los dados</h3>
                <div class="dice-input">
                    <input type="number" id="dice1" min="1" max="6" placeholder="Dado 1">
                    <input type="number" id="dice2" min="1" max="6" placeholder="Dado 2">
                </div>
                <button class="confirm-btn" id="confirm" 
                        onclick="confirmRoll('${category}', '${version}')" 
                        ${tiradaCount >= tiradaTotal ? 'disabled' : ''}>
                    Confirmar Tirada (${tiradaCount}/${tiradaTotal})
                </button>
            </div>

            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%">
                    ${Math.round(progress)}%
                </div>
            </div>

            <div class="results-section">
                <h3>Resultados de esta tirada</h3>
                ${gameResults.length > 0 ? gameResults.map((result, idx) => `
                    <div class="result-item">
                        <span class="result-count">#${idx + 1}</span>
                        ${result}
                    </div>
                `).join('') : '<p style="color: #999;">Aún no hay resultados</p>'}
            </div>
        </div>

        <div class="right-panel">
            <div class="stats">
                <div class="stat-box">
                    <div class="stat-label">Tiradas realizadas</div>
                    <div class="stat-value">${tiradaCount}/${tiradaTotal}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Tiradas restantes</div>
                    <div class="stat-value">${tiradaTotal - tiradaCount}</div>
                </div>
            </div>

            ${tiradaCount >= tiradaTotal ? `
                <div style="background: #2a2a2a; border-radius: 8px; padding: 1.5rem; margin-top: 1rem;">
                    <h3 style="color: #ff6b6b; margin-bottom: 1rem;">¡Juego completado!</h3>
                    <button class="confirm-btn" onclick="finishGame('${category}')">
                        Terminar y ver resumen
                    </button>
                </div>
            ` : ''}
        </div>
    </div>
    `;
}


function renderCalculator() {
  if (selectedCategory == null){
    selectedCategory = Object.keys(PRODUCTS)[0]
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return `
        <div class="navbar">
            <h1>⚡ Furiosos Planet - Caja</h1>
            <button class="back-btn" onclick="navigateTo('home')">← Atrás</button>
        </div>
        <div class="container-caja">
            <div class="calculator-container">
                <div>
                    <h1 style="color: #ff6b6b; margin-bottom: 1.5rem; text-align: center;">Selecciona productos</h2>
                    
                    <div class="categories">
                        ${Object.keys(PRODUCTS)
                          .map(
                            (category) => `
                            <button class="category-btn active" onclick="changeCategory('${category}')">
                                ${category}
                            </button>
                        `,
                          )
                          .join("")}
                    </div>
                    
                    <div id="products-container" class="products-grid">
                        ${PRODUCTS[selectedCategory]
                          .map(
                            (product) => `
                            <button class="product-btn ${product.special ? 'product-special' : ''}" onclick='addToCart(${JSON.stringify(product)})'>
                                <div class="product-name">${product.name}</div>
                                <div class="product-price">${product.price}€</div>
                            </button>
                        `,
                          )
                          .join("")}
                    </div>
                </div>
                
                <div class="cart">
                    <h3>Carrito</h3>
                    <div class="cart-items" id="cart-items">
                        ${cart.length === 0 ? '<p style="color: #999; text-align: center;">Vacío</p>' : ""}
                        ${cart
                          .map(
                            (item, idx) => `
                            <div class="cart-item">
                                <div class="item-info">
                                    <div class="item-name">${item.name}</div>
                                    <div class="item-price">${(item.price)}€</div>
                                </div>
                                <div class="item-controls">
                                    <button class="qty-btn" onclick="updateCart(${idx}, -1)">−</button>
                                    <input class="qty-input" type="number" value="${item.quantity}" 
                                           onchange="setQuantity(${idx}, this.value)">
                                    <button class="qty-btn" onclick="updateCart(${idx}, 1)">+</button>
                                    <button class="delete-btn" onclick="removeFromCart(${idx})">🗑️</button>
                                </div>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                    
                    <div class="cart-total">
                        <div class="total-label">Total</div>
                        <div class="total-value">${(total)}€</div>
                    </div>

                    <button class="clear-cart" onclick="checkoutCart()" ${cart.length === 0 ? 'disabled' : ''}>Comprar</button>
                    <button class="clear-cart" onclick="clearCart()">Limpiar carrito</button>
                </div>
            </div>
        </div>
    `
}

function checkoutCart() {
    if (cart.length === 0) return;

    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    const results = [];
    cart.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
            results.push(item.name);
        }
    });

    history.push({
        game: '🛒 Carrito',
        pack: `Compra en caja ( ${total}€ )`,
        results
    });

    cart = [];
    navigateTo('home');
}


function renderHistory() {
    if (history.length === 0) return '';

    return `
        <div class="history-section">
            <h3>📊 Historial de tiradas</h3>
            <div class="history-items">
                ${history.slice().reverse().map(item => {
                    
                    // Contar repeticiones
                    const counts = {};
                    item.results.forEach(r => {
                        const clean = r.replace(/^[^a-zA-Z0-9]+/, "").trim(); // limpia emojis
                        counts[clean] = (counts[clean] || 0) + 1;
                    });

                    // Generar línea formateada
                    const formatted = Object.entries(counts)
                        .map(([name, qty]) => `${qty} ${name}`)
                        .join(" // ");

                    return `
                        <div class="history-item">
                            <div class="history-game">${item.game}</div>
                            <div class="history-pack">
                                ${item.pack}: ${formatted}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}


// FUNCIONES
function navigateTo(page) {
    currentPage = page;
    selectedPack = null;
    gameResults = [];
    render();
}

function selectPack(packId, category, version) {
    selectedPack = PACKS.find(p => p.id === packId);
    currentGame = category;
    currentVersion = version; // 🔑 guarda la versión
    gameResults = [];
    render();
}

function attachDiceHandlers() {
    const d1 = document.getElementById('dice1');
    const d2 = document.getElementById('dice2');
    const confirmBtn = document.getElementById('confirm');

    // Limpiamos listeners previos por si los hubiera (evita doble ejecución)
    if (d1) {
        d1.onkeydown = null;
    }
    if (d2) {
        d2.onkeydown = null;
    }

    if (d1) {
        d1.onkeydown = function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                // saltar al dado 2
                if (d2) {
                    d2.focus();
                    d2.select && d2.select();
                }
            }
        };
    }

    if (d2) {
        d2.onkeydown = function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                // si el botón de confirmar está deshabilitado, no hacemos nada
                if (confirmBtn && confirmBtn.disabled) return;

                // Llamamos a la función que confirma la tirada
                confirmRoll(currentGame, currentVersion);

                // Forzar foco en dice1 DESPUÉS del render (uso requestAnimationFrame + setTimeout por seguridad)
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        const newD1 = document.getElementById('dice1');
                        if (newD1) {
                            newD1.focus();
                            newD1.select && newD1.select();
                        }
                    }, 30);
                });
            }
        };
    }
}


function handleDiceInput(event, current, next, gameType) {
    if (event.key !== "Enter") return;

    const dice1 = document.getElementById("dice1");
    const dice2 = document.getElementById("dice2");
    const confirmBtn = document.getElementById("confirm");

    if (current === "dice1") {
        dice2.focus();
        dice2.select();
        return;
    }

    if (current === "dice2") {
        if (!confirmBtn.disabled) {
            confirmRoll(gameType);

            setTimeout(() => {
                dice1.focus();
                dice1.select();
            }, 50);
        }
        return;
    }
}

function confirmRoll(category, version) {
    const d1 = document.getElementById('dice1');
    const d2 = document.getElementById('dice2');

    const dice1 = d1 ? parseInt(d1.value) : NaN;
    const dice2 = d2 ? parseInt(d2.value) : NaN;

    if (!dice1 || !dice2 || dice1 < 1 || dice1 > 6 || dice2 < 1 || dice2 > 6) {
        alert('Ingresa valores válidos (1-6)');
        return;
    }

    const table = GAME_TABLES[category][version];
    const key = `${dice1}-${dice2}`;
    const result = table[key] || '❌ No encontrado';

    gameResults.push(result);

    // limpiamos valores en los elementos actuales (por si acaso)
    if (d1) d1.value = '';
    if (d2) d2.value = '';

    // RENDER y luego forzamos foco en dice1 y re-adjuntamos handlers
    render();

requestAnimationFrame(() => {
    setTimeout(() => {
        const d1 = document.getElementById('dice1');
        if (d1) {
            d1.focus();
            d1.select && d1.select();
        }
        attachDiceHandlers();
    }, 30);
});

}


function finishGame(gameType) {
    const base = gameType.split('-')[0];

    const titles = {
        cars: '🏎️ Coches',
        funkos: '🎨 Funkos',
        plushies: '🧸 Peluches'
    };

    history.push({
        game: titles[base],
        pack: selectedPack.name,
        results: gameResults
    });

    navigateTo('home');
}


function addToCart(product) {
    const existing = cart.find(item => item.name === product.name);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    render();
}

function updateCart(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    render();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    render();
}

function setQuantity(index, value) {
    const qty = parseInt(value);
    if (qty > 0) {
        cart[index].quantity = qty;
    } else {
        cart.splice(index, 1);
    }
    render();
}

function clearCart() {
    cart = [];
    render();
}

function changeCategory(category) {
    selectedCategory = category
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = PRODUCTS[category].map(product => `
        <button class="product-btn ${product.special ? 'product-special' : ''}"
                onclick='addToCart(${JSON.stringify(product)})'>
            <div class="product-name">${product.name}</div>
            <div class="product-price">${product.price}€</div>
        </button>
    `).join('');
}

// INICIAR
render();