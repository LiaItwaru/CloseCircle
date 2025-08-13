// Close Circle Social Media Platform JavaScript

// Global state
let currentUser = null;
let posts = [];
let connections = [];
let signupData = {};
let userLikes = new Set(); // Track which posts the current user has liked
let conversations = []; // Track user conversations
let activeConversation = null; // Currently selected conversation
let buyerInquiries = []; // Track buyer inquiries
let inquiryResponses = {}; // Track professional responses to inquiries
let userLeads = []; // Track user's leads
let currentLeadId = null; // Currently selected lead

// Sample data for demonstration
const sampleUsers = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "realtor",
        email: "sarah@example.com",
        avatar: "SJ",
        about: "Experienced realtor specializing in residential properties in downtown area.",
        company: "Premier Realty Group",
        location: "Austin, TX",
        phone: "(512) 555-0123",
        website: "https://sarahjohnsonrealty.com",
        experience: "6-10",
        specialties: "First-time buyers, Luxury homes, Investment properties"
    },
    {
        id: 2,
        name: "Mike Chen",
        role: "mlo",
        email: "mike@example.com",
        avatar: "MC",
        about: "Mortgage loan officer with 10+ years helping families achieve homeownership.",
        company: "First National Mortgage",
        location: "Dallas, TX",
        phone: "(214) 555-0456",
        website: "https://mikechen-loans.com",
        experience: "11-15",
        specialties: "FHA loans, VA loans, Refinancing"
    },
    {
        id: 3,
        name: "Lisa Rodriguez",
        role: "realtor",
        email: "lisa@example.com",
        avatar: "LR",
        about: "Commercial real estate specialist focusing on investment properties.",
        company: "Rodriguez Commercial Real Estate",
        location: "Houston, TX",
        phone: "(713) 555-0789",
        website: "https://lrodriguez-cre.com",
        experience: "16+",
        specialties: "Commercial properties, Investment analysis, Property management"
    }
];

const samplePosts = [
    {
        id: 1,
        userId: 1,
        content: "Just closed on a beautiful family home! Another happy family gets their dream home. 🏡 #RealEstate #DreamHome",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 12,
        comments: [
            {
                id: 1,
                userId: 2,
                content: "Congratulations Sarah! That's awesome news. Your clients must be thrilled!",
                timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
            },
            {
                id: 2,
                userId: 3,
                content: "Great work! Love seeing successful closings. 🎉",
                timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
            },
            {
                id: 3,
                userId: 1,
                content: "Thank you both! It was a smooth process and the family is so happy.",
                timestamp: new Date(Date.now() - 30 * 60 * 1000)
            }
        ]
    },
    {
        id: 2,
        userId: 2,
        content: "Interest rates are looking favorable this month. Great time for first-time homebuyers to explore their options! 📈 #MortgageAdvice #FirstTimeHomeBuyer",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        likes: 8,
        comments: [
            {
                id: 4,
                userId: 1,
                content: "This is great timing! I have several clients who have been waiting for rates to improve.",
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
            },
            {
                id: 5,
                userId: 3,
                content: "Perfect opportunity for my investor clients too. Thanks for the update Mike!",
                timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
            }
        ]
    },
    {
        id: 3,
        userId: 3,
        content: "Market update: Commercial properties in the tech district are seeing increased demand. Perfect opportunity for investors! 💼 #CommercialRealEstate #Investment",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        likes: 15,
        comments: [
            {
                id: 6,
                userId: 2,
                content: "I have some clients looking for investment properties. Would love to connect!",
                timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000)
            },
            {
                id: 7,
                userId: 1,
                content: "The tech district is definitely hot right now. Great insight Lisa!",
                timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
            }
        ]
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
    showWelcomePage();
});

// Event Listeners
function initializeEventListeners() {
    // Modal controls
    loginBtn.addEventListener('click', () => showModal('loginModal'));
    signupBtn.addEventListener('click', () => showModal('signupModal'));

    // Welcome page buttons
    document.getElementById('heroSignupBtn').addEventListener('click', () => showModal('signupModal'));
    document.getElementById('heroLoginBtn').addEventListener('click', () => showModal('loginModal'));
    document.getElementById('ctaSignupBtn').addEventListener('click', () => showModal('signupModal'));
    document.getElementById('buyerInquiryBtn').addEventListener('click', () => showModal('buyerInquiryModal'));

    // Buyer inquiry form
    document.getElementById('buyerInquiryForm').addEventListener('submit', handleBuyerInquiry);

    // Open Circle
    document.getElementById('respondToInquiry').addEventListener('click', respondToInquiry);
    document.getElementById('closeInquiryDetail').addEventListener('click', () => {
        document.getElementById('inquiryDetailModal').style.display = 'none';
    });

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

    // Profile editing
    document.getElementById('editProfileBtn').addEventListener('click', openEditProfile);
    document.getElementById('cancelEditProfile').addEventListener('click', closeEditProfile);
    document.getElementById('editProfileForm').addEventListener('submit', saveProfile);

    // Comments
    document.getElementById('addCommentBtn').addEventListener('click', addComment);
    document.getElementById('commentInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addComment();
        }
    });

    // Leads Management
    document.getElementById('addLeadBtn').addEventListener('click', () => showModal('addLeadModal'));
    document.getElementById('cancelAddLead').addEventListener('click', () => {
        document.getElementById('addLeadModal').style.display = 'none';
    });
    document.getElementById('addLeadForm').addEventListener('submit', handleAddLead);

    // Lead filters
    document.getElementById('statusFilter').addEventListener('change', filterLeads);
    document.getElementById('sourceFilter').addEventListener('change', filterLeads);
    document.getElementById('searchLeads').addEventListener('input', filterLeads);

    // Lead detail actions
    document.getElementById('contactLeadBtn').addEventListener('click', contactLead);

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

    // Refresh content when switching sections
    if (currentUser) {
        if (sectionName === 'leads') {
            setTimeout(() => {
                renderLeads();
                updateLeadsStats();
            }, 100);
        } else if (sectionName === 'messages') {
            setTimeout(() => {
                loadConversations();
            }, 100);
        }
    }
}

