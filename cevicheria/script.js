// DATA STORE (LocalStorage wrapper)
const DB_KEY = 'cevicheria_data';

// Initialize Data if empty
// Initialize Data if empty or missing new tables
function initDB() {
    let data = getDB();
    let updated = false;

    // Check if empty
    if (Object.keys(data).length === 0) {
        for (let i = 1; i <= 20; i++) {
            data[`mesa_${i}`] = {
                id: i,
                status: 'free',
                items: [],
                total: 0
            };
        }
        updated = true;
    } else {
        // Migration: Check for missing tables (e.g., mesa_11 to mesa_20)
        for (let i = 1; i <= 20; i++) {
            if (!data[`mesa_${i}`]) {
                data[`mesa_${i}`] = {
                    id: i,
                    status: 'free',
                    items: [],
                    total: 0
                };
                updated = true;
            }
        }
    }

    if (updated) {
        saveDB(data);
    }
}

function getDB() {
    return JSON.parse(localStorage.getItem(DB_KEY) || '{}');
}

function saveDB(data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
    // Trigger event for other tabs
    window.dispatchEvent(new Event('storage'));
}

// HISTORY FUNCTIONS
const HIST_KEY = 'cevicheria_history';

function getHistory() {
    return JSON.parse(localStorage.getItem(HIST_KEY) || '[]');
}

function addToHistory(mesaData) {
    if (!mesaData.items || mesaData.items.length === 0) return;

    const history = getHistory();
    const entry = {
        date: new Date().toISOString(), // ISO format for easy sorting
        timestamp: Date.now(),
        mesaId: mesaData.id,
        items: mesaData.items,
        total: mesaData.total
    };

    history.push(entry);
    localStorage.setItem(HIST_KEY, JSON.stringify(history));
}

function getDailyReport() {
    const history = getHistory();
    const today = new Date().toLocaleDateString();

    // Filter for today
    const todaySales = history.filter(h => new Date(h.timestamp).toLocaleDateString() === today);

    const totalRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);

    // Count products and gather details
    const productCounts = {};
    const productDetails = {};

    todaySales.forEach(sale => {
        const time = new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        sale.items.forEach(item => {
            // Count
            productCounts[item.name] = (productCounts[item.name] || 0) + 1;

            // Details
            if (!productDetails[item.name]) productDetails[item.name] = [];
            productDetails[item.name].push({ mesa: sale.mesaId, time: time });
        });
    });

    return {
        totalRevenue,
        productCounts,
        productDetails,
        salesCount: todaySales.length
    };
}

