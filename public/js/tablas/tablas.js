document.addEventListener('DOMContentLoaded', function() {
    // Cargar movimientos iniciales
    cargarMovimientos();

    // Obtener todos los inputs y select del formulario
    const form = document.getElementById('filtroForm');
    const filtroInputs = form.querySelectorAll('input, select');

    // Añadir evento change a cada input y select
    filtroInputs.forEach(input => {
        input.addEventListener('change', async function() {
            await cargarMovimientos();
        });
    });

    // Mantener el evento submit por si acaso
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            await cargarMovimientos();
        });
    }

    // Añadir manejo de los sliders
    const importeDesde = document.getElementById('importeDesde');
    const importeHasta = document.getElementById('importeHasta');
    const importeDesdeValue = document.getElementById('importeDesdeValue');
    const importeHastaValue = document.getElementById('importeHastaValue');

    // Función para parsear el valor del badge
    function parsearValorBadge(texto) {
        // Eliminar el símbolo de moneda y los puntos de miles
        return parseInt(texto.replace(/[€.]/g, '').replace(',', '.').trim());
    }

    // Función para validar el valor ingresado
    function validarValor(valor) {
        return !isNaN(valor) && valor >= -10000 && valor <= 10000;
    }

    // Manejar la edición de los badges
    const badges = document.querySelectorAll('.badge[contenteditable="true"]');
    badges.forEach(badge => {
        // Guardar el valor original para restaurar si es inválido
        let valorOriginal;

        badge.addEventListener('focus', function() {
            valorOriginal = this.textContent;
            // Eliminar el símbolo de moneda para edición
            this.textContent = parsearValorBadge(this.textContent);
        });

        badge.addEventListener('blur', function() {
            const valor = parsearValorBadge(this.textContent);
            if (validarValor(valor)) {
                // Actualizar el slider correspondiente
                const sliderId = this.dataset.slider;
                const slider = document.getElementById(sliderId);
                slider.value = valor;
                // Disparar el evento input para actualizar el visual
                slider.dispatchEvent(new Event('input'));
            } else {
                // Restaurar valor original si es inválido
                this.textContent = valorOriginal;
                alert('Por favor, ingrese un valor entre -10.000 y 10.000');
            }
        });

        badge.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.blur();
            }
        });

        // Permitir solo números y teclas de control
        badge.addEventListener('keypress', function(e) {
            const charCode = e.which ? e.which : e.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 45) {
                e.preventDefault();
            }
        });
    });

    // Modificar la función actualizarValorSlider para mantener el foco si se está editando
    function actualizarValorSlider(valor, elemento) {
        if (document.activeElement !== elemento) {
            const num = parseInt(valor);
            const formateado = new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'EUR',
                maximumFractionDigits: 0
            }).format(num);
            
            elemento.textContent = formateado;
            elemento.className = 'badge p-2 ' + (num >= 0 ? 'badge-success' : 'badge-danger');
        }
    }

    // Actualizar valores iniciales
    actualizarValorSlider(importeDesde.value, importeDesdeValue);
    actualizarValorSlider(importeHasta.value, importeHastaValue);

    // Eventos para los sliders
    importeDesde.addEventListener('input', function() {
        actualizarValorSlider(this.value, importeDesdeValue);
        
        // Actualizar visual del track con transición suave
        const porcentajeDesde = ((parseInt(this.value) + 10000) / 20000) * 100;
        const porcentajeHasta = ((parseInt(importeHasta.value) + 10000) / 20000) * 100;
        
        const track = document.querySelector('.slider-track');
        track.style.transition = 'background 0.3s ease';
        track.style.background = `linear-gradient(to right, 
            #e74a3b ${porcentajeDesde}%, 
            #4e73df ${porcentajeDesde}%, 
            #4e73df ${porcentajeHasta}%, 
            #1cc88a ${porcentajeHasta}%)`;
    });

    importeHasta.addEventListener('input', function() {
        actualizarValorSlider(this.value, importeHastaValue);
        
        // Actualizar visual del track con transición suave
        const porcentajeDesde = ((parseInt(importeDesde.value) + 10000) / 20000) * 100;
        const porcentajeHasta = ((parseInt(this.value) + 10000) / 20000) * 100;
        
        const track = document.querySelector('.slider-track');
        track.style.transition = 'background 0.3s ease';
        track.style.background = `linear-gradient(to right, 
            #e74a3b ${porcentajeDesde}%, 
            #4e73df ${porcentajeDesde}%, 
            #4e73df ${porcentajeHasta}%, 
            #1cc88a ${porcentajeHasta}%)`;
    });

    // Añadir evento change para los sliders
    importeDesde.addEventListener('change', async function() {
        await cargarMovimientos();
    });

    importeHasta.addEventListener('change', async function() {
        await cargarMovimientos();
    });

    // Añadir manejo del botón limpiar filtros
    const btnLimpiar = document.getElementById('limpiarFiltros');
    btnLimpiar.addEventListener('click', async function() {
        // Limpiar fechas
        document.getElementById('fechaDesde').value = '';
        document.getElementById('fechaHasta').value = '';
        
        // Limpiar concepto
        document.getElementById('concepto').value = '';
        
        // Resetear sliders
        const importeDesde = document.getElementById('importeDesde');
        const importeHasta = document.getElementById('importeHasta');
        importeDesde.value = -10000;
        importeHasta.value = 10000;
        actualizarValorSlider(importeDesde.value, importeDesdeValue);
        actualizarValorSlider(importeHasta.value, importeHastaValue);
        
        // Resetear tipo
        document.getElementById('tipo').value = '';
        
        // Recargar datos
        await cargarMovimientos();
    });
});

async function cargarMovimientos() {
    try {
        const formData = new FormData(document.getElementById('filtroForm'));
        const filtros = {};
        
        // Convertir FormData a objeto, eliminando campos vacíos
        for (let [key, value] of formData.entries()) {
            if (value) { // Solo incluir campos con valor
                filtros[key] = value;
            }
        }

        const response = await fetch('/tablas/filtrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filtros)
        });

        const data = await response.json();
        
        if (data.success) {
            actualizarTabla(data.data);
        } else {
            alert('Error al cargar los movimientos: ' + data.mensaje);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los movimientos');
    }
}

function actualizarTabla(movimientos) {
    const tbody = document.querySelector('#tablaMovimientos tbody');
    tbody.innerHTML = '';

    movimientos.forEach(movimiento => {
        const tr = document.createElement('tr');
        // Añadir clase para colorear filas según el tipo
        tr.className = parseFloat(movimiento.importe) < 0 ? 'table-danger' : 'table-success';
        
        tr.innerHTML = `
            <td>${formatearFecha(movimiento.fecha)}</td>
            <td>${movimiento.concepto}</td>
            <td>${formatearFecha(movimiento.fecha_valor)}</td>
            <td>${formatearImporte(movimiento.importe)}</td>
            <td>${formatearImporte(movimiento.saldo)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString();
}

function formatearImporte(importe) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
    }).format(importe);
}