function showWelcomePage() {
    // Hide navigation menu for non-logged in users
    document.querySelector('.nav-menu').style.display = 'none';
    showSection('welcome');
}

function showMainApp() {
    // Show navigation menu for logged in users
    document.querySelector('.nav-menu').style.display = 'flex';
    showSection('feed');

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector('[data-section="feed"]').classList.add('active');
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
        showMainApp();
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

    showMainApp();
    showNotification(`Welcome to Close Circle, ${newUser.name}! Your license verification is pending.`, 'success');
}

// Profile Management Functions
function updateProfileDisplay() {
    if (!currentUser) return;

    // Basic info
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileRole').textContent = currentUser.role === 'mlo' ? 'Mortgage Loan Officer' : 'Realtor';
    document.getElementById('profileAbout').textContent = currentUser.about || 'Tell your network about yourself...';

    // Additional details
    document.getElementById('profileLocation').textContent = currentUser.location || '';
    document.getElementById('profileCompany').textContent = currentUser.company || '';

    // Professional details
    document.getElementById('profileExperienceLevel').textContent = currentUser.experience ?
        currentUser.experience + ' years' : 'Not specified';
    document.getElementById('profileSpecialties').textContent = currentUser.specialties || 'Not specified';
    document.getElementById('profilePhone').textContent = currentUser.phone || 'Not provided';

    // Website with link
    const websiteElement = document.getElementById('profileWebsite');
    if (currentUser.website) {
        websiteElement.innerHTML = `<a href="${currentUser.website}" target="_blank" style="color: var(--primary-blue);">${currentUser.website}</a>`;
    } else {
        websiteElement.textContent = 'Not provided';
    }

    // License information
    const licenseInfoElement = document.getElementById('profileLicenseInfo');
    if (currentUser.licenseInfo) {
        if (currentUser.role === 'mlo') {
            licenseInfoElement.innerHTML = `
                <div class="license-details">
                    <p><strong>NMLS ID:</strong> ${currentUser.licenseInfo.nmlsId}</p>
                    <p><strong>Primary State:</strong> ${currentUser.licenseInfo.primaryState}</p>
                    <p><strong>Status:</strong> <span class="verification-badge ${currentUser.licenseInfo.verified ? 'verified' : 'pending'}">
                        ${currentUser.licenseInfo.verified ? 'Verified' : 'Pending Verification'}
                    </span></p>
                </div>
            `;
        } else {
            licenseInfoElement.innerHTML = `
                <div class="license-details">
                    <p><strong>License Number:</strong> ${currentUser.licenseInfo.licenseNumber}</p>
                    <p><strong>License State:</strong> ${currentUser.licenseInfo.licenseState}</p>
                    ${currentUser.licenseInfo.brokerage ? `<p><strong>Brokerage:</strong> ${currentUser.licenseInfo.brokerage}</p>` : ''}
                    <p><strong>Status:</strong> <span class="verification-badge ${currentUser.licenseInfo.verified ? 'verified' : 'pending'}">
                        ${currentUser.licenseInfo.verified ? 'Verified' : 'Pending Verification'}
                    </span></p>
                </div>
            `;
        }
    } else {
        licenseInfoElement.innerHTML = '<p>License details will be displayed here after verification.</p>';
    }
}

function openEditProfile() {
    if (!currentUser) {
        showNotification('Please log in to edit your profile', 'error');
        return;
    }

    // Populate form with current user data
    document.getElementById('editFullName').value = currentUser.name || '';
    document.getElementById('editEmail').value = currentUser.email || '';
    document.getElementById('editRole').value = currentUser.role || '';
    document.getElementById('editAbout').value = currentUser.about || '';
    document.getElementById('editCompany').value = currentUser.company || '';
    document.getElementById('editLocation').value = currentUser.location || '';
    document.getElementById('editPhone').value = currentUser.phone || '';
    document.getElementById('editWebsite').value = currentUser.website || '';
    document.getElementById('editExperience').value = currentUser.experience || '';
    document.getElementById('editSpecialties').value = currentUser.specialties || '';

    // Show modal
    document.getElementById('editProfileModal').style.display = 'block';
}

function closeEditProfile() {
    document.getElementById('editProfileModal').style.display = 'none';
}

function saveProfile(e) {
    e.preventDefault();

    if (!currentUser) return;

    // Get form data
    const formData = {
        name: document.getElementById('editFullName').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        about: document.getElementById('editAbout').value.trim(),
        company: document.getElementById('editCompany').value.trim(),
        location: document.getElementById('editLocation').value.trim(),
        phone: document.getElementById('editPhone').value.trim(),
        website: document.getElementById('editWebsite').value.trim(),
        experience: document.getElementById('editExperience').value,
        specialties: document.getElementById('editSpecialties').value.trim()
    };

    // Validate required fields
    if (!formData.name || !formData.email) {
        showNotification('Name and email are required', 'error');
        return;
    }

    // Update current user
    Object.assign(currentUser, formData);

    // Update avatar if name changed
    currentUser.avatar = currentUser.name.split(' ').map(n => n[0]).join('');

    // Update the user in sampleUsers array
    const userIndex = sampleUsers.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        sampleUsers[userIndex] = { ...currentUser };
    }

    // Update UI
    updateProfileDisplay();
    document.getElementById('userName').textContent = currentUser.name;

    // Close modal
    closeEditProfile();

    showNotification('Profile updated successfully!', 'success');
}

