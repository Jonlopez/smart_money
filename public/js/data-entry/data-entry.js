let selectedFiles = new DataTransfer();

function updateFileList() {
    const fileListContainer = document.getElementById('fileList');
    const label = document.querySelector('.custom-file-label');
    const uploadButton = document.getElementById('uploadButton');
    const files = Array.from(selectedFiles.files);
    
    // Activar/desactivar botón según haya archivos
    uploadButton.disabled = files.length === 0;
    uploadButton.classList.toggle('btn-primary', files.length > 0);
    uploadButton.classList.toggle('btn-secondary', files.length === 0);
    
    if (files.length > 0) {
        label.textContent = files.length + ' ' + i18n.t("data-entry.files_selected");
        
        let fileListHTML = '<ul class="list-group">';
        files.forEach((file, index) => {
            fileListHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                        <i class="fas fa-file mr-2 text-primary"></i>
                        ${file.name}
                    </span>
                    <div>
                        <span class="badge badge-primary badge-pill mr-2">${(file.size / 1024).toFixed(2)} KB</span>
                        <button type="button" class="btn btn-danger btn-sm" onclick="removeFile(${index})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </li>`;
        });
        fileListHTML += '</ul>';
        fileListContainer.innerHTML = fileListHTML;
    } else {
        label.textContent = i18n.t("data-entry.choose_files");
        fileListContainer.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle mr-2"></i>
                ${i18n.t("data-entry.no_files")}
            </div>`;
    }

    // Actualizar el input file con los archivos seleccionados
    document.getElementById('fileInput').files = selectedFiles.files;
}

function removeFile(index) {
    const dt = new DataTransfer();
    const files = Array.from(selectedFiles.files);
    
    files.forEach((file, i) => {
        if (i !== index) {
            dt.items.add(file);
        }
    });
    
    selectedFiles = dt;
    updateFileList();
}

document.querySelector('.custom-file-input').addEventListener('change', function(e) {
    const newFiles = Array.from(this.files);
    
    // Agregar nuevos archivos a la colección existente
    newFiles.forEach(file => {
        // Verificar si el archivo ya existe
        const exists = Array.from(selectedFiles.files).some(f => 
            f.name === file.name && f.size === file.size
        );
        
        if (!exists) {
            selectedFiles.items.add(file);
        }
    });

    updateFileList();
});

// Reemplazar el listener del submit por un listener del botón
document.getElementById('uploadButton').addEventListener('click', async function() {
    const formData = new FormData();
    
    // Agregar los archivos al FormData
    Array.from(selectedFiles.files).forEach(file => {
        formData.append('files', file);
    });
    
    // Agregar la descripción
    formData.append('description', document.getElementById('description').value);
    
    // Deshabilitar el botón durante la subida
    const uploadButton = this;
    const originalText = uploadButton.innerHTML;
    uploadButton.disabled = true;
    uploadButton.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        ${i18n.t('data-entry.uploading')}...
    `;

    try {
        const response = await fetch('/smart_money/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Limpiar el formulario después de una subida exitosa
        selectedFiles = new DataTransfer();
        document.getElementById('uploadForm').reset();
        document.getElementById('description').value = '';
        updateFileList();
        
        // Mostrar mensaje de éxito
        const fileListContainer = document.getElementById('fileList');
        fileListContainer.innerHTML = `
            <div class="alert alert-success">
                <i class="fas fa-check-circle mr-2"></i>
                ${i18n.t('data-entry.upload_success')}
            </div>`;

        // Formatear y mostrar el resultado JSON
        const jsonResult = document.getElementById('jsonResult');
        const formattedResult = formatJsonResult(result);
        jsonResult.value = formattedResult;

    } catch (error) {
        console.error('Error:', error);
        const fileListContainer = document.getElementById('fileList');
        // Mostrar mensaje de error
        fileListContainer.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle mr-2"></i>
                ${i18n.t('data-entry.upload_error')}
            </div>`;
    } finally {
        // Restaurar el botón
        uploadButton.disabled = false;
        uploadButton.innerHTML = originalText;
    }
});

// Función para formatear el resultado JSON
function formatJsonResult(json) {
    let output = '';
    
    // Información general
    output += `${i18n.t('data-entry.success')}: ${json.success}\n`;
    output += `${i18n.t('data-entry.message')}: ${json.message}\n`;
    output += `${i18n.t('data-entry.description')}: ${json.description}\n\n`;
    
    // Información de archivos
    json.files.forEach((file, fileIndex) => {
        output += `${i18n.t('data-entry.file')} ${fileIndex + 1}: ${file.fileName}\n`;
        
        if (file.error) {
            output += `  ${i18n.t('data-entry.error')}: ${file.error}\n`;
        } else {
            file.sheets.forEach((sheet, sheetIndex) => {
                output += `  ${i18n.t('data-entry.sheet')} ${sheetIndex + 1}: ${sheet.name}\n`;
                output += `    ${i18n.t('data-entry.rows')}: ${sheet.rowCount}\n`;
                output += `    ${i18n.t('data-entry.columns')}: ${sheet.columnCount}\n`;
                output += `    ${i18n.t('data-entry.headers')}: ${sheet.headers.join(', ')}\n\n`;
                
                // Añadir los pares clave-valor agrupados por fila
                output += `    ${i18n.t('data-entry.key_value_pairs')}:\n`;
                let currentRow = 1;
                let rowData = {};
                
                sheet.keyValuePairs.forEach(pair => {
                    const rowMatch = pair.key.match(/Row (\d+)/);
                    const rowNum = rowMatch ? parseInt(rowMatch[1]) : 0;
                    const cleanKey = pair.key.replace(/ \(Row \d+\)/, '');
                    
                    if (rowNum !== currentRow && Object.keys(rowData).length > 0) {
                        // Imprimir fila anterior
                        output += `      --- ${i18n.t('data-entry.row')} ${currentRow} ---\n`;
                        Object.entries(rowData).forEach(([k, v]) => {
                            output += `      ${k}: ${v}\n`;
                        });
                        output += '\n';
                        rowData = {};
                        currentRow = rowNum;
                    }
                    
                    rowData[cleanKey] = pair.value;
                });
                
                // Imprimir última fila
                if (Object.keys(rowData).length > 0) {
                    output += `      --- ${i18n.t('data-entry.row')} ${currentRow} ---\n`;
                    Object.entries(rowData).forEach(([k, v]) => {
                        output += `      ${k}: ${v}\n`;
                    });
                    output += '\n';
                }
            });
        }
        output += '\n';
    });
    
    return output;
}