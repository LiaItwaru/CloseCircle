// Close Circle Social Media Platform JavaScript

// Global state
let currentUser = null;
let posts = [];
let connections = [];
let signupData = {};

// Sample data for demonstration
const sampleUsers = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "realtor",
        email: "sarah@example.com",
        avatar: "SJ",
        about: "Experienced realtor specializing in residential properties in downtown area."
    },
    {
        id: 2,
        name: "Mike Chen",
        role: "mlo",
        email: "mike@example.com",
        avatar: "MC",
        about: "Mortgage loan officer with 10+ years helping families achieve homeownership."
    },
    {
        id: 3,
        name: "Lisa Rodriguez",
        role: "realtor",
        email: "lisa@example.com",
        avatar: "LR",
        about: "Commercial real estate specialist focusing on investment properties."
    }
];

const samplePosts = [
    {
        id: 1,
        userId: 1,
        content: "Just closed on a beautiful family home! Another happy family gets their dream home. 🏡 #RealEstate #DreamHome",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 12,
        comments: 3
    },
    {
        id: 2,
        userId: 2,
        content: "Interest rates are looking favorable this month. Great time for first-time homebuyers to explore their options! 📈 #MortgageAdvice #FirstTimeHomeBuyer",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        likes: 8,
        comments: 5
    },
    {
        id: 3,
        userId: 3,
        content: "Market update: Commercial properties in the tech district are seeing increased demand. Perfect opportunity for investors! 💼 #CommercialRealEstate #Investment",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        likes: 15,
        comments: 2
    }
];

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const createPostBtn = document.getElementById('createPostBtn');
const postContent = document.getElementById('postContent');
const postsContainer = document.getElementById('postsContainer');

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    initializeEventListeners();
    loadSampleData();
    showSection('feed');
});

// Event Listeners
function initializeEventListeners() {
    // Modal controls
    loginBtn.addEventListener('click', () => showModal('loginModal'));
    signupBtn.addEventListener('click', () => showModal('signupModal'));

    // Close modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.closest('.nav-link').dataset.section;
            showSection(section);

            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            e.target.closest('.nav-link').classList.add('active');
        });
    });

    // Forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Signup flow
    document.getElementById('nextStep1').addEventListener('click', handleStep1Next);
    document.getElementById('backStep1').addEventListener('click', () => showSignupStep(1));
    document.getElementById('nextStep2').addEventListener('click', handleStep2Next);
    document.getElementById('backStep2').addEventListener('click', () => showSignupStep(2));
    document.getElementById('createAccount').addEventListener('click', handleCreateAccount);

    // Role selection
    document.querySelectorAll('.role-card').forEach(card => {
        card.addEventListener('click', selectRole);
    });

    // Post creation
    createPostBtn.addEventListener('click', createPost);
}

// Modal functions
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';

    // Reset signup modal to step 1 when opened
    if (modalId === 'signupModal') {
        showSignupStep(1);
        signupData = {};
        document.getElementById('signupForm').reset();
        document.querySelectorAll('.role-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.getElementById('nextStep2').disabled = true;
    }
}

// Navigation functions
function showSection(sectionName) {
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName + 'Section').classList.add('active');
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simple demo authentication
    const user = sampleUsers.find(u => u.email === email);
    if (user) {
        currentUser = user;
        updateUIForLoggedInUser();
        document.getElementById('loginModal').style.display = 'none';
        showNotification('Welcome back, ' + user.name + '!', 'success');
    } else {
        showNotification('Invalid credentials. Try sarah@example.com or mike@example.com', 'error');
    }
}

// Signup Flow Functions
function showSignupStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.signup-step').forEach(step => {
        step.classList.remove('active');
    });

    // Show current step
    document.getElementById(`signupStep${stepNumber}`).classList.add('active');

    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < stepNumber) {
            step.classList.add('completed');
        } else if (index + 1 === stepNumber) {
            step.classList.add('active');
        }
    });
}

function handleStep1Next() {
    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    if (!name || !email || !password) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    // Store step 1 data
    signupData.name = name;
    signupData.email = email;
    signupData.password = password;

    showSignupStep(2);
}