// UI Update functions
function updateUIForLoggedInUser() {
    if (!currentUser) return;

    // Reset user likes for the new session
    userLikes.clear();

    // Update navigation
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('signupBtn').style.display = 'none';

    // Update user info in sidebar
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userRole').textContent = currentUser.role === 'mlo' ? 'Mortgage Loan Officer' : 'Realtor';

    // Update profile section
    updateProfileDisplay();

    // Load user-specific content
    loadConnections();
    loadSuggestedConnections();
    initializeSampleLeads();

    // Re-render posts to show correct like states
    renderPosts();
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
        comments: [] // Initialize as empty array instead of 0
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

        const isLiked = userLikes.has(post.id);
        const likeButtonClass = isLiked ? 'post-action liked' : 'post-action';

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
                <button class="${likeButtonClass}" data-post-id="${post.id}">
                    <i class="fas fa-heart"></i> ${post.likes}
                </button>
                <button class="post-action comment-btn" data-post-id="${post.id}">
                    <i class="fas fa-comment"></i> ${post.comments.length}
                </button>
                <button class="post-action">
                    <i class="fas fa-share"></i> Share
                </button>
            </div>
        `;

        // Add click event listeners
        const likeButton = postElement.querySelector(`[data-post-id="${post.id}"]`);
        const commentButton = postElement.querySelector(`.comment-btn[data-post-id="${post.id}"]`);

        likeButton.addEventListener('click', () => toggleLike(post.id));
        commentButton.addEventListener('click', () => openComments(post.id));

        postsContainer.appendChild(postElement);
    });
}

function toggleLike(postId) {
    if (!currentUser) {
        showNotification('Please log in to like posts', 'error');
        return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const isCurrentlyLiked = userLikes.has(postId);

    if (isCurrentlyLiked) {
        // Unlike the post
        userLikes.delete(postId);
        post.likes = Math.max(0, post.likes - 1); // Ensure likes don't go below 0
        showNotification('Post unliked', 'info');
    } else {
        // Like the post
        userLikes.add(postId);
        post.likes++;
        showNotification('Post liked!', 'success');
    }

    renderPosts();
}

// Comment System Functions
let currentPostId = null;

function openComments(postId) {
    if (!currentUser) {
        showNotification('Please log in to view comments', 'error');
        return;
    }

    currentPostId = postId;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const user = sampleUsers.find(u => u.id === post.userId);
    if (!user) return;

    // Load post preview
    loadPostPreview(post, user);

    // Load comments
    loadComments(post);

    // Update comment user avatar
    document.getElementById('commentUserAvatar').textContent = currentUser.avatar;

    // Show modal
    document.getElementById('commentsModal').style.display = 'block';
}

function loadPostPreview(post, user) {
    const postPreview = document.getElementById('commentPostPreview');
    postPreview.innerHTML = `
        <div class="post-preview-content">
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
        </div>
    `;
}

function loadComments(post) {
    const commentsContainer = document.getElementById('commentsContainer');

    if (!post.comments || post.comments.length === 0) {
        commentsContainer.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
        return;
    }

    commentsContainer.innerHTML = post.comments.map(comment => {
        const commentUser = sampleUsers.find(u => u.id === comment.userId);
        if (!commentUser) return '';

        return `
            <div class="comment">
                <div class="comment-avatar">${commentUser.avatar}</div>
                <div class="comment-content">
                    <div class="comment-header">
                        <h5>${commentUser.name}</h5>
                        <span class="comment-time">${formatTimeAgo(comment.timestamp)}</span>
                    </div>
                    <p>${comment.content}</p>
                </div>
            </div>
        `;
    }).join('');

    // Scroll to bottom of comments
    setTimeout(() => {
        commentsContainer.scrollTop = commentsContainer.scrollHeight;
    }, 100);
}

function addComment() {
    if (!currentUser || !currentPostId) return;

    const commentInput = document.getElementById('commentInput');
    const content = commentInput.value.trim();

    if (!content) {
        showNotification('Please enter a comment', 'error');
        return;
    }

    const post = posts.find(p => p.id === currentPostId);
    if (!post) return;

    // Create new comment
    const newComment = {
        id: Date.now(),
        userId: currentUser.id,
        content: content,
        timestamp: new Date()
    };

    // Add comment to post
    if (!post.comments) {
        post.comments = [];
    }
    post.comments.push(newComment);

    // Clear input
    commentInput.value = '';

    // Reload comments
    loadComments(post);

    // Update post display
    renderPosts();

    showNotification('Comment added!', 'success');
}

// Connection functions
function loadConnections() {
    const connectionsGrid = document.getElementById('connectionsGrid');
    if (connections.length === 0) {
        connectionsGrid.innerHTML = '<p>No connections yet. Start networking!</p>';
        return;
    }

    connectionsGrid.innerHTML = '';

    connections.forEach(connection => {
        const connectionCard = document.createElement('div');
        connectionCard.className = 'connection-card';
        connectionCard.innerHTML = `
            <div class="user-avatar">${connection.avatar}</div>
            <h4>${connection.name}</h4>
            <p>${connection.role === 'mlo' ? 'Mortgage Loan Officer' : 'Realtor'}</p>
            <button class="btn-primary message-btn" data-user-id="${connection.id}">Message</button>
        `;

        // Add event listener to the message button
        const messageBtn = connectionCard.querySelector('.message-btn');
        messageBtn.addEventListener('click', () => startConversation(connection.id));

        connectionsGrid.appendChild(connectionCard);
    });
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

// Messaging functions
function startConversation(userId) {
    if (!currentUser) {
        showNotification('Please log in to send messages', 'error');
        return;
    }

    const user = sampleUsers.find(u => u.id === userId);
    if (!user) return;

    // Check if conversation already exists
    let conversation = conversations.find(conv =>
        (conv.user1Id === currentUser.id && conv.user2Id === userId) ||
        (conv.user1Id === userId && conv.user2Id === currentUser.id)
    );

    // Create new conversation if it doesn't exist
    if (!conversation) {
        conversation = {
            id: conversations.length + 1,
            user1Id: currentUser.id,
            user2Id: userId,
            messages: [],
            lastActivity: new Date()
        };
        conversations.push(conversation);
    }

    // Switch to messages section and load the conversation
    showSection('messages');
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector('[data-section="messages"]').classList.add('active');

    loadConversations();
    selectConversation(conversation.id);

    showNotification(`Started conversation with ${user.name}`, 'success');
}

function loadConversations() {
    const conversationsList = document.querySelector('.conversations-list');
    if (!conversationsList) return;

    if (!currentUser || conversations.length === 0) {
        conversationsList.innerHTML = '<p>No conversations yet. Start connecting with professionals!</p>';
        return;
    }

    conversationsList.innerHTML = '<h3 style="margin-bottom: 1rem; color: var(--text-primary);">Conversations</h3>';

    // Filter conversations that involve the current user
    const userConversations = conversations.filter(conv =>
        conv.user1Id === currentUser.id || conv.user2Id === currentUser.id
    );

    if (userConversations.length === 0) {
        conversationsList.innerHTML += '<p style="color: var(--text-secondary); margin-top: 1rem;">No conversations yet. Respond to inquiries in Open Circle to start conversations!</p>';
        return;
    }

    userConversations.forEach(conversation => {
        const otherUserId = conversation.user1Id === currentUser.id ? conversation.user2Id : conversation.user1Id;
        const otherUser = sampleUsers.find(u => u.id === otherUserId);

        if (!otherUser) return;

        const lastMessage = conversation.messages.length > 0
            ? conversation.messages[conversation.messages.length - 1]
            : null;

        const conversationItem = document.createElement('div');
        conversationItem.className = `conversation-item ${activeConversation === conversation.id ? 'active' : ''}`;
        conversationItem.innerHTML = `
            <div class="conversation-avatar">${otherUser.avatar}</div>
            <div class="conversation-info">
                <h4>${otherUser.name}</h4>
                <p>${lastMessage ? lastMessage.content.substring(0, 30) + '...' : 'Start a conversation'}</p>
            </div>
        `;

        conversationItem.addEventListener('click', () => selectConversation(conversation.id));
        conversationsList.appendChild(conversationItem);
    });
}

function selectConversation(conversationId) {
    activeConversation = conversationId;
    const conversation = conversations.find(c => c.id === conversationId);

    if (!conversation) return;

    const otherUserId = conversation.user1Id === currentUser.id ? conversation.user2Id : conversation.user1Id;
    const otherUser = sampleUsers.find(u => u.id === otherUserId);

    // Update active conversation in the list
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelectorAll('.conversation-item')[conversations.findIndex(c => c.id === conversationId)]?.classList.add('active');

    // Load the message area
    loadMessageArea(conversation, otherUser);
}

function loadMessageArea(conversation, otherUser) {
    const messageArea = document.querySelector('.message-area');

    messageArea.innerHTML = `
        <div class="message-header">
            <div class="message-user-info">
                <div class="user-avatar" style="width: 40px; height: 40px; font-size: 1rem;">${otherUser.avatar}</div>
                <div>
                    <h4>${otherUser.name}</h4>
                    <p>${otherUser.role === 'mlo' ? 'Mortgage Loan Officer' : 'Realtor'}</p>
                </div>
            </div>
        </div>
        <div class="messages-container" id="messagesContainer">
            ${conversation.messages.length === 0
            ? '<p style="text-align: center; color: var(--text-secondary); margin: 2rem 0;">No messages yet. Start the conversation!</p>'
            : conversation.messages.map(message => `
                    <div class="message ${message.senderId === currentUser.id ? 'sent' : 'received'}">
                        <div class="message-content">${message.content}</div>
                        <div class="message-time">${formatTimeAgo(message.timestamp)}</div>
                    </div>
                `).join('')
        }
        </div>
        <div class="message-input-area">
            <div class="message-input-container">
                <input type="text" id="messageInput" placeholder="Type a message..." />
                <button class="btn-primary" id="sendMessageBtn">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;

    // Add event listeners for sending messages
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendMessageBtn');

    const sendMessage = () => {
        const content = messageInput.value.trim();
        if (!content) return;

        const newMessage = {
            id: Date.now(),
            senderId: currentUser.id,
            content: content,
            timestamp: new Date()
        };

        conversation.messages.push(newMessage);
        conversation.lastActivity = new Date();

        messageInput.value = '';
        loadMessageArea(conversation, otherUser);
        loadConversations(); // Refresh conversation list

        // Scroll to bottom of messages
        const messagesContainer = document.getElementById('messagesContainer');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Scroll to bottom of messages
    setTimeout(() => {
        const messagesContainer = document.getElementById('messagesContainer');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
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
    initializeSampleInquiries();
}

// Open Circle System
function initializeSampleInquiries() {
    // Add some sample buyer inquiries
    const sampleInquiries = [
        {
            id: 1,
            name: "Jennifer Martinez",
            email: "jennifer.m@email.com",
            phone: "(555) 123-4567",
            location: "Austin, TX",
            budget: "400k-600k",
            timeframe: "1-3months",
            needs: ["both"],
            message: "First-time homebuyer looking for a 3BR home in a good school district.",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            urgent: false
        },
        {
            id: 2,
            name: "Robert Chen",
            email: "robert.chen@email.com",
            phone: "(555) 987-6543",
            location: "Dallas, TX",
            budget: "600k-800k",
            timeframe: "immediately",
            needs: ["realtor"],
            message: "Need to relocate quickly for work. Looking for move-in ready homes.",
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            urgent: true
        },
        {
            id: 3,
            name: "Sarah Williams",
            email: "sarah.w@email.com",
            phone: "(555) 456-7890",
            location: "Houston, TX",
            budget: "200k-400k",
            timeframe: "3-6months",
            needs: ["mlo"],
            message: "Self-employed, need help with mortgage pre-approval process.",
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            urgent: false
        },
        {
            id: 4,
            name: "Alex Rodriguez",
            email: "alex.rodriguez@email.com",
            phone: "(555) 678-9012",
            location: "San Antonio, TX",
            budget: "300k-500k",
            timeframe: "immediately",
            needs: ["both"],
            message: "Military veteran using VA loan. Need both realtor and MLO assistance ASAP for PCS move.",
            timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
            urgent: true
        },
        {
            id: 5,
            name: "Maria Gonzalez",
            email: "maria.g@email.com",
            phone: "(555) 789-0123",
            location: "Fort Worth, TX",
            budget: "250k-350k",
            timeframe: "1-3months",
            needs: ["realtor"],
            message: "First-time homebuyer, already pre-approved. Looking for starter home in safe neighborhood.",
            timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
            urgent: false
        }
    ];

    buyerInquiries = [...sampleInquiries];
    inquiryResponses = {
        1: { mlos: [], realtors: [] },
        2: { mlos: [], realtors: [] },
        3: { mlos: [], realtors: [] },
        4: { mlos: [], realtors: [] },
        5: { mlos: [], realtors: [] }
    };

    renderOpenCircle();

    // Add a fresh test inquiry after 10 seconds for demonstration
    setTimeout(() => {
        addTestInquiry();
    }, 10000);
}

function addTestInquiry() {
    const testInquiry = {
        id: buyerInquiries.length + 1,
        name: "Jessica Parker",
        email: "jessica.parker@email.com",
        phone: "(555) 890-1234",
        location: "Plano, TX",
        budget: "400k-600k",
        timeframe: "immediately",
        needs: ["both"],
        message: "Relocating for new job! Need to find and finance a home within 30 days. Have excellent credit and 20% down payment ready.",
        timestamp: new Date(),
        urgent: true
    };

    buyerInquiries.push(testInquiry);
    inquiryResponses[testInquiry.id] = { mlos: [], realtors: [] };

    renderOpenCircle();

    // Show notification if user is logged in
    if (currentUser) {
        showNotification('🎯 New urgent inquiry just arrived in Open Circle!', 'success');
    }
}

function handleBuyerInquiry(e) {
    e.preventDefault();

    // Get form data
    const formData = {
        name: document.getElementById('buyerName').value.trim(),
        email: document.getElementById('buyerEmail').value.trim(),
        phone: document.getElementById('buyerPhone').value.trim(),
        location: document.getElementById('buyerLocation').value.trim(),
        budget: document.getElementById('buyerBudget').value,
        timeframe: document.getElementById('buyerTimeframe').value,
        message: document.getElementById('buyerMessage').value.trim()
    };

    // Get selected needs
    const needs = [];
    if (document.getElementById('needRealtor').checked) needs.push('realtor');
    if (document.getElementById('needMLO').checked) needs.push('mlo');
    if (document.getElementById('needBoth').checked) needs.push('both');

    // Validate
    if (!formData.name || !formData.email || !formData.location || !formData.budget || !formData.timeframe || needs.length === 0) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Create new inquiry
    const newInquiry = {
        id: buyerInquiries.length + 1,
        ...formData,
        needs: needs,
        timestamp: new Date(),
        urgent: formData.timeframe === 'immediately'
    };

    // Add to inquiries
    buyerInquiries.push(newInquiry);
    inquiryResponses[newInquiry.id] = { mlos: [], realtors: [] };

    // Reset form and close modal
    document.getElementById('buyerInquiryForm').reset();
    document.getElementById('buyerInquiryModal').style.display = 'none';

    // Update Open Circle if user is logged in and on that section
    if (currentUser) {
        renderOpenCircle();
    }

    showNotification('Your inquiry has been submitted! Professionals will be able to respond shortly.', 'success');
}

function renderOpenCircle() {
    const bubblesContainer = document.getElementById('floatingBubbles');
    if (!bubblesContainer) return;

    bubblesContainer.innerHTML = '';

    // Update stats
    document.getElementById('activeInquiries').textContent = buyerInquiries.length;
    const totalSlots = buyerInquiries.length * 4; // 2 MLOs + 2 Realtors per inquiry
    const usedSlots = Object.values(inquiryResponses).reduce((total, responses) =>
        total + responses.mlos.length + responses.realtors.length, 0);
    document.getElementById('availableSlots').textContent = totalSlots - usedSlots;

    // Create floating bubbles
    buyerInquiries.forEach((inquiry, index) => {
        const bubble = document.createElement('div');
        bubble.className = `inquiry-bubble ${inquiry.urgent ? 'urgent' : ''}`;
        bubble.dataset.inquiryId = inquiry.id;

        // Position bubble around the circle
        const angle = (index / buyerInquiries.length) * 2 * Math.PI;
        const radius = 180; // Distance from center
        const x = Math.cos(angle) * radius + 210; // 210 is half of circle width (420px)
        const y = Math.sin(angle) * radius + 210; // 210 is half of circle height (420px)

        bubble.style.left = x + 'px';
        bubble.style.top = y + 'px';
        bubble.style.animationDelay = (index * 0.5) + 's';

        // Bubble content
        const initials = inquiry.name.split(' ').map(n => n[0]).join('');
        bubble.innerHTML = `
            <div style="font-size: 0.8rem; line-height: 1.1;">
                <div style="font-size: 1rem; margin-bottom: 2px;">${initials}</div>
                <div style="font-size: 0.7rem;">${inquiry.budget}</div>
            </div>
        `;

        // Add click event
        bubble.addEventListener('click', () => showInquiryDetail(inquiry.id));

        bubblesContainer.appendChild(bubble);

        // Auto-dissolve after 24 hours (simulate with 30 seconds for demo)
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.classList.add('dissolving');
                setTimeout(() => {
                    if (bubble.parentNode) {
                        bubble.remove();
                        // Remove from inquiries array
                        const inquiryIndex = buyerInquiries.findIndex(inq => inq.id === inquiry.id);
                        if (inquiryIndex !== -1) {
                            buyerInquiries.splice(inquiryIndex, 1);
                            delete inquiryResponses[inquiry.id];
                            renderOpenCircle();
                        }
                    }
                }, 2000);
            }
        }, 30000); // 30 seconds for demo (would be 24 hours in production)
    });
}

