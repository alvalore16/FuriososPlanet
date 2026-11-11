/* =========================================================
   FURIOSOS PLANET · App
   - Juego de dados (Coches / Funkos / Peluches)
   - Caja registradora
   - Historial persistente (localStorage)
   ========================================================= */

// ---------- ESTADO ----------
let currentPage = 'home';     // home | category-<cat> | game-<cat>-<ver> | calculator
let currentGame = '';
let currentVersion = null;
let selectedPack = null;
let gameResults = [];
let lastRollKey = null;     // última combinación de dados (p.ej. "3-5")
let selectedCategory = null;  // categoría activa de la caja
let productSearch = '';

let cart = loadStore('fp_cart', []);
let history = loadStore('fp_history', []);

const CATEGORY_META = {
    cars:     { icon: '🏎️', label: 'Coches',   tagline: 'Coches premium de Los Santos Customs' },
    funkos:   { icon: '🎨', label: 'Funkos',   tagline: 'Versiones clásicas y variadas' },
    plushies: { icon: '🧸', label: 'Peluches', tagline: 'Peluches Furioso y Furioso 2.0' }
};

// ---------- UTILIDADES ----------
function loadStore(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
        return fallback;
    }
}

function saveStore(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* sin almacenamiento */ }
}

function persist() {
    saveStore('fp_cart', cart);
    saveStore('fp_history', history);
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

const euroFormatter = new Intl.NumberFormat('es-ES', { useGrouping: 'always', maximumFractionDigits: 2 });
function formatEuro(n) {
    return `${euroFormatter.format(n || 0)} €`;
}

function cleanName(result) {
    return result.replace(/^[^a-zA-Z0-9]+/, '').trim();
}

function splitResult(result) {
    const idx = result.indexOf(' ');
    if (idx === -1) return { icon: '', name: result };
    return { icon: result.slice(0, idx), name: result.slice(idx + 1) };
}

function resultType(result) {
    if (/nada|no encontrado/i.test(result)) return 'nada';
    if (/tarjeta/i.test(result)) return 'card';
    if (/exclusivo/i.test(result)) return 'exclusive';
    return 'prize';
}

function countResults(results) {
    const counts = {};
    results.forEach(r => {
        const name = cleanName(r);
        counts[name] = counts[name] || { qty: 0, raw: r };
        counts[name].qty++;
    });
    return counts;
}

function summaryText(results) {
    return Object.entries(countResults(results))
        .map(([name, c]) => `${c.qty} ${name}`)
        .join(' // ');
}

function formatDate(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function parseDescription(desc) {
    const m = desc.match(/^(.*?)\s*-\s*\((.*)\)\s*$/);
    return m ? { text: m[1], highlights: m[2] } : { text: desc, highlights: '' };
}

function tableStats(table) {
    const values = Object.values(table);
    const total = values.length;
    const by = { prize: 0, card: 0, nada: 0, exclusive: 0 };
    values.forEach(v => by[resultType(v)]++);
    return { total, ...by };
}

// ---------- TOAST ----------
function toast(message, type = 'info') {
    const root = document.getElementById('toast-root');
    if (!root) return;
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = message;
    root.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 300);
    }, 2600);
}

async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        toast('Copiado al portapapeles', 'success');
    } catch (e) {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); toast('Copiado al portapapeles', 'success'); }
        catch (err) { toast('No se pudo copiar', 'error'); }
        ta.remove();
    }
}

// ---------- ROUTING (hash) ----------
function pageToHash(page) {
    if (page === 'home') return '#/';
    if (page === 'calculator') return '#/caja';
    if (page.startsWith('category-')) return `#/${page.replace('category-', '')}`;
    if (page.startsWith('game-')) {
        const [, cat, ver] = page.split('-');
        return `#/${cat}/${ver}`;
    }
    return '#/';
}

function hashToPage(hash) {
    const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    if (parts.length === 0) return 'home';
    if (parts[0] === 'caja') return 'calculator';
    const [cat, ver] = parts;
    if (!CATEGORY_VERSIONS[cat]) return 'home';
    if (ver && GAME_TABLES[cat] && GAME_TABLES[cat][ver]) return `game-${cat}-${ver}`;
    return `category-${cat}`;
}