// CARTA
// CARTA
const MENU = [
    // CEVICHES
    { id: 101, name: 'Ceviche Simple', price: 25.00, category: 'CEVICHES' },
    { id: 102, name: 'Ceviche Mixto', price: 33.00, category: 'CEVICHES' },
    { id: 103, name: 'Ceviche de Conchas Negras', price: 45.00, category: 'CEVICHES' },

    // CHICHARRONES
    { id: 201, name: 'Chicharrón de Pescado', price: 25.00, category: 'CHICHARRONES' },
    { id: 202, name: 'Chicharrón de Calamar', price: 30.00, category: 'CHICHARRONES' },
    { id: 203, name: 'Chicharrón de Pollo', price: 35.00, category: 'CHICHARRONES' },

    // JALEAS
    { id: 301, name: 'Jalea Simple', price: 35.00, category: 'JALEAS' },
    { id: 302, name: 'Jalea Mixta', price: 40.00, category: 'JALEAS' },

    // CHAUFAS
    { id: 401, name: 'Chaufa de Mariscos', price: 28.00, category: 'CHAUFAS' },
    { id: 402, name: 'Chaufa de Pollo', price: 25.00, category: 'CHAUFAS' },
    { id: 403, name: 'Arroz con Marisco', price: 30.00, category: 'CHAUFAS' },
    { id: 404, name: 'Aeropuerto de Marisco', price: 30.00, category: 'CHAUFAS' },

    // DUOS MARINOS
    { id: 501, name: 'Ceviche Simple + Arroz con Mariscos o Chaufa de Mariscos', price: 35.00, category: 'DUOS MARINOS' },
    { id: 502, name: 'Ceviche Mixto + Arroz con Mariscos o Chaufa de Mariscos', price: 38.00, category: 'DUOS MARINOS' },
    { id: 503, name: 'Arroz con Mariscos o Chaufa de Mariscos + Chicharrón de Pescado o Pollo', price: 35.00, category: 'DUOS MARINOS' },
    { id: 504, name: 'Arroz con Mariscos o Chaufa de Mariscos + Chicharrón de Calamar', price: 40.00, category: 'DUOS MARINOS' },

    // TRIOS MARINOS
    { id: 601, name: 'TRIO 1: Ceviche Simple + Chicharrón de Pescado + Arroz con Mariscos', price: 40.00, category: 'TRIOS MARINOS' },
    { id: 602, name: 'TRIO 2: Ceviche Mixto + Chicharrón de Pescado + Arroz con Mariscos', price: 45.00, category: 'TRIOS MARINOS' },

    // COMBOS
    { id: 701, name: 'COMBO 1: Ceviche Simple + Chicharrón de Pescado', price: 30.00, category: 'COMBOS' },
    { id: 702, name: 'COMBO 2: Ceviche Mixto + Chicharrón de Pescado', price: 37.00, category: 'COMBOS' },
    { id: 703, name: 'COMBO 3: Ceviche Mixto + Chicharrón de Calamar', price: 40.00, category: 'COMBOS' },
    { id: 704, name: 'COMBO 4: Ceviche Simple + Chicharrón de Calamar', price: 35.00, category: 'COMBOS' },

    // CAUSAS
    { id: 801, name: 'Causa Tradicional', price: 15.00, category: 'CAUSAS' },
    { id: 802, name: 'Causa Acevichada', price: 30.00, category: 'CAUSAS' },
    { id: 803, name: 'Causa Acevichada Mixta', price: 35.00, category: 'CAUSAS' },
    { id: 804, name: 'Causa Acevichada Puro Marisco', price: 40.00, category: 'CAUSAS' },

    // PORCIONES
    { id: 901, name: 'Porción de Arroz', price: 5.00, category: 'PORCIONES' },
    { id: 902, name: 'Maduro', price: 5.00, category: 'PORCIONES' },
    { id: 903, name: 'Chifle', price: 5.00, category: 'PORCIONES' },
    { id: 904, name: 'Calamar', price: 15.00, category: 'PORCIONES' },
    { id: 905, name: 'Chicharón de Pescado (Porción)', price: 10.00, category: 'PORCIONES' },
    { id: 906, name: 'Chicharrón de Pollo (Porción)', price: 10.00, category: 'PORCIONES' },
    { id: 907, name: 'Yuca Frita', price: 5.00, category: 'PORCIONES' },
    { id: 908, name: 'Yuca Sancochada', price: 5.00, category: 'PORCIONES' },

    // A LA PARRILLA
    { id: 1001, name: 'Anticucho', price: 20.00, category: 'A LA PARRILLA' },
    { id: 1002, name: 'Rachi', price: 20.00, category: 'A LA PARRILLA' },
    { id: 1003, name: 'Mollejita', price: 20.00, category: 'A LA PARRILLA' },
    { id: 1004, name: 'Churrasco', price: 28.00, category: 'A LA PARRILLA' },
    { id: 1005, name: 'Chuleta', price: 28.00, category: 'A LA PARRILLA' },
    { id: 1006, name: 'Picana Brasileira', price: 70.00, category: 'A LA PARRILLA' },
    { id: 1007, name: 'Pechuga o Pierna a la Parrilla', price: 25.00, category: 'A LA PARRILLA' },
    { id: 1008, name: 'Bife Angosto', price: 30.00, category: 'A LA PARRILLA' },
    { id: 1009, name: 'Lomo Fino', price: 40.00, category: 'A LA PARRILLA' },
    { id: 1010, name: 'Costilla Ahumada', price: 30.00, category: 'A LA PARRILLA' },
    { id: 1011, name: 'Cecina con Patacones', price: 28.00, category: 'A LA PARRILLA' },
    { id: 1012, name: 'Chorizo con Patacones', price: 25.00, category: 'A LA PARRILLA' },
    { id: 1013, name: 'Chaufa de Res', price: 28.00, category: 'A LA PARRILLA' },
    { id: 1014, name: 'Chaufa Amazónico', price: 30.00, category: 'A LA PARRILLA' },
    { id: 1015, name: 'Chaufa 21', price: 28.00, category: 'A LA PARRILLA' },
    { id: 1016, name: 'Fetuccini a lo Alfredo', price: 22.00, category: 'A LA PARRILLA' },
    { id: 1017, name: 'Fetuccini a lo Alfredo con Pechuga', price: 28.00, category: 'A LA PARRILLA' },
    { id: 1018, name: 'Alitas BBQ', price: 15.00, category: 'A LA PARRILLA' },
    { id: 1019, name: 'Alitas Acevichadas', price: 17.00, category: 'A LA PARRILLA' },

    // TRIO PARRILLERO
    { id: 1101, name: 'Anticucho + Rachi + Mollejita', price: 30.00, category: 'TRIO PARRILLERO' },

    // DUO PARRILLERO
    { id: 1201, name: 'Anticucho + Rachi o Mollejita', price: 28.00, category: 'DUO PARRILLERO' },

    // CRIOLLOS
    { id: 1301, name: 'Saltado de Pollo', price: 28.00, category: 'CRIOLLOS' },
    { id: 1302, name: 'Lomo Saltado (Res)', price: 30.00, category: 'CRIOLLOS' },
    { id: 1303, name: 'Tallarín Saltado Criollo (Res)', price: 30.00, category: 'CRIOLLOS' },
    { id: 1304, name: 'Tallarín Saltado Criollo (Pollo)', price: 28.00, category: 'CRIOLLOS' },
    { id: 1305, name: 'Pechuga o Pierna a la Plancha', price: 25.00, category: 'CRIOLLOS' },

    // GUARNICIONES
    { id: 1401, name: 'Papa Sancochada', price: 5.00, category: 'GUARNICIONES' },
    { id: 1402, name: 'Papas Fritas', price: 5.00, category: 'GUARNICIONES' },
    { id: 1403, name: 'Papas Doradas', price: 5.00, category: 'GUARNICIONES' },
    { id: 1404, name: 'Patacones', price: 5.00, category: 'GUARNICIONES' },

    // BEBIDAS
    { id: 1501, name: 'Inca o Coca Personal de Vidrio', price: 3.00, category: 'BEBIDAS' },
    { id: 1502, name: 'Inca o Coca Personal Descartable', price: 4.00, category: 'BEBIDAS' },
    { id: 1503, name: 'Gordita Inca Kola', price: 5.00, category: 'BEBIDAS' },
    { id: 1504, name: 'Agua Mineral Sin Gas', price: 3.00, category: 'BEBIDAS' },
    { id: 1505, name: 'Inca o Coca de Vidrio 1Lt', price: 9.00, category: 'BEBIDAS' },
    { id: 1506, name: 'Inca o Coca 1.5 Lt', price: 12.00, category: 'BEBIDAS' },
    { id: 1507, name: 'Inca o Coca 2.25 Lt', price: 20.00, category: 'BEBIDAS' },
    { id: 1508, name: 'Jarra de Refresco 1Lt', price: 12.00, category: 'BEBIDAS' },
    { id: 1509, name: 'Refresco Personal', price: 6.00, category: 'BEBIDAS' },
    { id: 1510, name: 'San Juan', price: 7.00, category: 'BEBIDAS' },
    { id: 1511, name: 'Cuzqueña Trigo', price: 8.00, category: 'BEBIDAS' },
    { id: 1512, name: 'Mikes', price: 6.00, category: 'BEBIDAS' },
    { id: 1513, name: 'Pilsen Personal', price: 7.00, category: 'BEBIDAS' }
];

// SHARED FUNCTIONS
function formatMoney(amount) {
    return `S/ ${amount.toFixed(2)}`;
}

// Listen for updates across tabs
window.addEventListener('storage', () => {
    if (typeof renderTables === 'function') renderTables();
});

// Init on load
initDB();