function showInquiryDetail(inquiryId) {
    if (!currentUser) {
        showNotification('Please log in to view inquiry details', 'error');
        return;
    }

    const inquiry = buyerInquiries.find(inq => inq.id === inquiryId);
    if (!inquiry) return;

    const responses = inquiryResponses[inquiryId];
    const userRole = currentUser.role;

    // Check if user can respond
    const canRespond = (userRole === 'mlo' && responses.mlos.length < 2 && !responses.mlos.includes(currentUser.id)) ||
        (userRole === 'realtor' && responses.realtors.length < 2 && !responses.realtors.includes(currentUser.id));

    // Update modal content
    document.getElementById('inquiryDetails').innerHTML = `
        <div class="detail-row">
            <strong>Name:</strong>
            <span>${inquiry.name}</span>
        </div>
        <div class="detail-row">
            <strong>Location:</strong>
            <span>${inquiry.location}</span>
        </div>
        <div class="detail-row">
            <strong>Budget:</strong>
            <span>$${inquiry.budget.replace('k', ',000').replace('-', ' - $')}</span>
        </div>
        <div class="detail-row">
            <strong>Timeline:</strong>
            <span>${inquiry.timeframe.replace('-', ' to ')}</span>
        </div>
        <div class="detail-row">
            <strong>Needs Help With:</strong>
            <span>${inquiry.needs.map(need =>
        need === 'mlo' ? 'Mortgage Pre-approval' :
            need === 'realtor' ? 'Finding a Realtor' :
                'Both Realtor and MLO'
    ).join(', ')}</span>
        </div>
        <div class="detail-row">
            <strong>Message:</strong>
            <span>${inquiry.message}</span>
        </div>
        <div class="detail-row">
            <strong>Submitted:</strong>
            <span>${formatTimeAgo(inquiry.timestamp)}</span>
        </div>
    `;

    // Update status
    const mloSlots = responses.mlos.length;
    const realtorSlots = responses.realtors.length;
    const statusHtml = `
        <span class="status-badge ${mloSlots < 2 ? 'available' : 'full'}">
            MLO Slots: ${mloSlots}/2
        </span>
        <span class="status-badge ${realtorSlots < 2 ? 'available' : 'full'}">
            Realtor Slots: ${realtorSlots}/2
        </span>
    `;
    document.getElementById('inquiryStatus').innerHTML = statusHtml;

    // Update respond button
    const respondBtn = document.getElementById('respondToInquiry');
    respondBtn.dataset.inquiryId = inquiryId;
    respondBtn.disabled = !canRespond;
    respondBtn.textContent = canRespond ? 'Respond to Inquiry' :
        responses[userRole + 's'].includes(currentUser.id) ? 'Already Responded' : 'Slots Full';

    // Show modal
    document.getElementById('inquiryDetailModal').style.display = 'block';
}