function hasUnsavedGame() {
    return currentPage.startsWith('game-') && gameResults.length > 0;
}

function navigateTo(page) {
    if (page !== currentPage && hasUnsavedGame() &&
        !confirm('Tienes tiradas sin guardar en el historial. ¿Salir igualmente?')) {
        return;
    }
    setPage(page);
    const hash = pageToHash(page);
    if (location.hash !== hash) {
        window.history.pushState(null, '', hash);
    }
}

function setPage(page) {
    currentPage = page;
    selectedPack = null;
    gameResults = [];
    lastRollKey = null;
    productSearch = '';
    render();
    window.scrollTo(0, 0);
}

window.addEventListener('popstate', () => setPage(hashToPage(location.hash)));
window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedGame()) { e.preventDefault(); e.returnValue = ''; }
});

function openCategory(category) {
    navigateTo(`category-${category}`);
}

// ---------- RENDER PRINCIPAL ----------
function render() {
    const app = document.getElementById('app');
    let body = '';

    if (currentPage === 'home') {
        body = renderHome();
    } else if (currentPage.startsWith('category-')) {
        body = renderCategory(currentPage.replace('category-', ''));
    } else if (currentPage.startsWith('game-')) {
        const [, category, version] = currentPage.split('-');
        currentGame = category;
        currentVersion = version;
        body = renderGame(category, version);
    } else if (currentPage === 'calculator') {
        body = renderCalculator();
    }

    app.innerHTML = `${renderNavbar()}<main class="page">${body}</main>${renderFooter()}`;

    if (currentPage.startsWith('game-')) {
        attachDiceHandlers();
        focusDice();
    }
    if (currentPage === 'calculator') {
        attachCalculatorHandlers();
    }
}

function renderNavbar() {
    const activeCat = currentPage.startsWith('category-') || currentPage.startsWith('game-')
        ? currentPage.split('-')[1] : null;

    const link = (label, page, active) => `
        <button class="nav-link ${active ? 'active' : ''}" onclick="navigateTo('${page}')">${label}</button>`;

    return `
        <header class="navbar">
            <div class="navbar-inner">
                <button class="brand" onclick="navigateTo('home')" aria-label="Ir al inicio">
                    <img src="image/furiosos.png" alt="" class="brand-logo" width="44" height="44">
                    <span class="brand-text">Furiosos <span>Planet</span></span>
                </button>
                <nav class="nav-links">
                    ${link('Inicio', 'home', currentPage === 'home')}
                    ${Object.entries(CATEGORY_META).map(([key, m]) =>
                        link(`${m.icon} ${m.label}`, `category-${key}`, activeCat === key)).join('')}
                    <button class="nav-link nav-cta ${currentPage === 'calculator' ? 'active' : ''}" onclick="navigateTo('calculator')">
                        🧾 Caja${cart.length ? `<span class="badge">${cart.reduce((s, i) => s + i.quantity, 0)}</span>` : ''}
                    </button>
                </nav>
            </div>
        </header>
    `;
}

function renderFooter() {
    return `
        <footer class="footer">
            <div class="footer-inner">
                <span>⚡ Los Furiosos Planet</span>
                <span class="footer-partner">
                    <img src="image/Los_Santos_Customs_Magnet___Los-santos-customs-removebg-preview.png" alt="Los Santos Customs" width="28" height="28">
                    Tarjetas LSC
                </span>
            </div>
        </footer>
    `;
}

function renderBackButton(page, label = 'Atrás') {
    return `<button class="back-btn" onclick="navigateTo('${page}')">← ${label}</button>`;
}

