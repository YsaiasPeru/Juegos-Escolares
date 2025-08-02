// Main JavaScript for Juegos Escolares

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerList);
    });

    // Auto-hide alerts after 5 seconds
    setTimeout(function() {
        var alerts = document.querySelectorAll('.alert');
        alerts.forEach(function(alert) {
            var bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        });
    }, 5000);

    // Add loading states to forms
    var forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
        form.addEventListener('submit', function() {
            var submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<span class="loading"></span> Procesando...';
                submitBtn.disabled = true;
            }
        });
    });

    // Add fade-in animation to cards
    var cards = document.querySelectorAll('.card');
    cards.forEach(function(card, index) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(function() {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Smooth scrolling for anchor links
    var anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add confirmation for delete actions
    var deleteButtons = document.querySelectorAll('.btn-outline-danger');
    deleteButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            if (!confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
                e.preventDefault();
            }
        });
    });

    // Auto-refresh fixture data every 30 seconds
    if (window.location.pathname === '/fixture') {
        setInterval(function() {
            refreshFixtureData();
        }, 30000);
    }

    // Add search functionality to tables
    var searchInputs = document.querySelectorAll('.table-search');
    searchInputs.forEach(function(input) {
        input.addEventListener('keyup', function() {
            var searchTerm = this.value.toLowerCase();
            var table = this.closest('.card').querySelector('table');
            var rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(function(row) {
                var text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });

    // Add sort functionality to tables
    var sortableHeaders = document.querySelectorAll('.sortable');
    sortableHeaders.forEach(function(header) {
        header.addEventListener('click', function() {
            var table = this.closest('table');
            var tbody = table.querySelector('tbody');
            var rows = Array.from(tbody.querySelectorAll('tr'));
            var columnIndex = Array.from(this.parentElement.children).indexOf(this);
            var isAscending = this.classList.contains('asc');
            
            rows.sort(function(a, b) {
                var aValue = a.children[columnIndex].textContent.trim();
                var bValue = b.children[columnIndex].textContent.trim();
                
                if (isAscending) {
                    return aValue.localeCompare(bValue);
                } else {
                    return bValue.localeCompare(aValue);
                }
            });
            
            rows.forEach(function(row) {
                tbody.appendChild(row);
            });
            
            // Update sort indicators
            sortableHeaders.forEach(function(h) {
                h.classList.remove('asc', 'desc');
            });
            this.classList.add(isAscending ? 'desc' : 'asc');
        });
    });

    // Add print functionality
    var printButtons = document.querySelectorAll('.btn-print');
    printButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            window.print();
        });
    });

    // Add export functionality
    var exportButtons = document.querySelectorAll('.btn-export');
    exportButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var table = this.closest('.card').querySelector('table');
            exportTableToCSV(table, 'datos_exportados.csv');
        });
    });

    // Add real-time validation for forms
    var formInputs = document.querySelectorAll('input[required], select[required]');
    formInputs.forEach(function(input) {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });

    // Add character counter for text areas
    var textAreas = document.querySelectorAll('textarea[maxlength]');
    textAreas.forEach(function(textarea) {
        var maxLength = textarea.getAttribute('maxlength');
        var counter = document.createElement('small');
        counter.className = 'text-muted character-counter';
        counter.textContent = '0/' + maxLength;
        textarea.parentNode.appendChild(counter);
        
        textarea.addEventListener('input', function() {
            var currentLength = this.value.length;
            counter.textContent = currentLength + '/' + maxLength;
            
            if (currentLength > maxLength * 0.9) {
                counter.classList.add('text-warning');
            } else {
                counter.classList.remove('text-warning');
            }
        });
    });
});

// Function to refresh fixture data
function refreshFixtureData() {
    fetch('/api/partidos')
        .then(response => response.json())
        .then(data => {
            // Update the fixture table with new data
            updateFixtureTable(data);
        })
        .catch(error => {
            console.error('Error refreshing fixture data:', error);
        });
}

// Function to update fixture table
function updateFixtureTable(data) {
    var tbody = document.querySelector('#partidosTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    data.forEach(function(partido) {
        var row = createPartidoRow(partido);
        tbody.appendChild(row);
    });
}