function respondToInquiry() {
    const inquiryId = parseInt(document.getElementById('respondToInquiry').dataset.inquiryId);
    const inquiry = buyerInquiries.find(inq => inq.id === inquiryId);

    if (!inquiry || !currentUser) return;

    const responses = inquiryResponses[inquiryId];
    const userRole = currentUser.role;

    // Add user to responses
    if (userRole === 'mlo' && responses.mlos.length < 2) {
        responses.mlos.push(currentUser.id);
    } else if (userRole === 'realtor' && responses.realtors.length < 2) {
        responses.realtors.push(currentUser.id);
    }

    // Close modal
    document.getElementById('inquiryDetailModal').style.display = 'none';

    // Update display
    renderOpenCircle();

    // Automatically add as lead
    const newLead = {
        id: userLeads.length + 1,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        source: 'opencircle',
        status: 'new',
        budget: parseBudgetRange(inquiry.budget),
        originalBudgetRange: inquiry.budget, // Store original range for display
        location: inquiry.location,
        notes: `Inquiry from Open Circle: ${inquiry.message}`,
        dateAdded: new Date(),
        lastContact: new Date()
    };

    userLeads.push(newLead);
    updateLeadsStats();

    // Always refresh leads display when a new lead is added
    setTimeout(() => {
        renderLeads();
    }, 100); // Small delay to ensure DOM is ready

    // Create a simulated conversation with the buyer
    createInquiryConversation(inquiry);

    // Force refresh of leads display
    setTimeout(() => {
        if (document.getElementById('leadsSection')) {
            renderLeads();
            updateLeadsStats();
        }
    }, 200);

    // Force refresh of messages if user is on messages section
    setTimeout(() => {
        if (document.getElementById('messagesSection').classList.contains('active')) {
            loadConversations();
        }
    }, 300);

    showNotification(`You've successfully responded to ${inquiry.name}'s inquiry! Check your Messages tab to continue the conversation.`, 'success');
}