// ---------- HOME ----------
function renderHome() {
    const totalGames = history.filter(h => h.type !== 'sale').length;
    const totalSales = history.filter(h => h.type === 'sale').reduce((s, h) => s + (h.total || 0), 0);

    return `
        <div class="container fade-in">
            <section class="hero">
                <div class="hero-content">
                    <span class="eyebrow">🎲 Juego de dados</span>
                    <h1>Bienvenido a <span class="text-accent">Furiosos Planet</span></h1>
                    <p>Elige una categoría, selecciona un pack y registra las tiradas. Todo queda guardado en el historial.</p>
                    <div class="hero-actions">
                        <button class="btn btn-primary" onclick="document.getElementById('categorias').scrollIntoView({ behavior: 'smooth' })">Empezar a jugar</button>
                        <button class="btn btn-ghost" onclick="navigateTo('calculator')">🧾 Abrir caja</button>
                    </div>
                </div>
                <div class="hero-logo">
                    <img src="image/furiosos.png" alt="Logo Los Furiosos Planet" width="260" height="260">
                </div>
            </section>

            <section id="categorias" class="section">
                <div class="section-head">
                    <h2>Categorías</h2>
                    <p>Selecciona el tipo de premio</p>
                </div>
                <div class="games-grid">
                    ${Object.entries(CATEGORY_META).map(([key, m]) => `
                        <button class="game-card" onclick="openCategory('${key}')">
                            <span class="card-icon">${m.icon}</span>
                            <h3>${m.label}</h3>
                            <p>${m.tagline}</p>
                            <span class="card-meta">${CATEGORY_VERSIONS[key].versions.length} versiones <span class="arrow">→</span></span>
                        </button>
                    `).join('')}
                </div>
            </section>

            ${history.length ? `
                <section class="stats-strip">
                    <div><span class="strip-value">${totalGames}</span><span class="strip-label">Partidas registradas</span></div>
                    <div><span class="strip-value">${history.filter(h => h.type === 'sale').length}</span><span class="strip-label">Ventas en caja</span></div>
                    <div><span class="strip-value">${formatEuro(totalSales)}</span><span class="strip-label">Facturado en caja</span></div>
                </section>
            ` : ''}

            ${renderHistory()}
        </div>
    `;
}

