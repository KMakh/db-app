// Global variables
let clients = [];
let creditPrograms = [];
let applications = [];
let currentEditId = null;

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

// Application DOM Elements
const applicationTable = document.getElementById('application-table');
const applicationTableBody = applicationTable.querySelector('tbody');
const applicationModal = document.getElementById('application-modal');
const applicationForm = document.getElementById('application-form');
const applicationFormTitle = document.getElementById('application-form-title');
const applicationIdInput = document.getElementById('application-id');
const clientSelect = document.getElementById('client-select');
const programSelect = document.getElementById('program-select');
const applicationDateInput = document.getElementById('application-date');
const requestedAmountInput = document.getElementById('requested-amount');
const requestedTermInput = document.getElementById('requested-term');
const applicationStatusSelect = document.getElementById('application-status');
const inspectorCommentsInput = document.getElementById('inspector-comments');
const applicationSearchInput = document.getElementById('application-search');
const applicationSearchBtn = document.getElementById('application-search-btn');
const applicationResetBtn = document.getElementById('application-reset-btn');
const applicationSortSelect = document.getElementById('application-sort');
const addApplicationBtn = document.getElementById('add-application-btn');
const applicationDetailsModal = document.getElementById('application-details-modal');
const detailTabs = document.querySelectorAll('.detail-tab');
const detailContents = document.querySelectorAll('.detail-content');

// Client DOM Elements
const clientTable = document.getElementById('client-table');
const clientTableBody = clientTable.querySelector('tbody');
const clientModal = document.getElementById('client-modal');
const clientForm = document.getElementById('client-form');
const clientFormTitle = document.getElementById('client-form-title');
const clientIdInput = document.getElementById('client-id');
const fullNameInput = document.getElementById('full-name');
const dateOfBirthInput = document.getElementById('date-of-birth');
const passportSeriesInput = document.getElementById('passport-series');
const passportNumberInput = document.getElementById('passport-number');
const passportIssueDateInput = document.getElementById('passport-issue-date');
const passportIssuingAuthorityInput = document.getElementById('passport-issuing-authority');
const addressInput = document.getElementById('address');
const phoneNumberInput = document.getElementById('phone-number');
const emailInput = document.getElementById('email');
const clientTypeSelect = document.getElementById('client-type');
const innInput = document.getElementById('inn');
const clientSearchInput = document.getElementById('client-search');
const clientSearchBtn = document.getElementById('client-search-btn');
const clientResetBtn = document.getElementById('client-reset-btn');
const addClientBtn = document.getElementById('add-client-btn');

