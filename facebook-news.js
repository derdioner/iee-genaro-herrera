// Facebook Graph API Integration
// IMPORTANT: This requires a valid Page Access Token.
// For a static site, this token is visible to anyone who views the source.
// It is recommended to use a middleware (like Cloudflare Worker/Vercel API) to hide the token,
// OR use a long-lived User Token with strictly limited permissions.

const PAGE_ID = 'ieegenaroherrera';
// You must replace 'YOUR_ACCESS_TOKEN_HERE' with a valid Page or User Access Token
const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN_HERE';
const NEWS_GRID_ID = 'news-grid';

// Fallback data in case API fails or no token is provided
const FALLBACK_NEWS = [
    {
        message: "Clausura del Año Escolar 2025. Cerramos un año lleno de aprendizajes y logros. ¡Felices vacaciones!",
        full_picture: "https://images.unsplash.com/photo-1544531833-e8c75dd841df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        created_time: "2025-12-15T12:00:00+0000",
        permalink_url: "https://www.facebook.com/ieegenaroherrera"
    },
    {
        message: "Ganadores en Olimpiadas de Matemáticas. Nuestros alumnos de secundaria obtuvieron medalla de oro a nivel regional.",
        full_picture: "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        created_time: "2025-12-10T09:30:00+0000",
        permalink_url: "https://www.facebook.com/ieegenaroherrera"
    },
    {
        message: "Exposición de Arte y Cultura. Una muestra del talento artístico de nuestros estudiantes de primaria.",
        full_picture: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        created_time: "2025-12-05T16:45:00+0000",
        permalink_url: "https://www.facebook.com/ieegenaroherrera"
    }
];

async function fetchFacebookPosts() {
    const grid = document.getElementById(NEWS_GRID_ID);
    if (!grid) return;

    // Check if token is configured
    if (ACCESS_TOKEN === 'YOUR_ACCESS_TOKEN_HERE') {
        console.warn('Facebook Access Token not configured. Loading fallback data.');
        renderPosts(FALLBACK_NEWS);
        return;
    }

    try {
        const response = await fetch(`https://graph.facebook.com/v19.0/${PAGE_ID}/posts?fields=message,full_picture,created_time,permalink_url,attachments&limit=3&access_token=${ACCESS_TOKEN}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.data && data.data.length > 0) {
            renderPosts(data.data);
        } else {
            console.log('No posts found via API, using fallback.');
            renderPosts(FALLBACK_NEWS);
        }

    } catch (error) {
        console.error('Error fetching Facebook posts:', error);
        // Fallback on error
        renderPosts(FALLBACK_NEWS);
    }
}

function renderPosts(posts) {
    const grid = document.getElementById(NEWS_GRID_ID);
    grid.innerHTML = ''; // Clear loading spinner

    posts.forEach(post => {
        // Validation: Only show posts that have a picture or message
        if (!post.message && !post.full_picture) return;

        const date = new Date(post.created_time).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
        const truncatedMessage = post.message ? post.message.substring(0, 100) + '...' : 'Ver publicación...';
        const image = post.full_picture || 'images/logo.png'; // Use logo if no image

        const article = document.createElement('article');
        article.className = 'news-card';
        article.innerHTML = `
            <div class="news-img">
                <img src="${image}" alt="Noticia IEE Genaro Herrera">
                <span class="news-date">${date}</span>
            </div>
            <div class="news-content">
                <h3>Noticia Reciente</h3>
                <p>${truncatedMessage}</p>
                <a href="${post.permalink_url}" target="_blank" class="read-more">Leer más <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
        grid.appendChild(article);
    });
}

// Init
document.addEventListener('DOMContentLoaded', fetchFacebookPosts);