// ---------- CATEGORÍA ----------
function renderCategory(category) {
    const config = CATEGORY_VERSIONS[category];
    if (!config) return '';
    const meta = CATEGORY_META[category];

    return `
        <div class="container fade-in">
            <div class="page-top">${renderBackButton('home', 'Inicio')}</div>

            <section class="page-header">
                <span class="page-icon">${meta.icon}</span>
                <div>
                    <h1>${escapeHtml(cleanName(config.title))}</h1>
                    <p>Selecciona la versión del juego</p>
                </div>
            </section>

            <div class="games-grid versions-grid">
                ${config.versions.map(v => {
                    const d = parseDescription(v.description);
                    const s = tableStats(GAME_TABLES[category][v.id]);
                    const winPct = Math.round(((s.prize + s.exclusive) / s.total) * 100);
                    return `
                        <button class="game-card version-card" onclick="navigateTo('game-${category}-${v.id}')">
                            <h3>${escapeHtml(v.name)}</h3>
                            <p>${escapeHtml(d.text)}</p>
                            ${d.highlights ? `<div class="highlights"><span>Destacados</span>${escapeHtml(d.highlights)}</div>` : ''}
                            <div class="odds">
                                <div class="odds-bar">
                                    <i class="o-prize" style="width:${(s.prize + s.exclusive) / s.total * 100}%"></i>
                                    <i class="o-card" style="width:${s.card / s.total * 100}%"></i>
                                    <i class="o-nada" style="width:${s.nada / s.total * 100}%"></i>
                                </div>
                                <div class="odds-legend">
                                    <span><i class="dot o-prize"></i>Premio ${winPct}%</span>
                                    <span><i class="dot o-card"></i>Tarjeta ${Math.round(s.card / s.total * 100)}%</span>
                                    <span><i class="dot o-nada"></i>Nada ${Math.round(s.nada / s.total * 100)}%</span>
                                </div>
                            </div>
                            <span class="card-meta">Jugar <span class="arrow">→</span></span>
                        </button>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// ---------- JUEGO ----------
function getVersion(category, version) {
    const config = CATEGORY_VERSIONS[category];
    return config ? config.versions.find(v => v.id === version) : null;
}

function renderGame(category, version) {
    const v = getVersion(category, version);
    const meta = CATEGORY_META[category];
    const title = v ? v.name : meta.label;

    return `
        <div class="container fade-in">
            <div class="page-top">${renderBackButton(`category-${category}`, meta.label)}</div>

            <section class="page-header">
                <span class="page-icon">${meta.icon}</span>
                <div>
                    <h1>${escapeHtml(cleanName(title))}</h1>
                    <p>${selectedPack ? `Pack <strong>${escapeHtml(selectedPack.name)}</strong> · ${selectedPack.tiradas} tiradas · ${escapeHtml(selectedPack.precio)}` : 'Selecciona un pack para empezar'}</p>
                </div>
            </section>

            <section class="section">
                <div class="section-head compact"><h2>1 · Elige un pack</h2></div>
                <div class="packs-container">
                    ${PACKS.map(pack => `
                        <button class="pack-btn ${selectedPack?.id === pack.id ? 'selected' : ''}"
                                onclick="selectPack(${pack.id}, '${category}', '${version}')">
                            <div class="pack-top">
                                <span class="pack-rolls">${pack.tiradas}<small>tiradas</small></span>
                                <span class="pack-price">${escapeHtml(pack.precio)}</span>
                            </div>
                            <div class="pack-name">${escapeHtml(pack.name)}</div>
                            <div class="pack-info">${escapeHtml(pack.description)}</div>
                        </button>
                    `).join('')}
                </div>
            </section>

            ${selectedPack ? renderGameInterface(category, version) : ''}
        </div>
    `;
}

function renderGameInterface(category, version) {
    const table = GAME_TABLES[category][version];
    const tiradaCount = gameResults.length;
    const tiradaTotal = selectedPack.tiradas;
    const progress = Math.min(100, (tiradaCount / tiradaTotal) * 100);
    const finished = tiradaCount >= tiradaTotal;
    const last = gameResults[gameResults.length - 1];
    const lastKey = lastRollKey;
    const counts = countResults(gameResults);
    const hasExclusive = category === 'plushies' && gameResults.some(r => resultType(r) === 'exclusive');

    return `
    <section class="section" id="game-zone">
        <div class="section-head compact"><h2>2 · Registra las tiradas</h2></div>

        <div class="game-interface">
            <div class="panel">
                <div class="input-section">
                    <h3>Introduce los dados</h3>
                    <p class="hint">Escribe el <kbd>dado 1</kbd>, pulsa <kbd>Enter</kbd>, escribe el <kbd>dado 2</kbd> y pulsa <kbd>Enter</kbd> para confirmar.</p>
                    <div class="dice-input">
                        <label class="die">
                            <span>Dado 1</span>
                            <input type="number" id="dice1" min="1" max="6" inputmode="numeric" placeholder="–" ${finished ? 'disabled' : ''}>
                        </label>
                        <span class="dice-sep">+</span>
                        <label class="die">
                            <span>Dado 2</span>
                            <input type="number" id="dice2" min="1" max="6" inputmode="numeric" placeholder="–" ${finished ? 'disabled' : ''}>
                        </label>
                    </div>
                    <div class="row-actions">
                        <button class="btn btn-primary grow" id="confirm"
                                onclick="confirmRoll('${category}', '${version}')"
                                ${finished ? 'disabled' : ''}>
                            Confirmar tirada <span class="muted-inline">(${tiradaCount}/${tiradaTotal})</span>
                        </button>
                        <button class="btn btn-ghost" onclick="undoRoll()" ${tiradaCount === 0 ? 'disabled' : ''} title="Deshacer última tirada">↶ Deshacer</button>
                    </div>
                </div>

                <div class="progress">
                    <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
                    <span class="progress-label">${Math.round(progress)}%</span>
                </div>

                <div class="stats">
                    <div class="stat-box">
                        <div class="stat-label">Realizadas</div>
                        <div class="stat-value">${tiradaCount}<small>/${tiradaTotal}</small></div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Restantes</div>
                        <div class="stat-value">${Math.max(0, tiradaTotal - tiradaCount)}</div>
                    </div>
                </div>

                ${last ? `
                    <div class="last-result type-${resultType(last)}">
                        <span class="last-label">Última tirada${lastKey ? ` · ${lastKey.replace('-', ' + ')}` : ''}</span>
                        <span class="last-icon">${splitResult(last).icon}</span>
                        <span class="last-name">${escapeHtml(splitResult(last).name)}</span>
                    </div>
                ` : ''}

                ${hasExclusive ? renderExclusiveInfo() : ''}

                ${finished ? `
                    <div class="complete-box">
                        <h3>🎉 ¡Juego completado!</h3>
                        <p>${escapeHtml(summaryText(gameResults))}</p>
                        <div class="row-actions">
                            <button class="btn btn-primary grow" onclick="finishGame('${category}')">Guardar en historial</button>
                            <button class="btn btn-ghost" onclick="copyText(summaryText(gameResults))">Copiar</button>
                        </div>
                    </div>
                ` : ''}
            </div>

            <div class="panel">
                <div class="results-section">
                    <div class="panel-head">
                        <h3>Resumen</h3>
                        ${gameResults.length ? `<button class="link-btn" onclick="copyText(summaryText(gameResults))">Copiar</button>` : ''}
                    </div>
                    ${gameResults.length ? `
                        <div class="chips">
                            ${Object.entries(counts).map(([name, c]) => `
                                <span class="chip type-${resultType(c.raw)}"><b>${c.qty}×</b> ${escapeHtml(name)}</span>
                            `).join('')}
                        </div>
                    ` : '<p class="empty">Aún no hay resultados</p>'}
                </div>

                <div class="results-section">
                    <h3>Tiradas</h3>
                    ${gameResults.length ? `
                        <ol class="results-list">
                            ${gameResults.map((result, idx) => `
                                <li class="result-item type-${resultType(result)}">
                                    <span class="result-count">#${idx + 1}</span>
                                    <span>${escapeHtml(result)}</span>
                                </li>
                            `).join('')}
                        </ol>
                    ` : '<p class="empty">Las tiradas aparecerán aquí</p>'}
                </div>
            </div>
        </div>

        <details class="prize-table" open>
            <summary>Tabla de premios <span class="muted-inline">(dado 1 × dado 2)</span></summary>
            <div class="table-scroll">
                <table>
                    <thead>
                        <tr><th></th>${[1, 2, 3, 4, 5, 6].map(n => `<th>${n}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                        ${[1, 2, 3, 4, 5, 6].map(a => `
                            <tr>
                                <th>${a}</th>
                                ${[1, 2, 3, 4, 5, 6].map(b => {
                                    const key = `${a}-${b}`;
                                    const r = table[key] || '';
                                    const s = splitResult(r);
                                    return `<td class="type-${resultType(r)} ${key === lastKey ? 'hit' : ''}">
                                        <span class="cell-icon">${s.icon}</span><span class="cell-name">${escapeHtml(s.name)}</span>
                                    </td>`;
                                }).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </details>
    </section>
    `;
}

function renderExclusiveInfo() {
    const groups = {};
    Object.entries(PLUSHIES_EXCLUSIVE).forEach(([n, r]) => {
        (groups[r] = groups[r] || []).push(n);
    });
    return `
        <div class="exclusive-box">
            <h4>✨ Tirada de exclusivo</h4>
            <p>Tira un dado para resolver el exclusivo:</p>
            <ul>
                ${Object.entries(groups).map(([r, nums]) => `<li><b>${nums.join(' · ')}</b> → ${escapeHtml(r)}</li>`).join('')}
            </ul>
        </div>
    `;
}

function selectPack(packId, category, version) {
    if (gameResults.length > 0 && selectedPack?.id !== packId &&
        !confirm('Cambiar de pack reiniciará las tiradas actuales. ¿Continuar?')) {
        return;
    }
    if (selectedPack?.id === packId) return;
    selectedPack = PACKS.find(p => p.id === packId);
    currentGame = category;
    currentVersion = version;
    gameResults = [];
    lastRollKey = null;
    render();
    const zone = document.getElementById('game-zone');
    if (zone) zone.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function focusDice() {
    requestAnimationFrame(() => {
        const d1 = document.getElementById('dice1');
        if (d1 && !d1.disabled) {
            d1.focus({ preventScroll: true });
            d1.select && d1.select();
        }
    });
}

function attachDiceHandlers() {
    const d1 = document.getElementById('dice1');
    const d2 = document.getElementById('dice2');
    if (!d1 || !d2) return;

    // Solo un dígito válido (1-6) por dado
    [d1, d2].forEach(input => {
        input.addEventListener('input', () => {
            const digits = input.value.replace(/[^1-6]/g, '');
            input.value = digits.slice(-1);
            input.classList.remove('invalid');
        });
        input.addEventListener('focus', () => input.select && input.select());
    });

    d1.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            d2.focus();
            d2.select && d2.select();
        }
    });

    d2.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const confirmBtn = document.getElementById('confirm');
            if (confirmBtn && confirmBtn.disabled) return;
            confirmRoll(currentGame, currentVersion);
        } else if (e.key === 'Backspace' && d2.value === '') {
            d1.focus();
        }
    });
}