function parseBudgetRange(budgetString) {
    if (!budgetString) return 0;

    // Handle budget ranges like "400k-600k", "200k-400k", etc.
    if (budgetString.includes('-')) {
        // Take the lower end of the range for lead value
        const lowerEnd = budgetString.split('-')[0].trim();
        return parseBudgetValue(lowerEnd);
    }

    return parseBudgetValue(budgetString);
}

function parseBudgetValue(value) {
    if (!value) return 0;

    // Remove any non-numeric characters except 'k', 'm', and decimal points
    const cleanValue = value.toLowerCase().replace(/[^0-9km.]/g, '');

    if (cleanValue.includes('k')) {
        // Handle values like "400k"
        const number = parseFloat(cleanValue.replace('k', ''));
        return number * 1000;
    } else if (cleanValue.includes('m')) {
        // Handle values like "1.5m"
        const number = parseFloat(cleanValue.replace('m', ''));
        return number * 1000000;
    } else {
        // Handle plain numbers
        return parseInt(cleanValue) || 0;
    }
}

function formatBudgetDisplay(lead) {
    if (!lead.budget) return '-';

    // If the lead has an originalBudgetRange, show that instead
    if (lead.originalBudgetRange) {
        return lead.originalBudgetRange.replace('k', 'K').replace('-', ' - ');
    }

    // Otherwise format the numeric budget
    if (lead.budget >= 1000000) {
        return '$' + (lead.budget / 1000000).toFixed(1) + 'M';
    } else if (lead.budget >= 1000) {
        return '$' + (lead.budget / 1000) + 'K';
    } else {
        return '$' + lead.budget.toLocaleString();
    }
}