// Function to create a partido row
function createPartidoRow(partido) {
    var row = document.createElement('tr');
    row.className = 'partido-row';
    row.setAttribute('data-fase', partido.fase);
    row.setAttribute('data-estado', partido.estado);
    row.setAttribute('data-equipo-local', partido.equipo_local);
    row.setAttribute('data-equipo-visitante', partido.equipo_visitante);
    
    row.innerHTML = `
        <td>
            <div class="d-flex flex-column">
                <strong>${formatDate(partido.fecha)}</strong>
                <small class="text-muted">${formatTime(partido.fecha)}</small>
            </div>
        </td>
        <td>
            <span class="badge bg-primary">${partido.fase}</span>
        </td>
        <td>
            <div class="d-flex align-items-center">
                <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 35px; height: 35px;">
                    <i class="fas fa-shield-alt text-primary"></i>
                </div>
                <strong>${partido.equipo_local}</strong>
            </div>
        </td>
        <td>
            ${partido.estado === 'finalizado' ? 
                `<div class="d-flex align-items-center justify-content-center">
                    <span class="badge bg-success fs-6">${partido.goles_local}</span>
                    <span class="mx-2 text-muted">-</span>
                    <span class="badge bg-success fs-6">${partido.goles_visitante}</span>
                </div>` : 
                '<span class="text-muted">vs</span>'
            }
        </td>
        <td>
            <div class="d-flex align-items-center">
                <div class="bg-secondary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 35px; height: 35px;">
                    <i class="fas fa-shield-alt text-secondary"></i>
                </div>
                <strong>${partido.equipo_visitante}</strong>
            </div>
        </td>
        <td>
            ${getStatusBadge(partido.estado)}
        </td>
        <td>
            <button class="btn btn-sm btn-outline-primary" onclick="verDetallePartido(${partido.id})">
                <i class="fas fa-eye"></i>
            </button>
        </td>
    `;
    
    return row;
}

// Function to format date
function formatDate(dateString) {
    var date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
}

// Function to format time
function formatTime(dateString) {
    var date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'});
}

// Function to get status badge
function getStatusBadge(estado) {
    switch(estado) {
        case 'programado':
            return '<span class="badge bg-warning"><i class="fas fa-clock me-1"></i>Programado</span>';
        case 'en_curso':
            return '<span class="badge bg-info"><i class="fas fa-play me-1"></i>En Curso</span>';
        case 'finalizado':
            return '<span class="badge bg-success"><i class="fas fa-check me-1"></i>Finalizado</span>';
        default:
            return '<span class="badge bg-secondary">Desconocido</span>';
    }
}

// Function to export table to CSV
function exportTableToCSV(table, filename) {
    var csv = [];
    var rows = table.querySelectorAll('tr');
    
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll('td, th');
        
        for (var j = 0; j < cols.length; j++) {
            var text = cols[j].innerText.replace(/"/g, '""');
            row.push('"' + text + '"');
        }
        
        csv.push(row.join(','));
    }
    
    var csvContent = 'data:text/csv;charset=utf-8,' + csv.join('\n');
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Function to validate form field
function validateField(field) {
    var value = field.value.trim();
    var isValid = true;
    var errorMessage = '';
    
    // Remove existing validation classes
    field.classList.remove('is-valid', 'is-invalid');
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo es obligatorio';
    }
    
    // Check email format
    if (field.type === 'email' && value) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Formato de email inválido';
        }
    }
    
    // Check phone format
    if (field.type === 'tel' && value) {
        var phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Formato de teléfono inválido';
        }
    }
    
    // Apply validation result
    if (isValid) {
        field.classList.add('is-valid');
    } else {
        field.classList.add('is-invalid');
        // Show error message
        var errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            field.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = errorMessage;
    }
}

// Function to show notification
function showNotification(message, type = 'info') {
    var alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    var container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(function() {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Function to apply filters (already defined in fixture.html)
function aplicarFiltros() {
    const faseFilter = document.getElementById('faseFilter').value;
    const estadoFilter = document.getElementById('estadoFilter').value;
    const equipoFilter = document.getElementById('equipoFilter').value.toLowerCase();
    
    const rows = document.querySelectorAll('.partido-row');
    
    rows.forEach(row => {
        const fase = row.getAttribute('data-fase');
        const estado = row.getAttribute('data-estado');
        const equipoLocal = row.getAttribute('data-equipo-local').toLowerCase();
        const equipoVisitante = row.getAttribute('data-equipo-visitante').toLowerCase();
        
        let show = true;
        
        if (faseFilter && fase !== faseFilter) show = false;
        if (estadoFilter && estado !== estadoFilter) show = false;
        if (equipoFilter && !equipoLocal.includes(equipoFilter) && !equipoVisitante.includes(equipoFilter)) show = false;
        
        row.style.display = show ? '' : 'none';
    });
}

// Function to view match details
function verDetallePartido(partidoId) {
    // This could open a modal with match details
    showNotification(`Detalles del partido ${partidoId}`, 'info');
} 