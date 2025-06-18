// Global variables
let currentUser = null
let jobs = []
let applications = []
let notifications = []

// Sample data
const sampleJobs = [
	{
		id: 1,
		title: 'Desenvolvedor Frontend React',
		company: 'TechCorp Solutions',
		type: 'clt',
		salary: 'R$ 5.000,00',
		location: 'São Paulo, SP',
		description:
			'Desenvolvimento de interfaces modernas com React e TypeScript.',
		requirements: 'Experiência com React, JavaScript, HTML5, CSS3',
		published: '2024-06-15',
	},
	{
		id: 2,
		title: 'Estagiário de Marketing Digital',
		company: 'Marketing Pro',
		type: 'estagio',
		salary: 'R$ 1.200,00',
		location: 'Rio de Janeiro, RJ',
		description: 'Apoio em campanhas de marketing digital e redes sociais.',
		requirements: 'Cursando Marketing ou áreas afins',
		published: '2024-06-14',
	},
	{
		id: 3,
		title: 'Designer Freelancer',
		company: 'Creative Studio',
		type: 'freelancer',
		salary: 'R$ 80,00/hora',
		location: 'Remoto',
		description: 'Criação de materiais gráficos para diversos clientes.',
		requirements: 'Portfolio sólido, domínio Adobe Creative Suite',
		published: '2024-06-13',
	},
]

const sampleNotifications = [
	{
		id: 1,
		type: 'application_response',
		title: 'Resposta de Candidatura',
		message:
			"Sua candidatura para 'Desenvolvedor Frontend React' foi aceita!",
		time: '2 horas atrás',
		unread: true,
		jobId: 1,
		status: 'accepted',
	},
	{
		id: 2,
		type: 'new_application',
		title: 'Nova Candidatura',
		message: "João Silva se candidatou para sua vaga 'Designer Freelancer'",
		time: '5 horas atrás',
		unread: true,
		applicationId: 1,
		pending: true,
	},
	{
		id: 3,
		type: 'job_published',
		title: 'Vaga Publicada',
		message: "Sua vaga 'Analista de Dados' foi publicada com sucesso!",
		time: '1 dia atrás',
		unread: false,
	},
]

// Initialize
document.addEventListener('DOMContentLoaded', function () {
	jobs = [...sampleJobs]
	notifications = [...sampleNotifications]

	// Event listeners
	document.getElementById('loginForm').addEventListener('submit', handleLogin)
	document
		.getElementById('publishForm')
		.addEventListener('submit', handlePublishJob)

	// Search and filter
	document.getElementById('searchInput').addEventListener('input', filterJobs)
	document.getElementById('typeFilter').addEventListener('change', filterJobs)
	document
		.getElementById('salaryFilter')
		.addEventListener('input', filterJobs)
	document
		.getElementById('locationFilter')
		.addEventListener('input', filterJobs)

	loadNotifications()
	updateNotificationCount()
})

// Login handling
function handleLogin(e) {
	e.preventDefault()

	const email = document.getElementById('email').value
	const userType = document.getElementById('userType').value

	currentUser = {
		email: email,
		type: userType,
		name: email.split('@')[0],
	}

	// Update UI based on user type
	const userBadge = document.getElementById('userBadge')
	const publishMenu = document.getElementById('publishJobMenu')

	if (userType === 'PJ') {
		userBadge.textContent = 'PJ - Empresa'
		publishMenu.style.display = 'block'
	} else {
		userBadge.textContent = 'PF - Candidato'
		publishMenu.style.display = 'none'
	}

	// Switch to dashboard
	document.getElementById('loginScreen').classList.remove('active')
	document.getElementById('dashboardScreen').classList.add('active')

	loadJobs()
	loadApplications()
}

// Logout
function logout() {
	currentUser = null
	document.getElementById('dashboardScreen').classList.remove('active')
	document.getElementById('loginScreen').classList.add('active')

	// Reset form
	document.getElementById('loginForm').reset()
}

// Navigation
function showSection(section) {
	// Hide all sections
	document
		.querySelectorAll('.content-section')
		.forEach((s) => s.classList.add('hidden'))

	// Remove active class from all sidebar links
	document
		.querySelectorAll('.sidebar-link')
		.forEach((link) => link.classList.remove('active'))

	// Show selected section
	document.getElementById(section + 'Section').classList.remove('hidden')

	// Add active class to clicked link
	event.target.classList.add('active')

	// Load content based on section
	switch (section) {
		case 'jobs':
			loadJobs()
			break
		case 'applications':
			loadApplications()
			break
	}
}