function confirmRoll(category, version) {
    const d1 = document.getElementById('dice1');
    const d2 = document.getElementById('dice2');
    const dice1 = d1 ? parseInt(d1.value, 10) : NaN;
    const dice2 = d2 ? parseInt(d2.value, 10) : NaN;

    const valid = n => Number.isInteger(n) && n >= 1 && n <= 6;
    if (!valid(dice1) || !valid(dice2)) {
        [[d1, dice1], [d2, dice2]].forEach(([el, n]) => {
            if (el && !valid(n)) {
                el.classList.remove('invalid');
                void el.offsetWidth; // reinicia animación
                el.classList.add('invalid');
            }
        });
        toast('Introduce valores válidos (1-6)', 'error');
        const firstBad = !valid(dice1) ? d1 : d2;
        if (firstBad) firstBad.focus();
        return;
    }

    if (!selectedPack || gameResults.length >= selectedPack.tiradas) return;

    const table = GAME_TABLES[category][version];
    const key = `${dice1}-${dice2}`;
    const result = table[key] || '❌ No encontrado';

    gameResults.push(result);
    lastRollKey = key;
    render();
}

function undoRoll() {
    if (!gameResults.length) return;
    gameResults.pop();
    lastRollKey = null;
    toast('Última tirada deshecha', 'info');
    render();
}