// Credit Program DOM Elements
const programTable = document.getElementById('program-table');
const programTableBody = programTable.querySelector('tbody');
const programModal = document.getElementById('program-modal');
const programForm = document.getElementById('program-form');
const programFormTitle = document.getElementById('program-form-title');
const programIdInput = document.getElementById('program-id');
const programNameInput = document.getElementById('program-name');
const minAmountInput = document.getElementById('min-amount');
const maxAmountInput = document.getElementById('max-amount');
const minTermInput = document.getElementById('min-term');
const maxTermInput = document.getElementById('max-term');
const interestRateInput = document.getElementById('interest-rate');
const programDescriptionInput = document.getElementById('program-description');
const isActiveInput = document.getElementById('is-active');
const addProgramBtn = document.getElementById('add-program-btn');
const closeButtons = document.querySelectorAll('.close');
const cancelButtons = document.querySelectorAll('.cancel-btn');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize tabs
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Initialize detail tabs
    detailTabs.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-detail-tab');
            switchDetailTab(tabId);
        });
    });

    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', closeAllModals);
    });

    cancelButtons.forEach(button => {
        button.addEventListener('click', closeAllModals);
    });

    // Modal click outside
    window.addEventListener('click', (e) => {
        if (e.target === applicationModal) closeAllModals();
        if (e.target === clientModal) closeAllModals();
        if (e.target === programModal) closeAllModals();
        if (e.target === applicationDetailsModal) closeAllModals();
    });

    // Form submissions
    applicationForm.addEventListener('submit', handleApplicationFormSubmit);
    clientForm.addEventListener('submit', handleClientFormSubmit);
    programForm.addEventListener('submit', handleProgramFormSubmit);

    // Add new buttons
    addApplicationBtn.addEventListener('click', () => {
        currentEditId = null;
        applicationFormTitle.textContent = 'Новая заявка';
        applicationForm.reset();
        applicationIdInput.value = '';
        applicationDateInput.value = formatDateForInput(new Date());
        loadClientsIntoSelect();
        loadProgramsIntoSelect();
        applicationModal.style.display = 'block';
    });

    addClientBtn.addEventListener('click', () => {
        currentEditId = null;
        clientFormTitle.textContent = 'Новый клиент';
        clientForm.reset();
        clientIdInput.value = '';
        clientModal.style.display = 'block';
    });

    addProgramBtn.addEventListener('click', () => {
        currentEditId = null;
        programFormTitle.textContent = 'Новая кредитная программа';
        programForm.reset();
        programIdInput.value = '';
        isActiveInput.checked = true;
        programModal.style.display = 'block';
    });

    // Search functionality
    applicationSearchBtn.addEventListener('click', () => {
        const searchTerm = applicationSearchInput.value.trim();
        if (searchTerm === '') {
            loadApplications();
        } else {
            searchApplications(searchTerm);
        }
    });

    clientSearchBtn.addEventListener('click', () => {
        const searchTerm = clientSearchInput.value.trim();
        if (searchTerm === '') {
            loadClients();
        } else {
            searchClients(searchTerm);
        }
    });

    // Reset search
    applicationResetBtn.addEventListener('click', () => {
        applicationSearchInput.value = '';
        loadApplications();
    });

    clientResetBtn.addEventListener('click', () => {
        clientSearchInput.value = '';
        loadClients();
    });

    // Sort applications
    applicationSortSelect.addEventListener('change', () => {
        sortApplications();
    });

    // Load initial data
    loadClients();
    loadCreditPrograms();
    loadApplications();
});

// Functions
function switchTab(tabId) {
    tabButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-tab') === tabId) {
            button.classList.add('active');
        }
    });

    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
            content.classList.add('active');
        }
    });
}

function switchDetailTab(tabId) {
    detailTabs.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-detail-tab') === tabId) {
            button.classList.add('active');
        }
    });

    detailContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
            content.classList.add('active');
        }
    });
}

function closeAllModals() {
    applicationModal.style.display = 'none';
    clientModal.style.display = 'none';
    programModal.style.display = 'none';
    applicationDetailsModal.style.display = 'none';
}

// API Functions
async function loadApplications() {
    try {
        const response = await fetch('/api/applications');
        if (!response.ok) throw new Error('Failed to fetch applications');
        applications = await response.json();
        renderApplications();
    } catch (error) {
        console.error('Error loading applications:', error);
        alert('Ошибка загрузки заявок. Пожалуйста, попробуйте снова.');
    }
}

async function loadClients() {
    try {
        const response = await fetch('/api/clients');
        if (!response.ok) throw new Error('Failed to fetch clients');
        clients = await response.json();
        renderClients();
    } catch (error) {
        console.error('Error loading clients:', error);
        alert('Ошибка загрузки клиентов. Пожалуйста, попробуйте снова.');
    }
}

async function loadCreditPrograms() {
    try {
        const response = await fetch('/api/credit-programs');
        if (!response.ok) throw new Error('Failed to fetch credit programs');
        creditPrograms = await response.json();
        renderCreditPrograms();
    } catch (error) {
        console.error('Error loading credit programs:', error);
        alert('Ошибка загрузки кредитных программ. Пожалуйста, попробуйте снова.');
    }
}

async function searchApplications(term) {
    try {
        const response = await fetch(`/api/applications/search?term=${encodeURIComponent(term)}`);
        if (!response.ok) throw new Error('Failed to search applications');
        applications = await response.json();
        renderApplications();
    } catch (error) {
        console.error('Error searching applications:', error);
        alert('Ошибка поиска заявок. Пожалуйста, попробуйте снова.');
    }
}