// Load jobs
function loadJobs() {
	const jobsGrid = document.getElementById('jobsGrid')
	jobsGrid.innerHTML = jobs
		.map(
			(job) => `
                <div class="job-card">
                    <div class="job-title">${job.title}</div>
                    <div class="job-company">${job.company}</div>
                    <div class="job-details">
                        <span class="job-tag">${getJobTypeLabel(
							job.type
						)}</span>
                        <span class="job-tag">📍 ${job.location}</span>
                    </div>
                    <div class="job-salary">${job.salary}</div>
                    <div class="job-actions">
                        ${
							currentUser?.type === 'PF'
								? `<button class="btn-apply" onclick="applyToJob(${job.id})">Candidatar-se</button>`
								: ''
						}
                        <button class="btn-details" onclick="showJobDetails(${
							job.id
						})">Detalhes</button>
                    </div>
                </div>
            `
		)
		.join('')
}

// Apply to job
function applyToJob(jobId) {
	const job = jobs.find((j) => j.id === jobId)
	if (!job) return

	// Check if already applied
	const existingApplication = applications.find(
		(app) => app.jobId === jobId && app.userId === currentUser.email
	)
	if (existingApplication) {
		alert('Você já se candidatou para esta vaga!')
		return
	}

	// Create application
	const application = {
		id: applications.length + 1,
		jobId: jobId,
		jobTitle: job.title,
		company: job.company,
		userId: currentUser.email,
		userName: currentUser.name,
		appliedAt: new Date().toISOString(),
		status: 'pending',
	}

	applications.push(application)

	// Create notification for company (if PJ user posted the job)
	const notification = {
		id: notifications.length + 1,
		type: 'new_application',
		title: 'Nova Candidatura',
		message: `${currentUser.name} se candidatou para a vaga '${job.title}'`,
		time: 'Agora',
		unread: true,
		applicationId: application.id,
		pending: true,
	}

	notifications.push(notification)
	updateNotificationCount()

	alert('Candidatura enviada com sucesso!')
}

// Show job details
function showJobDetails(jobId) {
	const job = jobs.find((j) => j.id === jobId)
	if (!job) return

	alert(`
                Vaga: ${job.title}
                Empresa: ${job.company}
                Tipo: ${getJobTypeLabel(job.type)}
                Salário: ${job.salary}
                Localização: ${job.location}

                Descrição:
                ${job.description}

                Requisitos:
                ${job.requirements}
            `)
}

// Get job type label
function getJobTypeLabel(type) {
	const labels = {
		estagio: 'Estágio',
		clt: 'CLT',
		freelancer: 'Freelancer',
	}
	return labels[type] || type
}

// Handle publish job
function handlePublishJob(e) {
	e.preventDefault()

	if (currentUser?.type !== 'PJ') {
		alert('Apenas empresas podem publicar vagas!')
		return
	}

	const formData = new FormData(e.target)
	const jobData = {
		id: jobs.length + 1,
		title: e.target.querySelector('input[type="text"]').value,
		company: e.target.querySelectorAll('input[type="text"]')[1].value,
		type: e.target.querySelector('select').value,
		salary: e.target.querySelector('input[placeholder="R$ 0,00"]').value,
		location: `${
			e.target.querySelectorAll('input[type="text"]')[2].value
		}, ${e.target.querySelectorAll('input[type="text"]')[3].value}`,
		description: e.target.querySelectorAll('textarea')[0].value,
		requirements: e.target.querySelectorAll('textarea')[1].value,
		published: new Date().toISOString().split('T')[0],
	}

	jobs.push(jobData)

	// Create success notification
	const notification = {
		id: notifications.length + 1,
		type: 'job_published',
		title: 'Vaga Publicada',
		message: `Sua vaga '${jobData.title}' foi publicada com sucesso!`,
		time: 'Agora',
		unread: true,
	}

	notifications.push(notification)
	updateNotificationCount()

	alert('Vaga publicada com sucesso!')
	e.target.reset()

	// Switch to jobs view
	showSection('jobs')
}