function createInquiryConversation(inquiry) {
    // Create a simulated user object for the buyer
    const buyerUser = {
        id: 1000 + inquiry.id, // Use high ID to avoid conflicts
        name: inquiry.name,
        email: inquiry.email,
        avatar: inquiry.name.split(' ').map(n => n[0]).join(''),
        role: 'buyer'
    };

    // Add buyer to sample users if not already there
    if (!sampleUsers.find(u => u.id === buyerUser.id)) {
        sampleUsers.push(buyerUser);
    }

    // Check if conversation already exists
    let conversation = conversations.find(conv =>
        (conv.user1Id === currentUser.id && conv.user2Id === buyerUser.id) ||
        (conv.user1Id === buyerUser.id && conv.user2Id === currentUser.id)
    );

    // Create new conversation if it doesn't exist
    if (!conversation) {
        conversation = {
            id: conversations.length + 1,
            user1Id: currentUser.id,
            user2Id: buyerUser.id,
            messages: [
                {
                    id: 1,
                    senderId: buyerUser.id,
                    content: `Hi! I submitted an inquiry through Close Circle. ${inquiry.message}`,
                    timestamp: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
                },
                {
                    id: 2,
                    senderId: currentUser.id,
                    content: `Hello ${inquiry.name}! Thank you for your inquiry. I'd be happy to help you with your ${currentUser.role === 'mlo' ? 'mortgage needs' : 'home search'}. Let's discuss your requirements in detail.`,
                    timestamp: new Date()
                }
            ],
            lastActivity: new Date()
        };
        conversations.push(conversation);

        // If user is on messages section, refresh immediately
        if (document.getElementById('messagesSection').classList.contains('active')) {
            setTimeout(() => {
                loadConversations();
                selectConversation(conversation.id);
            }, 100);
        }
    }

    // Note: Buyers from inquiries are NOT added to connections
    // Connections are for professional networking with other MLOs/Realtors only
}

// Leads Management System
function initializeSampleLeads() {
    if (!currentUser) return;

    // Add sample leads based on user role
    const sampleLeads = currentUser.role === 'mlo' ? [
        {
            id: 1,
            name: "Michael Johnson",
            email: "michael.j@email.com",
            phone: "(555) 234-5678",
            source: "opencircle",
            status: "qualified",
            budget: 450000,
            location: "Austin, TX",
            notes: "First-time homebuyer, excellent credit score. Looking for conventional loan.",
            dateAdded: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
            id: 2,
            name: "Emily Davis",
            email: "emily.davis@email.com",
            phone: "(555) 345-6789",
            source: "referral",
            status: "proposal",
            budget: 320000,
            location: "Dallas, TX",
            notes: "Self-employed, needs bank statement loan. Proposal sent yesterday.",
            dateAdded: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            lastContact: new Date(Date.now() - 2 * 60 * 60 * 1000)
        }
    ] : [
        {
            id: 1,
            name: "David Wilson",
            email: "david.w@email.com",
            phone: "(555) 456-7890",
            source: "website",
            status: "contacted",
            budget: 550000,
            location: "Houston, TX",
            notes: "Looking for 4BR home in good school district. Has pre-approval.",
            dateAdded: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            lastContact: new Date(Date.now() - 6 * 60 * 60 * 1000)
        },
        {
            id: 2,
            name: "Lisa Thompson",
            email: "lisa.t@email.com",
            phone: "(555) 567-8901",
            source: "opencircle",
            status: "negotiation",
            budget: 380000,
            location: "Austin, TX",
            notes: "Found perfect home, currently negotiating price. Very motivated buyer.",
            dateAdded: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            lastContact: new Date(Date.now() - 4 * 60 * 60 * 1000)
        }
    ];

    userLeads = [...sampleLeads];
    renderLeads();
    updateLeadsStats();
}

function handleAddLead(e) {
    e.preventDefault();

    if (!currentUser) {
        showNotification('Please log in to add leads', 'error');
        return;
    }

    // Get form data
    const formData = {
        name: document.getElementById('leadName').value.trim(),
        email: document.getElementById('leadEmail').value.trim(),
        phone: document.getElementById('leadPhone').value.trim(),
        source: document.getElementById('leadSource').value,
        budget: parseInt(document.getElementById('leadBudget').value) || 0,
        status: document.getElementById('leadStatus').value,
        location: document.getElementById('leadLocation').value.trim(),
        notes: document.getElementById('leadNotes').value.trim()
    };

    // Validate required fields
    if (!formData.name || !formData.email || !formData.source) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Create new lead
    const newLead = {
        id: userLeads.length + 1,
        ...formData,
        dateAdded: new Date(),
        lastContact: new Date()
    };

    // Add to leads array
    userLeads.push(newLead);

    // Reset form and close modal
    document.getElementById('addLeadForm').reset();
    document.getElementById('addLeadModal').style.display = 'none';

    // Update display
    renderLeads();
    updateLeadsStats();

    showNotification('Lead added successfully!', 'success');
}