async function searchClients(term) {
    try {
        const response = await fetch(`/api/clients/search?term=${encodeURIComponent(term)}`);
        if (!response.ok) throw new Error('Failed to search clients');
        clients = await response.json();
        renderClients();
    } catch (error) {
        console.error('Error searching clients:', error);
        alert('Ошибка поиска клиентов. Пожалуйста, попробуйте снова.');
    }
}

async function loadApplicationDetails(id) {
    try {
        const response = await fetch(`/api/application-details/${id}`);
        if (!response.ok) throw new Error('Failed to fetch application details');
        const details = await response.json();
        renderApplicationDetails(details);
        applicationDetailsModal.style.display = 'block';
    } catch (error) {
        console.error('Error loading application details:', error);
        alert('Ошибка загрузки деталей заявки. Пожалуйста, попробуйте снова.');
    }
}

async function addApplication(applicationData) {
    try {
        const response = await fetch('/api/applications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(applicationData)
        });

        if (!response.ok) throw new Error('Failed to add application');
        await loadApplications();
        closeAllModals();
    } catch (error) {
        console.error('Error adding application:', error);
        alert('Ошибка добавления заявки. Пожалуйста, попробуйте снова.');
    }
}

async function updateApplication(id, applicationData) {
    try {
        const response = await fetch(`/api/applications/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(applicationData)
        });

        if (!response.ok) throw new Error('Failed to update application');
        await loadApplications();
        closeAllModals();
    } catch (error) {
        console.error('Error updating application:', error);
        alert('Ошибка обновления заявки. Пожалуйста, попробуйте снова.');
    }
}

async function deleteApplication(id) {
    if (!confirm('Вы уверены, что хотите удалить эту заявку?')) return;

    try {
        const response = await fetch(`/api/applications/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete application');
        await loadApplications();
    } catch (error) {
        console.error('Error deleting application:', error);
        alert('Ошибка удаления заявки. Пожалуйста, попробуйте снова.');
    }
}

async function addClient(clientData) {
    try {
        const response = await fetch('/api/clients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientData)
        });

        if (!response.ok) throw new Error('Failed to add client');
        await loadClients();
        closeAllModals();
    } catch (error) {
        console.error('Error adding client:', error);
        alert('Ошибка добавления клиента. Пожалуйста, попробуйте снова.');
    }
}

async function updateClient(id, clientData) {
    try {
        const response = await fetch(`/api/clients/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientData)
        });

        if (!response.ok) throw new Error('Failed to update client');
        await loadClients();
        closeAllModals();
    } catch (error) {
        console.error('Error updating client:', error);
        alert('Ошибка обновления клиента. Пожалуйста, попробуйте снова.');
    }
}

async function deleteClient(id) {
    if (!confirm('Вы уверены, что хотите удалить этого клиента?')) return;

    try {
        const response = await fetch(`/api/clients/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete client');
        await loadClients();
    } catch (error) {
        console.error('Error deleting client:', error);
        alert('Ошибка удаления клиента. Пожалуйста, попробуйте снова.');
    }
}

async function addCreditProgram(programData) {
    try {
        const response = await fetch('/api/credit-programs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(programData)
        });

        if (!response.ok) throw new Error('Failed to add credit program');
        await loadCreditPrograms();
        closeAllModals();
    } catch (error) {
        console.error('Error adding credit program:', error);
        alert('Ошибка добавления кредитной программы. Пожалуйста, попробуйте снова.');
    }
}