function finishGame(category) {
    const meta = CATEGORY_META[category];
    const v = getVersion(category, currentVersion);
    history.push({
        type: 'game',
        game: `${meta.icon} ${meta.label}`,
        version: v ? cleanName(v.name) : '',
        pack: selectedPack.name,
        results: gameResults.slice(),
        date: Date.now()
    });
    persist();
    gameResults = [];
    toast('Partida guardada en el historial', 'success');
    navigateTo('home');
}

// ---------- HISTORIAL ----------
function renderHistory() {
    if (history.length === 0) return '';

    const items = history.map((item, idx) => ({ item, idx })).reverse();

    return `
        <section class="section history-section">
            <div class="section-head with-action">
                <div>
                    <h2>📊 Historial</h2>
                    <p>${history.length} registro${history.length === 1 ? '' : 's'}</p>
                </div>
                <button class="btn btn-ghost btn-sm" onclick="clearHistory()">Borrar historial</button>
            </div>
            <div class="history-items">
                ${items.map(({ item, idx }) => {
                    const counts = countResults(item.results || []);
                    const isSale = item.type === 'sale' || /carrito|caja/i.test(item.game);
                    return `
                        <article class="history-item ${isSale ? 'is-sale' : ''}">
                            <div class="history-head">
                                <div>
                                    <div class="history-game">${escapeHtml(item.game)}${item.version ? ` <span class="muted-inline">· ${escapeHtml(item.version)}</span>` : ''}</div>
                                    <div class="history-pack">${escapeHtml(item.pack)}${item.date ? ` · ${formatDate(item.date)}` : ''}</div>
                                </div>
                                <div class="history-actions">
                                    <button class="link-btn" onclick="copyHistory(${idx})">Copiar</button>
                                    <button class="icon-btn" onclick="removeHistory(${idx})" title="Eliminar" aria-label="Eliminar registro">✕</button>
                                </div>
                            </div>
                            <div class="chips">
                                ${Object.entries(counts).map(([name, c]) => `
                                    <span class="chip type-${isSale ? 'sale' : resultType(c.raw)}"><b>${c.qty}×</b> ${escapeHtml(name)}</span>
                                `).join('')}
                            </div>
                        </article>
                    `;
                }).join('')}
            </div>
        </section>
    `;
}