// Load applications
function loadApplications() {
	const applicationsGrid = document.getElementById('applicationsGrid')

	let userApplications = []

	if (currentUser?.type === 'PF') {
		// Show applications made by the user
		userApplications = applications.filter(
			(app) => app.userId === currentUser.email
		)
	} else if (currentUser?.type === 'PJ') {
		// Show applications for jobs posted by the company
		const companyJobs = jobs.filter((job) =>
			job.company.toLowerCase().includes(currentUser.name.toLowerCase())
		)
		userApplications = applications.filter((app) =>
			companyJobs.some((job) => job.id === app.jobId)
		)
	}

	if (userApplications.length === 0) {
		applicationsGrid.innerHTML =
			'<p style="text-align: center; color: #666; padding: 2rem;">Nenhuma candidatura encontrada.</p>'
		return
	}

	applicationsGrid.innerHTML =
		'<div class="jobs-grid">' +
		userApplications
			.map(
				(app) => `
                <div class="job-card">
                    <div class="job-title">${app.jobTitle}</div>
                    <div class="job-company">${app.company}</div>
                    <div class="job-details">
                        <span class="job-tag ${getStatusClass(
							app.status
						)}">${getStatusLabel(app.status)}</span>
                        <span class="job-tag">📅 ${new Date(
							app.appliedAt
						).toLocaleDateString('pt-BR')}</span>
                    </div>
                    ${
						currentUser?.type === 'PF'
							? `<div class="job-actions">
                            <button class="btn-details" onclick="showApplicationDetails(${app.id})">Ver Detalhes</button>
                        </div>`
							: `<div class="job-actions">
                            <button class="btn-details" onclick="showCandidateDetails(${
								app.id
							})">Ver Candidato</button>
                            ${
								app.status === 'pending'
									? `<button class="btn-accept" onclick="respondToApplication(${app.id}, 'accepted')">Aceitar</button>
                                 <button class="btn-reject" onclick="respondToApplication(${app.id}, 'rejected')">Rejeitar</button>`
									: ''
							}
                        </div>`
					}
                </div>
            `
			)
			.join('') +
		'</div>'
}

// Get status class
function getStatusClass(status) {
	const classes = {
		pending: 'job-tag-pending',
		accepted: 'job-tag-accepted',
		rejected: 'job-tag-rejected',
	}
	return classes[status] || ''
}

// Get status label
function getStatusLabel(status) {
	const labels = {
		pending: 'Pendente',
		accepted: 'Aceita',
		rejected: 'Rejeitada',
	}
	return labels[status] || status
}

// Show application details
function showApplicationDetails(applicationId) {
	const application = applications.find((app) => app.id === applicationId)
	if (!application) return

	const job = jobs.find((j) => j.id === application.jobId)

	alert(`
                Candidatura para: ${application.jobTitle}
                Empresa: ${application.company}
                Status: ${getStatusLabel(application.status)}
                Data da candidatura: ${new Date(
					application.appliedAt
				).toLocaleDateString('pt-BR')}

                ${
					job
						? `
                Descrição da vaga:
                ${job.description}

                Requisitos:
                ${job.requirements}
                `
						: ''
				}
            `)
}

// Show candidate details
function showCandidateDetails(applicationId) {
	const application = applications.find((app) => app.id === applicationId)
	if (!application) return

	alert(`
                Candidato: ${application.userName}
                Email: ${application.userId}
                Vaga: ${application.jobTitle}
                Data da candidatura: ${new Date(
					application.appliedAt
				).toLocaleDateString('pt-BR')}
                Status: ${getStatusLabel(application.status)}
            `)
}

// Respond to application
function respondToApplication(applicationId, response) {
	const application = applications.find((app) => app.id === applicationId)
	if (!application) return

	application.status = response

	// Create notification for candidate
	const notification = {
		id: notifications.length + 1,
		type: 'application_response',
		title: 'Resposta de Candidatura',
		message: `Sua candidatura para '${application.jobTitle}' foi ${
			response === 'accepted' ? 'aceita' : 'rejeitada'
		}!`,
		time: 'Agora',
		unread: true,
		jobId: application.jobId,
		status: response,
	}

	notifications.push(notification)
	updateNotificationCount()

	alert(
		`Candidatura ${
			response === 'accepted' ? 'aceita' : 'rejeitada'
		} com sucesso!`
	)
	loadApplications()
}