async function updateCreditProgram(id, programData) {
    try {
        const response = await fetch(`/api/credit-programs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(programData)
        });

        if (!response.ok) throw new Error('Failed to update credit program');
        await loadCreditPrograms();
        closeAllModals();
    } catch (error) {
        console.error('Error updating credit program:', error);
        alert('Ошибка обновления кредитной программы. Пожалуйста, попробуйте снова.');
    }
}

async function deleteCreditProgram(id) {
    if (!confirm('Вы уверены, что хотите удалить эту кредитную программу?')) return;

    try {
        const response = await fetch(`/api/credit-programs/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete credit program');
        await loadCreditPrograms();
    } catch (error) {
        console.error('Error deleting credit program:', error);
        alert('Ошибка удаления кредитной программы. Пожалуйста, попробуйте снова.');
    }
}

// Rendering Functions
function renderApplications() {
    applicationTableBody.innerHTML = '';

    applications.forEach(application => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
      <td>${application.application_id}</td>
      <td>${application.client_name}</td>
      <td>${application.program_name}</td>
      <td>${formatDate(application.application_date)}</td>
      <td>${formatCurrency(application.requested_amount)}</td>
      <td>${application.requested_term_months}</td>
      <td><span class="status-badge ${getStatusClass(application.status)}">${application.status}</span></td>
      <td class="action-buttons">
        <button class="view-btn" data-id="${application.application_id}">Просмотр</button>
        <button class="edit-btn" data-id="${application.application_id}">Изменить</button>
        <button class="delete-btn" data-id="${application.application_id}">Удалить</button>
      </td>
    `;

        applicationTableBody.appendChild(tr);
    });

    // Add event listeners to action buttons
    document.querySelectorAll('#application-table .view-btn').forEach(button => {
        button.addEventListener('click', () => {
            loadApplicationDetails(button.getAttribute('data-id'));
        });
    });

    document.querySelectorAll('#application-table .edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            editApplication(button.getAttribute('data-id'));
        });
    });

    document.querySelectorAll('#application-table .delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            deleteApplication(button.getAttribute('data-id'));
        });
    });
}

function renderClients() {
    clientTableBody.innerHTML = '';

    clients.forEach(client => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
      <td>${client.client_id}</td>
      <td>${client.full_name}</td>
      <td>${client.passport_series} ${client.passport_number}</td>
      <td>${client.phone_number}</td>
      <td>${client.email || '-'}</td>
      <td>${client.client_type}</td>
      <td class="action-buttons">
        <button class="edit-btn" data-id="${client.client_id}">Изменить</button>
        <button class="delete-btn" data-id="${client.client_id}">Удалить</button>
      </td>
    `;

        clientTableBody.appendChild(tr);
    });

    // Add event listeners to action buttons
    document.querySelectorAll('#client-table .edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            editClient(button.getAttribute('data-id'));
        });
    });

    document.querySelectorAll('#client-table .delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            deleteClient(button.getAttribute('data-id'));
        });
    });

    // Load clients into select for application form
    loadClientsIntoSelect();
}