function copyHistory(idx) {
    const item = history[idx];
    if (!item) return;
    copyText(`${item.pack}: ${summaryText(item.results || [])}`);
}

function removeHistory(idx) {
    history.splice(idx, 1);
    persist();
    render();
}

function clearHistory() {
    if (!confirm('¿Borrar todo el historial? Esta acción no se puede deshacer.')) return;
    history = [];
    persist();
    render();
}

// ---------- CAJA REGISTRADORA ----------
function cartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCalculator() {
    if (selectedCategory == null || !PRODUCTS[selectedCategory]) {
        selectedCategory = Object.keys(PRODUCTS)[0];
    }

    return `
        <div class="container container-wide fade-in">
            <div class="page-top">${renderBackButton('home', 'Inicio')}</div>

            <section class="page-header">
                <span class="page-icon">🧾</span>
                <div>
                    <h1>Caja registradora</h1>
                    <p>Añade productos al carrito y cobra la venta</p>
                </div>
            </section>

            <div class="calculator-container">
                <div class="catalog">
                    <div class="catalog-toolbar">
                        <div class="search">
                            <span aria-hidden="true">🔍</span>
                            <input type="search" id="product-search" placeholder="Buscar producto…" value="${escapeHtml(productSearch)}" autocomplete="off">
                        </div>
                    </div>
                    <div class="categories" id="categories">${renderCategoryTabs()}</div>
                    <div id="products-container" class="products-grid">${renderProducts()}</div>
                </div>

                <aside class="cart" id="cart">${renderCart()}</aside>
            </div>
        </div>
    `;
}

function renderCategoryTabs() {
    return Object.keys(PRODUCTS).map(category => `
        <button class="category-btn ${!productSearch && category === selectedCategory ? 'active' : ''}"
                onclick="changeCategory('${category}')">
            ${escapeHtml(category)} <span class="count">${PRODUCTS[category].length}</span>
        </button>
    `).join('');
}

function renderProducts() {
    const query = productSearch ? normalizeString(productSearch) : '';
    const list = [];

    if (query) {
        Object.entries(PRODUCTS).forEach(([cat, products]) => {
            products.forEach((p, i) => {
                if (normalizeString(p.name).includes(query)) list.push({ p, cat, i });
            });
        });
    } else {
        PRODUCTS[selectedCategory].forEach((p, i) => list.push({ p, cat: selectedCategory, i }));
    }

    if (!list.length) return `<p class="empty">No hay productos que coincidan con "${escapeHtml(productSearch)}"</p>`;

    return list.map(({ p, cat, i }) => {
        const inCart = cart.find(item => item.name === p.name);
        return `
            <button class="product-btn ${p.special ? 'product-special' : ''}" onclick="addToCart('${cat}', ${i})">
                ${p.special ? '<span class="tag">★ Furioso</span>' : ''}
                ${inCart ? `<span class="in-cart">${inCart.quantity}</span>` : ''}
                <span class="product-name">${escapeHtml(p.name)}</span>
                <span class="product-price">${formatEuro(p.price)}</span>
            </button>
        `;
    }).join('');
}

