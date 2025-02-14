document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');
    const jsonResult = document.getElementById('jsonResult');
    const fileLabel = document.querySelector('.custom-file-label');

    // Actualizar el nombre del archivo seleccionado
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileLabel.textContent = this.files[0].name;
            uploadButton.disabled = false;
        } else {
            fileLabel.textContent = 'Elegir archivo';
            uploadButton.disabled = true;
        }
    });

    // Manejar el envío del formulario
    uploadButton.addEventListener('click', async function(e) {
        e.preventDefault();
        uploadButton.disabled = true;
        const originalText = uploadButton.innerHTML;
        uploadButton.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Procesando...
        `;
        
        try {
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            
            const response = await fetch('/smart_money/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            // Formatear el resultado para mostrarlo en el textarea
            const formattedResult = formatJsonResult(result);
            jsonResult.value = formattedResult;

            // Mostrar mensaje de éxito o error
            if (result.success) {
                showAlert('success', `Archivo procesado correctamente. 
                    Registros insertados: ${result.resultados.insertados}, 
                    Errores: ${result.resultados.errores}`);
            } else {
                showAlert('error', result.message);
            }

        } catch (error) {
            console.error('Error:', error);
            showAlert('error', 'Error al procesar el archivo');
            jsonResult.value = JSON.stringify({ error: error.message }, null, 2);
        } finally {
            uploadButton.disabled = false;
            uploadButton.innerHTML = originalText;
            fileInput.value = '';
            fileLabel.textContent = 'Elegir archivo';
        }
    });

    // Función para formatear el resultado JSON
    function formatJsonResult(result) {
        let output = '';
        output += `Resultado del procesamiento:\n`;
        output += `========================\n\n`;
        output += `Estado: ${result.success ? 'Éxito' : 'Error'}\n`;
        output += `Mensaje: ${result.message}\n\n`;
        
        if (result.resultados) {
            output += `Resumen:\n`;
            output += `--------\n`;
            output += `Total de registros procesados: ${result.resultados.total}\n`;
            output += `Registros insertados con éxito: ${result.resultados.insertados}\n`;
            output += `Registros duplicados: ${result.resultados.duplicados}\n`;
            output += `Registros con errores: ${result.resultados.errores}\n\n`;

            // Mostrar detalles de duplicados si hay alguno
            if (result.resultados.duplicados > 0 && result.resultados.duplicadosDetalle) {
                output += `Detalle de registros duplicados:\n`;
                output += `-----------------------------\n`;
                result.resultados.duplicadosDetalle.forEach(dup => {
                    output += `Fila ${dup.fila}: ${dup.datos.fecha} - ${dup.datos.concepto}\n`;
                });
                output += '\n';
            }

            // Mostrar detalles de errores si hay alguno
            if (result.resultados.errores > 0 && result.resultados.erroresDetalle) {
                output += `Detalle de errores:\n`;
                output += `------------------\n`;
                result.resultados.erroresDetalle.forEach(err => {
                    output += `Fila ${err.fila}: ${err.motivo}\n`;
                    output += `Datos: ${JSON.stringify(err.datos)}\n`;
                    output += `---\n`;
                });
            }
        }

        return output;
    }

    // Función para mostrar alertas
    function showAlert(type, message) {
        const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert ${alertClass} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        `;
        
        form.insertAdjacentElement('beforebegin', alertDiv);
        
        // Eliminar la alerta después de 5 segundos
        setTimeout(() => alertDiv.remove(), 5000);
    }
});