function renderCreditPrograms() {
    programTableBody.innerHTML = '';

    creditPrograms.forEach(program => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
      <td>${program.program_id}</td>
      <td>${program.program_name}</td>
      <td>${formatCurrency(program.min_amount)} - ${formatCurrency(program.max_amount)}</td>
      <td>${program.min_term_months} - ${program.max_term_months} мес.</td>
      <td>${program.interest_rate}%</td>
      <td>${program.is_active ? 'Да' : 'Нет'}</td>
      <td class="action-buttons">
        <button class="edit-btn" data-id="${program.program_id}">Изменить</button>
        <button class="delete-btn" data-id="${program.program_id}">Удалить</button>
      </td>
    `;

        programTableBody.appendChild(tr);
    });

    // Add event listeners to action buttons
    document.querySelectorAll('#program-table .edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            editCreditProgram(button.getAttribute('data-id'));
        });
    });

    document.querySelectorAll('#program-table .delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            deleteCreditProgram(button.getAttribute('data-id'));
        });
    });

    // Load programs into select for application form
    loadProgramsIntoSelect();
}

function renderApplicationDetails(details) {
    const { application, scoring, decision, creditCase, documents, agreement } = details;

    // Set application details
    document.getElementById('detail-application-id').textContent = `#${application.application_id}`;
    document.getElementById('detail-app-id').textContent = application.application_id;
    document.getElementById('detail-app-date').textContent = formatDate(application.application_date);
    document.getElementById('detail-app-status').textContent = application.status;
    document.getElementById('detail-app-amount').textContent = formatCurrency(application.requested_amount);
    document.getElementById('detail-app-term').textContent = application.requested_term_months;
    document.getElementById('detail-app-comments').textContent = application.inspector_comments || 'Нет комментариев';

    // Set client details
    document.getElementById('detail-client-name').textContent = application.client_name;
    document.getElementById('detail-client-passport').textContent = `${application.passport_series} ${application.passport_number}`;
    document.getElementById('detail-client-phone').textContent = application.phone_number;
    document.getElementById('detail-client-email').textContent = application.client_email || '-';

    // Set program details
    document.getElementById('detail-program-name').textContent = application.program_name;
    document.getElementById('detail-program-rate').textContent = `${application.program_interest_rate}%`;

    // Set scoring details if exists
    if (scoring) {
        document.getElementById('no-scoring-message').style.display = 'none';
        document.getElementById('scoring-details').style.display = 'block';
        document.getElementById('detail-scoring-date').textContent = formatDateTime(scoring.scoring_date);
        document.getElementById('detail-score-value').textContent = scoring.score_value;
        document.getElementById('detail-risk-category').textContent = scoring.risk_category;
        document.getElementById('detail-ai-recommendation').textContent = scoring.ai_recommendation;
    } else {
        document.getElementById('no-scoring-message').style.display = 'block';
        document.getElementById('scoring-details').style.display = 'none';
    }

    // Set decision details if exists
    if (decision) {
        document.getElementById('no-decision-message').style.display = 'none';
        document.getElementById('decision-details').style.display = 'block';
        document.getElementById('detail-decision-date').textContent = formatDateTime(decision.decision_date);
        document.getElementById('detail-decision-type').textContent = decision.decision_type;

        if (decision.decision_type === 'Отказано') {
            document.getElementById('rejection-reason-container').style.display = 'block';
            document.querySelectorAll('.approval-field').forEach(el => el.style.display = 'none');
            document.getElementById('detail-rejection-reason').textContent = decision.rejection_reason || 'Не указана';
        } else {
            document.getElementById('rejection-reason-container').style.display = 'none';
            document.querySelectorAll('.approval-field').forEach(el => el.style.display = 'block');
            document.getElementById('detail-approved-amount').textContent = formatCurrency(decision.approved_amount);
            document.getElementById('detail-approved-term').textContent = `${decision.approved_term_months} мес.`;
            document.getElementById('detail-approved-rate').textContent = `${decision.approved_interest_rate}%`;
        }
    } else {
        document.getElementById('no-decision-message').style.display = 'block';
        document.getElementById('decision-details').style.display = 'none';
    }

    // Set credit case details if exists
    if (creditCase) {
        document.getElementById('no-case-message').style.display = 'none';
        document.getElementById('credit-case-details').style.display = 'block';
        document.getElementById('detail-case-id').textContent = creditCase.case_id;
        document.getElementById('detail-case-date').textContent = formatDateTime(creditCase.creation_date);
        document.getElementById('detail-case-status').textContent = creditCase.status;
        document.getElementById('detail-case-initiator').textContent = creditCase.initiator_employee_id || '-';
        document.getElementById('detail-case-responsible').textContent = creditCase.responsible_employee_id || '-';
    } else {
        document.getElementById('no-case-message').style.display = 'block';
        document.getElementById('credit-case-details').style.display = 'none';
    }

    // Set documents if exist
    if (documents && documents.length > 0) {
        document.getElementById('no-documents-message').style.display = 'none';
        document.getElementById('documents-details').style.display = 'block';

        const tbody = document.getElementById('documents-table-body');
        tbody.innerHTML = '';

        documents.forEach(doc => {
            const tr = document.createElement('tr');
            const fileSize = formatFileSize(doc.file_size_bytes);
            const uploadDate = formatDateTime(doc.upload_date);

            tr.innerHTML = `
        <td><i class="document-icon">📄</i>${doc.document_type}</td>
        <td>${doc.file_name}</td>
        <td>${uploadDate}</td>
        <td><span class="file-size">${fileSize}</span></td>
        <td>
          <button class="action-button" data-path="${doc.file_path}">Просмотр</button>
        </td>
      `;

            tbody.appendChild(tr);
        });
    } else {
        document.getElementById('no-documents-message').style.display = 'block';
        document.getElementById('documents-details').style.display = 'none';
    }

    // Set agreement details if exists
    if (agreement) {
        document.getElementById('no-agreement-message').style.display = 'none';
        document.getElementById('agreement-details').style.display = 'block';
        document.getElementById('detail-agreement-number').textContent = agreement.agreement_number;
        document.getElementById('detail-agreement-date').textContent = formatDate(agreement.signing_date);

        const statusClass = agreement.signing_status === 'Подписан ЭЦП'
            ? 'status-signed'
            : (agreement.signing_status === 'Ожидает' ? 'status-pending' : 'status-rejected');

        document.getElementById('detail-agreement-status').innerHTML =
            `<span class="status-badge ${statusClass}">${agreement.signing_status}</span>`;

        document.getElementById('detail-agreement-amount').textContent = formatCurrency(agreement.agreement_amount);
        document.getElementById('detail-agreement-term').textContent = `${agreement.agreement_term_months} мес.`;
        document.getElementById('detail-agreement-rate').textContent = `${agreement.agreement_interest_rate}%`;
        document.getElementById('detail-agreement-path').textContent = agreement.electronic_agreement_path || '-';
    } else {
        document.getElementById('no-agreement-message').style.display = 'block';
        document.getElementById('agreement-details').style.display = 'none';
    }

    // Show first tab by default
    switchDetailTab('main-info');
}

function loadClientsIntoSelect() {
    clientSelect.innerHTML = '';

    // Add empty option
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = '-- Выберите клиента --';
    clientSelect.appendChild(emptyOption);

    // Add client options
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.client_id;
        option.textContent = `${client.full_name} (${client.passport_series} ${client.passport_number})`;
        clientSelect.appendChild(option);
    });
}