// Notifications
function toggleNotifications() {
	const panel = document.getElementById('notificationsPanel')
	const overlay = document.getElementById('overlay')

	if (panel.classList.contains('open')) {
		panel.classList.remove('open')
		overlay.classList.remove('active')
	} else {
		panel.classList.add('open')
		overlay.classList.add('active')
		loadNotifications()
	}
}

function loadNotifications() {
	const notificationsList = document.getElementById('notificationsList')

	if (notifications.length === 0) {
		notificationsList.innerHTML =
			'<p style="text-align: center; color: #666;">Nenhuma notificação.</p>'
		return
	}

	notificationsList.innerHTML = notifications
		.map(
			(notification) => `
                <div class="notification-item ${
					notification.unread ? 'unread' : ''
				}">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${
						notification.message
					}</div>
                    <div class="notification-time">${notification.time}</div>
                    ${
						notification.pending && currentUser?.type === 'PJ'
							? `
                        <div class="notification-actions">
                            <button class="btn-accept" onclick="respondFromNotification(${notification.applicationId}, 'accepted', ${notification.id})">Aceitar</button>
                            <button class="btn-reject" onclick="respondFromNotification(${notification.applicationId}, 'rejected', ${notification.id})">Rejeitar</button>
                        </div>
                    `
							: ''
					}
                </div>
            `
		)
		.join('')
}

function respondFromNotification(applicationId, response, notificationId) {
	respondToApplication(applicationId, response)

	// Mark notification as read and remove pending
	const notification = notifications.find((n) => n.id === notificationId)
	if (notification) {
		notification.unread = false
		notification.pending = false
	}

	loadNotifications()
	updateNotificationCount()
}

function updateNotificationCount() {
	const count = notifications.filter((n) => n.unread).length
	const countElement = document.getElementById('notificationCount')

	if (count > 0) {
		countElement.textContent = count
		countElement.style.display = 'flex'
	} else {
		countElement.style.display = 'none'
	}
}

// Add CSS for status styling
const additionalCSS = `
            .job-tag-pending { background-color: #fff3cd; color: #856404; }
            .job-tag-accepted { background-color: #d1f2eb; color: #155724; }
            .job-tag-rejected { background-color: #f8d7da; color: #721c24; }
            
            .btn-accept {
                padding: 0.5rem 1rem;
                background: #2ed573;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.8rem;
                margin-right: 0.5rem;
            }
            
            .btn-reject {
                padding: 0.5rem 1rem;
                background: #ff4757;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.8rem;
            }
        `

const style = document.createElement('style')
style.textContent = additionalCSS
document.head.appendChild(style)

// Filter jobs
function filterJobs() {
	const search = document.getElementById('searchInput').value.toLowerCase()
	const type = document.getElementById('typeFilter').value
	const minSalary =
		parseFloat(document.getElementById('salaryFilter').value) || 0
	const location = document
		.getElementById('locationFilter')
		.value.toLowerCase()

	const filteredJobs = jobs.filter((job) => {
		const matchesSearch =
			job.title.toLowerCase().includes(search) ||
			job.company.toLowerCase().includes(search)
		const matchesType = !type || job.type === type
		const matchesLocation =
			!location || job.location.toLowerCase().includes(location)
		const jobSalary =
			parseFloat(job.salary.replace(/[^\d,]/g, '').replace(',', '.')) || 0
		const matchesSalary = jobSalary >= minSalary

		return matchesSearch && matchesType && matchesLocation && matchesSalary
	})

	const jobsGrid = document.getElementById('jobsGrid')
	jobsGrid.innerHTML = filteredJobs
		.map(
			(job) => `
            <div class="job-card">
                <div class="job-title">${job.title}</div>
                <div class="job-company">${job.company}</div>
                <div class="job-details">
                    <span class="job-tag">${getJobTypeLabel(job.type)}</span>
                    <span class="job-tag">📍 ${job.location}</span>
                </div>
                <div class="job-salary">${job.salary}</div>
                <div class="job-actions">
                    ${
						currentUser?.type === 'PF'
							? `<button class="btn-apply" onclick="applyToJob(${job.id})">Candidatar-se</button>`
							: ''
					}
                    <button class="btn-details" onclick="showJobDetails(${
						job.id
					})">Detalhes</button>
                </div>
            </div>
        `
		)
		.join('')
}