function selectRole(e) {
    const roleCard = e.currentTarget;
    const role = roleCard.dataset.role;

    // Remove selection from all cards
    document.querySelectorAll('.role-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Select current card
    roleCard.classList.add('selected');
    signupData.role = role;

    // Enable next button
    document.getElementById('nextStep2').disabled = false;
}

function handleStep2Next() {
    if (!signupData.role) {
        showNotification('Please select your professional role', 'error');
        return;
    }

    // Generate license form based on role
    generateLicenseForm(signupData.role);
    showSignupStep(3);
}

function generateLicenseForm(role) {
    const licenseForm = document.getElementById('licenseForm');

    if (role === 'mlo') {
        licenseForm.innerHTML = `
            <div class="license-info">
                <h4><i class="fas fa-certificate"></i> NMLS License Verification</h4>
                <p>As a Mortgage Loan Originator, you must be licensed through the Nationwide Multistate Licensing System (NMLS).</p>
                <ul>
                    <li>Your NMLS ID will be verified against the NMLS Consumer Access database</li>
                    <li>License must be active and in good standing</li>
                    <li>State endorsements will be automatically detected</li>
                </ul>
            </div>
            <div class="form-group">
                <label for="nmlsId">NMLS ID Number *</label>
                <input type="text" id="nmlsId" placeholder="Enter your NMLS ID" required pattern="[0-9]+" maxlength="10">
                <small>Enter your unique NMLS identifier (numbers only)</small>
            </div>
            <div class="form-group">
                <label for="primaryState">Primary State License</label>
                <select id="primaryState" required>
                    <option value="">Select your primary state</option>
                    <option value="CA">California</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                    <option value="NY">New York</option>
                    <option value="IL">Illinois</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="OH">Ohio</option>
                    <option value="GA">Georgia</option>
                    <option value="NC">North Carolina</option>
                    <option value="MI">Michigan</option>
                </select>
            </div>
            <div class="verification-status pending">
                <i class="fas fa-clock"></i>
                License verification will be performed after account creation
            </div>
        `;
    } else if (role === 'realtor') {
        licenseForm.innerHTML = `
            <div class="license-info">
                <h4><i class="fas fa-home"></i> Real Estate License Verification</h4>
                <p>As a licensed Realtor, your state real estate license will be verified through your state's licensing board.</p>
                <ul>
                    <li>License must be active and current</li>
                    <li>Verification through state real estate commission</li>
                    <li>Brokerage affiliation will be confirmed</li>
                </ul>
            </div>
            <div class="form-group">
                <label for="licenseNumber">Real Estate License Number *</label>
                <input type="text" id="licenseNumber" placeholder="Enter your license number" required maxlength="20">
                <small>Enter your state-issued real estate license number</small>
            </div>
            <div class="form-group">
                <label for="licenseState">License State *</label>
                <select id="licenseState" required>
                    <option value="">Select your license state</option>
                    <option value="CA">California</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                    <option value="NY">New York</option>
                    <option value="IL">Illinois</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="OH">Ohio</option>
                    <option value="GA">Georgia</option>
                    <option value="NC">North Carolina</option>
                    <option value="MI">Michigan</option>
                </select>
            </div>
            <div class="form-group">
                <label for="brokerage">Brokerage/Company</label>
                <input type="text" id="brokerage" placeholder="Enter your brokerage name">
                <small>Optional: Your current brokerage or company affiliation</small>
            </div>
            <div class="verification-status pending">
                <i class="fas fa-clock"></i>
                License verification will be performed after account creation
            </div>
        `;
    }
}

function handleCreateAccount() {
    // Validate license information
    if (signupData.role === 'mlo') {
        const nmlsId = document.getElementById('nmlsId').value.trim();
        const primaryState = document.getElementById('primaryState').value;

        if (!nmlsId || !primaryState) {
            showNotification('Please complete all license information', 'error');
            return;
        }

        if (!/^\d+$/.test(nmlsId)) {
            showNotification('NMLS ID must contain only numbers', 'error');
            return;
        }

        signupData.nmlsId = nmlsId;
        signupData.primaryState = primaryState;

    } else if (signupData.role === 'realtor') {
        const licenseNumber = document.getElementById('licenseNumber').value.trim();
        const licenseState = document.getElementById('licenseState').value;
        const brokerage = document.getElementById('brokerage').value.trim();

        if (!licenseNumber || !licenseState) {
            showNotification('Please complete all required license information', 'error');
            return;
        }

        signupData.licenseNumber = licenseNumber;
        signupData.licenseState = licenseState;
        signupData.brokerage = brokerage;
    }

    // Create new user with license information
    const newUser = {
        id: sampleUsers.length + 1,
        name: signupData.name,
        role: signupData.role,
        email: signupData.email,
        avatar: signupData.name.split(' ').map(n => n[0]).join(''),
        about: `${signupData.role === 'mlo' ? 'Licensed Mortgage Loan Originator' : 'Licensed Realtor'} ready to connect and grow my network.`,
        licenseInfo: signupData.role === 'mlo' ? {
            nmlsId: signupData.nmlsId,
            primaryState: signupData.primaryState,
            verified: false
        } : {
            licenseNumber: signupData.licenseNumber,
            licenseState: signupData.licenseState,
            brokerage: signupData.brokerage,
            verified: false
        }
    };

    sampleUsers.push(newUser);
    currentUser = newUser;
    updateUIForLoggedInUser();
    document.getElementById('signupModal').style.display = 'none';

    // Reset signup data and form
    signupData = {};
    showSignupStep(1);
    document.getElementById('signupForm').reset();

    showNotification(`Welcome to Close Circle, ${newUser.name}! Your license verification is pending.`, 'success');
}

// UI Update functions
function updateUIForLoggedInUser() {
    if (!currentUser) return;

    // Update navigation
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('signupBtn').style.display = 'none';

    // Update user info in sidebar
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userRole').textContent = currentUser.role === 'mlo' ? 'Mortgage Loan Officer' : 'Realtor';

    // Update profile section
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileRole').textContent = currentUser.role === 'mlo' ? 'Mortgage Loan Officer' : 'Realtor';
    document.getElementById('profileAbout').textContent = currentUser.about;

    // Load user-specific content
    loadConnections();
    loadSuggestedConnections();
}

// Post functions
function createPost() {
    if (!currentUser) {
        showNotification('Please log in to create posts', 'error');
        return;
    }

    const content = postContent.value.trim();
    if (!content) {
        showNotification('Please enter some content for your post', 'error');
        return;
    }

    const newPost = {
        id: posts.length + 1,
        userId: currentUser.id,
        content: content,
        timestamp: new Date(),
        likes: 0,
        comments: 0
    };

    posts.unshift(newPost);
    postContent.value = '';
    renderPosts();
    showNotification('Post created successfully!', 'success');
}

function renderPosts() {
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const user = sampleUsers.find(u => u.id === post.userId);
        if (!user) return;

        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div class="post-header">
                <div class="post-avatar">${user.avatar}</div>
                <div class="post-info">
                    <h4>${user.name}</h4>
                    <p>${user.role === 'mlo' ? 'Mortgage Loan Officer' : 'Realtor'} • ${formatTimeAgo(post.timestamp)}</p>
                </div>
            </div>
            <div class="post-content">
                ${post.content}
            </div>
            <div class="post-actions-bar">
                <button class="post-action" onclick="likePost(${post.id})">
                    <i class="fas fa-heart"></i> ${post.likes}
                </button>
                <button class="post-action">
                    <i class="fas fa-comment"></i> ${post.comments}
                </button>
                <button class="post-action">
                    <i class="fas fa-share"></i> Share
                </button>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

function likePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.likes++;
        renderPosts();
    }
}