function loadProgramsIntoSelect() {
    programSelect.innerHTML = '';

    // Add empty option
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = '-- Выберите кредитную программу --';
    programSelect.appendChild(emptyOption);

    // Add program options
    creditPrograms.filter(program => program.is_active).forEach(program => {
        const option = document.createElement('option');
        option.value = program.program_id;
        option.textContent = `${program.program_name} (${program.interest_rate}%)`;
        programSelect.appendChild(option);
    });
}

function editApplication(id) {
    const application = applications.find(app => app.application_id === parseInt(id));
    if (!application) return;

    currentEditId = application.application_id;
    applicationFormTitle.textContent = `Изменить заявку #${application.application_id}`;

    applicationIdInput.value = application.application_id;
    applicationDateInput.value = formatDateForInput(application.application_date);
    requestedAmountInput.value = application.requested_amount;
    requestedTermInput.value = application.requested_term_months;
    applicationStatusSelect.value = application.status;
    inspectorCommentsInput.value = application.inspector_comments || '';

    loadClientsIntoSelect();
    loadProgramsIntoSelect();

    clientSelect.value = application.client_id;
    programSelect.value = application.program_id;

    applicationModal.style.display = 'block';
}

function editClient(id) {
    const client = clients.find(c => c.client_id === parseInt(id));
    if (!client) return;

    currentEditId = client.client_id;
    clientFormTitle.textContent = `Изменить клиента #${client.client_id}`;

    clientIdInput.value = client.client_id;
    fullNameInput.value = client.full_name;
    dateOfBirthInput.value = formatDateForInput(client.date_of_birth);
    passportSeriesInput.value = client.passport_series;
    passportNumberInput.value = client.passport_number;
    passportIssueDateInput.value = formatDateForInput(client.passport_issue_date);
    passportIssuingAuthorityInput.value = client.passport_issuing_authority;
    addressInput.value = client.address;
    phoneNumberInput.value = client.phone_number;
    emailInput.value = client.email || '';
    clientTypeSelect.value = client.client_type;
    innInput.value = client.inn || '';

    clientModal.style.display = 'block';
}

