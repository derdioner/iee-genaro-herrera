export const MIGO_TOKEN = 'CSqZeeppmaJm4sxZUsSIUerIcz61PPFnmuOsWyq6GSybBWf0cN0wW7QKaF1u';
export const MIGO_API_URL = 'https://api.migo.pe/api/v2/';

/**
 * Consulta un DNI en la API de Migo
 * @param {string} dni 
 * @returns {Promise<{success: boolean, nombre?: string, dni?: string, message?: string}>}
 */
export async function consultarDNI(dni) {
    if (!dni || dni.length !== 8) return { success: false, message: 'DNI inválido' };

    try {
        const response = await fetch(`${MIGO_API_URL}dni/${dni}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${MIGO_TOKEN}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            return { success: false, message: errData.message || `Error del servidor: ${response.status}` };
        }

        const data = await response.json();
        if (data.success) {
            return {
                success: true,
                nombre: data.nombre,
                dni: data.dni
            };
        } else {
            return { success: false, message: data.message || 'No se encontró el DNI' };
        }
    } catch (error) {
        console.error("Error Migo DNI:", error);
        return { success: false, message: 'Error de conexión: Revisa tu internet o el token.' };
    }
}

/**
 * Envía un mensaje de WhatsApp vía Migo
 * @param {string} phone 
 * @param {string} message 
 */
export async function enviarWhatsApp(phone, message) {
    if (!phone) return { success: false, message: 'Número inválido' };

    // Limpiar número: Solo dígitos
    let cleanPhone = phone.toString().replace(/\D/g, '');

    // Si tiene 9 dígitos (formato Perú), añadir el prefijo 51
    if (cleanPhone.length === 9) {
        cleanPhone = '51' + cleanPhone;
    }

    try {
        const INSTANCE_NAME = '4259cae0-c1b0-45c9-a0ad-b63a26255511';
        const WHATSAPP_API_KEY = '104DAA81-E330-4D60-AB7A-2F86B3FD4345';

        const response = await fetch(`https://chat.migo.pe/message/sendText/${INSTANCE_NAME}`, {
            method: 'POST',
            headers: {
                'apikey': WHATSAPP_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                number: cleanPhone,
                text: message // Migo WA uses 'text', not 'message'
            })
        });
        return await response.json();
    } catch (error) {
        console.error("Error WhatsApp Migo:", error);
        return { success: false, message: 'Error enviando WhatsApp' };
    }
}

/**
 * Envía un archivo multimedia (imagen/documento) vía Migo
 * @param {string} phone 
 * @param {string} base64Data (sin el prefijo data:image/png;base64,)
 * @param {string} mediatype ('image' o 'document')
 * @param {string} mimetype (ej: 'image/png')
 */
export async function enviarWhatsAppMedia(phone, base64Data, mediatype = 'image', mimetype = 'image/png') {
    if (!phone || !base64Data) return { success: false, message: 'Faltan parámetros' };

    // Limpiar número: Solo dígitos
    let cleanPhone = phone.toString().replace(/\D/g, '');
    if (cleanPhone.length === 9) {
        cleanPhone = '51' + cleanPhone;
    }

    try {
        const INSTANCE_NAME = '4259cae0-c1b0-45c9-a0ad-b63a26255511';
        const WHATSAPP_API_KEY = '104DAA81-E330-4D60-AB7A-2F86B3FD4345';

        const response = await fetch(`https://chat.migo.pe/message/sendMedia/${INSTANCE_NAME}`, {
            method: 'POST',
            headers: {
                'apikey': WHATSAPP_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                number: cleanPhone,
                mediatype: mediatype,
                mimetype: mimetype,
                media: base64Data
            })
        });
        return await response.json();
    } catch (error) {
        console.error("Error WhatsApp Migo Media:", error);
        return { success: false, message: 'Error enviando archivo multimedia' };
    }
}