// Connection functions
function loadConnections() {
    const connectionsGrid = document.getElementById('connectionsGrid');
    if (connections.length === 0) {
        connectionsGrid.innerHTML = '<p>No connections yet. Start networking!</p>';
        return;
    }

    connectionsGrid.innerHTML = connections.map(connection => `
        <div class="connection-card">
            <div class="user-avatar">${connection.avatar}</div>
            <h4>${connection.name}</h4>
            <p>${connection.role === 'mlo' ? 'Mortgage Loan Officer' : 'Realtor'}</p>
            <button class="btn-primary">Message</button>
        </div>
    `).join('');
}

function loadSuggestedConnections() {
    const suggestedContainer = document.getElementById('suggestedConnections');
    const suggestions = sampleUsers.filter(user =>
        user.id !== currentUser?.id &&
        !connections.find(conn => conn.id === user.id)
    ).slice(0, 3);

    suggestedContainer.innerHTML = suggestions.map(user => `
        <div class="suggestion-item" style="display: flex; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--border-color);">
            <div class="user-avatar" style="width: 40px; height: 40px; font-size: 1rem; margin-right: 1rem;">${user.avatar}</div>
            <div style="flex: 1;">
                <h5 style="margin-bottom: 0.25rem;">${user.name}</h5>
                <p style="font-size: 0.8rem; color: var(--text-secondary);">${user.role === 'mlo' ? 'MLO' : 'Realtor'}</p>
            </div>
            <button class="btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.8rem;" onclick="connect(${user.id})">Connect</button>
        </div>
    `).join('');
}

function connect(userId) {
    const user = sampleUsers.find(u => u.id === userId);
    if (user && !connections.find(conn => conn.id === userId)) {
        connections.push(user);
        loadConnections();
        loadSuggestedConnections();
        showNotification(`Connected with ${user.name}!`, 'success');
    }
}

// Utility functions
function formatTimeAgo(date) {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
        return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--primary-blue)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        z-index: 3000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function loadSampleData() {
    posts = [...samplePosts];
    renderPosts();
    loadSuggestedConnections();
}