function editCreditProgram(id) {
    const program = creditPrograms.find(p => p.program_id === parseInt(id));
    if (!program) return;

    currentEditId = program.program_id;
    programFormTitle.textContent = `Изменить кредитную программу #${program.program_id}`;

    programIdInput.value = program.program_id;
    programNameInput.value = program.program_name;
    minAmountInput.value = program.min_amount;
    maxAmountInput.value = program.max_amount;
    minTermInput.value = program.min_term_months;
    maxTermInput.value = program.max_term_months;
    interestRateInput.value = program.interest_rate;
    programDescriptionInput.value = program.description || '';
    isActiveInput.checked = program.is_active;

    programModal.style.display = 'block';
}

function handleApplicationFormSubmit(e) {
    e.preventDefault();

    const applicationData = {
        client_id: parseInt(clientSelect.value),
        program_id: parseInt(programSelect.value),
        application_date: applicationDateInput.value,
        status: applicationStatusSelect.value,
        requested_amount: parseFloat(requestedAmountInput.value),
        requested_term_months: parseInt(requestedTermInput.value),
        inspector_comments: inspectorCommentsInput.value
    };

    if (currentEditId) {
        updateApplication(currentEditId, applicationData);
    } else {
        addApplication(applicationData);
    }
}

function handleClientFormSubmit(e) {
    e.preventDefault();

    const clientData = {
        full_name: fullNameInput.value,
        date_of_birth: dateOfBirthInput.value,
        passport_series: passportSeriesInput.value,
        passport_number: passportNumberInput.value,
        passport_issue_date: passportIssueDateInput.value,
        passport_issuing_authority: passportIssuingAuthorityInput.value,
        address: addressInput.value,
        phone_number: phoneNumberInput.value,
        email: emailInput.value || null,
        client_type: clientTypeSelect.value,
        inn: innInput.value || null
    };

    if (currentEditId) {
        updateClient(currentEditId, clientData);
    } else {
        addClient(clientData);
    }
}

function handleProgramFormSubmit(e) {
    e.preventDefault();

    const programData = {
        program_name: programNameInput.value,
        min_amount: parseFloat(minAmountInput.value),
        max_amount: parseFloat(maxAmountInput.value),
        min_term_months: parseInt(minTermInput.value),
        max_term_months: parseInt(maxTermInput.value),
        interest_rate: parseFloat(interestRateInput.value),
        description: programDescriptionInput.value,
        is_active: isActiveInput.checked
    };

    if (currentEditId) {
        updateCreditProgram(currentEditId, programData);
    } else {
        addCreditProgram(programData);
    }
}

function sortApplications() {
    const sortBy = applicationSortSelect.value;

    applications.sort((a, b) => {
        switch (sortBy) {
            case 'application_date':
                return new Date(a.application_date) - new Date(b.application_date);
            case 'status':
                return a.status.localeCompare(b.status);
            case 'requested_amount':
                return parseFloat(a.requested_amount) - parseFloat(b.requested_amount);
            default:
                return a.application_id - b.application_id;
        }
    });

    renderApplications();
}

// Helper Functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU');
}

function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 2
    }).format(amount);
}

function getStatusClass(status) {
    switch (status) {
        case 'Новая':
            return 'status-new';
        case 'В проверке':
            return 'status-processing';
        case 'Одобрена':
            return 'status-approved';
        case 'Отказано':
            return 'status-rejected';
        case 'Закрыта':
            return 'status-closed';
        default:
            return '';
    }
}