function renderLeads() {
    const tableBody = document.getElementById('leadsTableBody');
    if (!tableBody) return;

    // Get filter values - ensure elements exist before accessing
    const statusFilterElement = document.getElementById('statusFilter');
    const sourceFilterElement = document.getElementById('sourceFilter');
    const searchElement = document.getElementById('searchLeads');

    const statusFilter = statusFilterElement ? statusFilterElement.value : 'all';
    const sourceFilter = sourceFilterElement ? sourceFilterElement.value : 'all';
    const searchTerm = searchElement ? searchElement.value.toLowerCase() : '';

    // Filter leads
    let filteredLeads = userLeads.filter(lead => {
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
        const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
        const matchesSearch = searchTerm === '' ||
            lead.name.toLowerCase().includes(searchTerm) ||
            lead.email.toLowerCase().includes(searchTerm) ||
            (lead.location && lead.location.toLowerCase().includes(searchTerm));

        return matchesStatus && matchesSource && matchesSearch;
    });

    if (filteredLeads.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                    No leads found. ${userLeads.length === 0 ? 'Add your first lead to get started!' : 'Try adjusting your filters.'}
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = filteredLeads.map(lead => `
        <tr>
            <td>
                <div style="font-weight: 600;">${lead.name}</div>
                <div style="font-size: 0.8rem; color: var(--text-secondary);">${lead.location || 'No location'}</div>
            </td>
            <td>
                <div>${lead.email}</div>
                <div style="font-size: 0.8rem; color: var(--text-secondary);">${lead.phone || 'No phone'}</div>
            </td>
            <td>
                <span class="status-badge ${lead.status}">${lead.status}</span>
            </td>
            <td style="text-transform: capitalize;">${lead.source}</td>
            <td>${formatBudgetDisplay(lead)}</td>
            <td>${formatTimeAgo(lead.lastContact)}</td>
            <td>
                <div class="lead-actions-cell">
                    <button class="action-btn view" onclick="viewLead(${lead.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="editLead(${lead.id})" title="Edit Lead">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteLead(${lead.id})" title="Delete Lead">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function updateLeadsStats() {
    if (!document.getElementById('totalLeads')) return;

    const total = userLeads.length;
    const active = userLeads.filter(lead => !['closed', 'lost'].includes(lead.status)).length;
    const closed = userLeads.filter(lead => lead.status === 'closed').length;
    const totalRevenue = userLeads
        .filter(lead => lead.status === 'closed')
        .reduce((sum, lead) => sum + (lead.budget * 0.03), 0); // Assume 3% commission

    document.getElementById('totalLeads').textContent = total;
    document.getElementById('activeLeads').textContent = active;
    document.getElementById('closedLeads').textContent = closed;
    document.getElementById('totalRevenue').textContent = '$' + Math.round(totalRevenue).toLocaleString();
}

function filterLeads() {
    renderLeads();
}

function viewLead(leadId) {
    const lead = userLeads.find(l => l.id === leadId);
    if (!lead) return;

    currentLeadId = leadId;

    // Populate lead detail modal
    document.getElementById('leadDetailName').textContent = lead.name;
    document.getElementById('leadDetailStatus').textContent = lead.status;
    document.getElementById('leadDetailStatus').className = `lead-status-badge status-badge ${lead.status}`;

    document.getElementById('leadDetailEmail').textContent = lead.email;
    document.getElementById('leadDetailPhone').textContent = lead.phone || 'Not provided';
    document.getElementById('leadDetailLocation').textContent = lead.location || 'Not specified';
    document.getElementById('leadDetailSource').textContent = lead.source.charAt(0).toUpperCase() + lead.source.slice(1);
    document.getElementById('leadDetailBudget').textContent = formatBudgetDisplay(lead) !== '-' ? formatBudgetDisplay(lead) : 'Not specified';
    document.getElementById('leadDetailAdded').textContent = formatTimeAgo(lead.dateAdded);
    document.getElementById('leadDetailNotes').textContent = lead.notes || 'No notes available';

    // Show modal
    document.getElementById('leadDetailModal').style.display = 'block';
}

function editLead(leadId) {
    // For now, just show a notification - full edit functionality can be added later
    showNotification('Edit functionality coming soon!', 'info');
}

function deleteLead(leadId) {
    if (confirm('Are you sure you want to delete this lead?')) {
        userLeads = userLeads.filter(lead => lead.id !== leadId);
        renderLeads();
        updateLeadsStats();
        showNotification('Lead deleted successfully', 'success');
    }
}

function contactLead() {
    if (!currentLeadId) return;

    const lead = userLeads.find(l => l.id === currentLeadId);
    if (!lead) return;

    // Create or find existing conversation with this lead
    const leadUserId = 2000 + lead.id; // Use high ID for lead users

    // Create simulated user for the lead if not exists
    let leadUser = sampleUsers.find(u => u.id === leadUserId);
    if (!leadUser) {
        leadUser = {
            id: leadUserId,
            name: lead.name,
            email: lead.email,
            avatar: lead.name.split(' ').map(n => n[0]).join(''),
            role: 'buyer'
        };
        sampleUsers.push(leadUser);
    }

    // Check if conversation already exists
    let conversation = conversations.find(conv =>
        (conv.user1Id === currentUser.id && conv.user2Id === leadUserId) ||
        (conv.user1Id === leadUserId && conv.user2Id === currentUser.id)
    );

    // Create conversation if it doesn't exist
    if (!conversation) {
        conversation = {
            id: conversations.length + 1,
            user1Id: currentUser.id,
            user2Id: leadUserId,
            messages: [],
            lastActivity: new Date()
        };
        conversations.push(conversation);
    }

    // Note: Leads are NOT added to connections
    // Connections are for professional networking with other MLOs/Realtors only

    // Close lead detail modal
    document.getElementById('leadDetailModal').style.display = 'none';

    // Switch to messages section and open conversation
    showSection('messages');
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector('[data-section="messages"]').classList.add('active');

    loadConversations();
    selectConversation(conversation.id);

    showNotification(`Started conversation with ${lead.name}`, 'success');
}