function renderCart() {
    const total = cartTotal();
    const units = cart.reduce((s, i) => s + i.quantity, 0);

    return `
        <div class="cart-head">
            <h3>🛒 Carrito</h3>
            <span class="muted-inline">${units} artículo${units === 1 ? '' : 's'}</span>
        </div>

        <div class="cart-items">
            ${cart.length === 0 ? '<p class="empty">El carrito está vacío</p>' : cart.map((item, idx) => `
                <div class="cart-item">
                    <div class="item-info">
                        <div class="item-name">${escapeHtml(item.name)}</div>
                        <div class="item-price">${formatEuro(item.price)} × ${item.quantity} = <b>${formatEuro(item.price * item.quantity)}</b></div>
                    </div>
                    <div class="item-controls">
                        <button class="qty-btn" onclick="updateCart(${idx}, -1)" aria-label="Quitar uno">−</button>
                        <input class="qty-input" type="number" min="0" value="${item.quantity}"
                               onchange="setQuantity(${idx}, this.value)" aria-label="Cantidad">
                        <button class="qty-btn" onclick="updateCart(${idx}, 1)" aria-label="Añadir uno">+</button>
                        <button class="delete-btn" onclick="removeFromCart(${idx})" aria-label="Eliminar">✕</button>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="cart-total">
            <span class="total-label">Total</span>
            <span class="total-value">${formatEuro(total)}</span>
        </div>

        <div class="change-calc">
            <label for="paid">Paga con</label>
            <input type="number" id="paid" min="0" placeholder="0" inputmode="decimal">
            <span class="change" id="change">Cambio: —</span>
        </div>

        <button class="btn btn-primary btn-block" onclick="checkoutCart()" ${cart.length === 0 ? 'disabled' : ''}>Cobrar ${cart.length ? formatEuro(total) : ''}</button>
        <button class="btn btn-ghost btn-block" onclick="clearCart()" ${cart.length === 0 ? 'disabled' : ''}>Vaciar carrito</button>
    `;
}

function attachCalculatorHandlers() {
    const search = document.getElementById('product-search');
    if (search) {
        search.addEventListener('input', () => {
            productSearch = search.value;
            refreshCatalog();
        });
        search.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                search.value = '';
                productSearch = '';
                refreshCatalog();
            }
        });
    }
    attachChangeHandler();
}

function attachChangeHandler() {
    const paid = document.getElementById('paid');
    const change = document.getElementById('change');
    if (!paid || !change) return;
    paid.addEventListener('input', () => {
        const value = parseFloat(paid.value);
        const total = cartTotal();
        if (isNaN(value) || !paid.value) {
            change.textContent = 'Cambio: —';
            change.className = 'change';
        } else if (value < total) {
            change.textContent = `Faltan ${formatEuro(total - value)}`;
            change.className = 'change negative';
        } else {
            change.textContent = `Cambio: ${formatEuro(value - total)}`;
            change.className = 'change positive';
        }
    });
}

function refreshCatalog() {
    const tabs = document.getElementById('categories');
    const products = document.getElementById('products-container');
    if (tabs) tabs.innerHTML = renderCategoryTabs();
    if (products) products.innerHTML = renderProducts();
}

function refreshCart() {
    persist();
    const cartEl = document.getElementById('cart');
    if (cartEl) {
        cartEl.innerHTML = renderCart();
        attachChangeHandler();
    }
    const products = document.getElementById('products-container');
    if (products) products.innerHTML = renderProducts();
    // actualiza el contador de la navbar
    const badgeHost = document.querySelector('.nav-cta');
    if (badgeHost) {
        const units = cart.reduce((s, i) => s + i.quantity, 0);
        badgeHost.innerHTML = `🧾 Caja${units ? `<span class="badge">${units}</span>` : ''}`;
    }
}

function changeCategory(category) {
    selectedCategory = category;
    productSearch = '';
    const search = document.getElementById('product-search');
    if (search) search.value = '';
    refreshCatalog();
}

function addToCart(category, index) {
    const product = PRODUCTS[category] && PRODUCTS[category][index];
    if (!product) return;
    const existing = cart.find(item => item.name === product.name);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name: product.name, price: product.price, quantity: 1 });
    }
    refreshCart();
}

function updateCart(index, change) {
    if (!cart[index]) return;
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    refreshCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    refreshCart();
}

function setQuantity(index, value) {
    const qty = parseInt(value, 10);
    if (qty > 0) {
        cart[index].quantity = qty;
    } else {
        cart.splice(index, 1);
    }
    refreshCart();
}

function clearCart() {
    if (!cart.length) return;
    cart = [];
    refreshCart();
}

function checkoutCart() {
    if (cart.length === 0) return;
    const total = cartTotal();

    const results = [];
    cart.forEach(item => {
        for (let i = 0; i < item.quantity; i++) results.push(item.name);
    });

    history.push({
        type: 'sale',
        game: '🛒 Caja',
        pack: `Venta · ${formatEuro(total)}`,
        total,
        results,
        date: Date.now()
    });

    cart = [];
    persist();
    toast(`Venta registrada: ${formatEuro(total)}`, 'success');
    navigateTo('home');
}

// ---------- INICIAR ----------
currentPage = hashToPage(location.hash);
render();