// Format file size to human readable format
function formatFileSize(bytes) {
    if (bytes === 0 || !bytes) return '0 Б';

    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

function renderEmployees() {
    employeeTableBody.innerHTML = '';

    employees.forEach(employee => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
      <td>${employee.id}</td>
      <td>${employee.first_name}</td>
      <td>${employee.last_name}</td>
      <td>${employee.email}</td>
      <td>${formatDate(employee.hire_date)}</td>
      <td>$${parseFloat(employee.salary).toFixed(2)}</td>
      <td>${employee.department_name || 'N/A'}</td>
      <td class="action-buttons">
        <button class="edit-btn" data-id="${employee.id}">Edit</button>
        <button class="delete-btn" data-id="${employee.id}">Delete</button>
      </td>
    `;

        employeeTableBody.appendChild(tr);
    });

    // Add event listeners to action buttons
    document.querySelectorAll('#employee-table .edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            editEmployee(button.getAttribute('data-id'));
        });
    });

    document.querySelectorAll('#employee-table .delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            deleteEmployee(button.getAttribute('data-id'));
        });
    });
}

function renderDepartments() {
    departmentTableBody.innerHTML = '';

    departments.forEach(department => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
      <td>${department.id}</td>
      <td>${department.name}</td>
      <td>${department.location || 'N/A'}</td>
      <td class="action-buttons">
        <button class="edit-btn" data-id="${department.id}">Edit</button>
        <button class="delete-btn" data-id="${department.id}">Delete</button>
      </td>
    `;

        departmentTableBody.appendChild(tr);
    });

    // Add event listeners to action buttons
    document.querySelectorAll('#department-table .edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            editDepartment(button.getAttribute('data-id'));
        });
    });

    document.querySelectorAll('#department-table .delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            deleteDepartment(button.getAttribute('data-id'));
        });
    });

    // Load departments into select
    loadDepartmentsIntoSelect();
}

function loadDepartmentsIntoSelect() {
    departmentSelect.innerHTML = '';

    // Add empty option
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = '-- Select Department --';
    departmentSelect.appendChild(emptyOption);

    // Add department options
    departments.forEach(department => {
        const option = document.createElement('option');
        option.value = department.id;
        option.textContent = department.name;
        departmentSelect.appendChild(option);
    });
}

function editEmployee(id) {
    const employee = employees.find(emp => emp.id === parseInt(id));
    if (!employee) return;

    currentEditId = employee.id;
    employeeFormTitle.textContent = 'Edit Employee';

    employeeIdInput.value = employee.id;
    firstNameInput.value = employee.first_name;
    lastNameInput.value = employee.last_name;
    emailInput.value = employee.email;
    hireDateInput.value = formatDateForInput(employee.hire_date);
    salaryInput.value = employee.salary;

    loadDepartmentsIntoSelect();
    if (employee.department_id) {
        departmentSelect.value = employee.department_id;
    }

    employeeModal.style.display = 'block';
}

function editDepartment(id) {
    const department = departments.find(dept => dept.id === parseInt(id));
    if (!department) return;

    currentEditId = department.id;
    departmentFormTitle.textContent = 'Edit Department';

    departmentIdInput.value = department.id;
    departmentNameInput.value = department.name;
    locationInput.value = department.location || '';

    departmentModal.style.display = 'block';
}

function handleEmployeeFormSubmit(e) {
    e.preventDefault();

    const employeeData = {
        first_name: firstNameInput.value,
        last_name: lastNameInput.value,
        email: emailInput.value,
        hire_date: hireDateInput.value,
        salary: parseFloat(salaryInput.value),
        department_id: departmentSelect.value ? parseInt(departmentSelect.value) : null
    };

    if (currentEditId) {
        updateEmployee(currentEditId, employeeData);
    } else {
        addEmployee(employeeData);
    }
}

function handleDepartmentFormSubmit(e) {
    e.preventDefault();

    const departmentData = {
        name: departmentNameInput.value,
        location: locationInput.value
    };

    if (currentEditId) {
        updateDepartment(currentEditId, departmentData);
    } else {
        addDepartment(departmentData);
    }
}

function sortEmployees() {
    const sortBy = employeeSort.value;

    employees.sort((a, b) => {
        switch (sortBy) {
            case 'last_name':
                return a.last_name.localeCompare(b.last_name);
            case 'hire_date':
                return new Date(a.hire_date) - new Date(b.hire_date);
            case 'salary':
                return parseFloat(a.salary) - parseFloat(b.salary);
            default:
                return a.id - b.id;
        }
    });

    renderEmployees();
}

// Helper Functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}
