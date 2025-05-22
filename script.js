// Sample data - in a real app, this would come from a database
const sampleHostels = [
    { id: 1, name: "North Hall", gender: "Male", pwdAccess: true, capacity: 200, occupied: 150 },
    { id: 2, name: "South Hall", gender: "Female", pwdAccess: true, capacity: 250, occupied: 200 },
    { id: 3, name: "East Hall", gender: "Male", pwdAccess: false, capacity: 150, occupied: 120 },
    { id: 4, name: "West Hall", gender: "Female", pwdAccess: false, capacity: 180, occupied: 160 }
];

const sampleStudents = [
    { id: "2023/001", name: "Ayikobua Gilbert", gender: "Male", isPWD: false, program: "Computer Science", year: 2 },
    { id: "2023/002", name: "Rachel Rubangakene", gender: "Female", isPWD: true, program: "Education", year: 2 }
];

const sampleAllocations = [];
const samplePayments = [];

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const adminBtn = document.getElementById('adminBtn');
const loginModal = document.getElementById('loginModal');
const closeBtn = document.querySelector('.close');
const loginForm = document.getElementById('loginForm');
const mainContent = document.getElementById('mainContent');

// Modal Control
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
    document.getElementById('loginForm').dataset.userType = 'student';
});

adminBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
    document.getElementById('loginForm').dataset.userType = 'admin';
});

closeBtn.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

// Login Handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userType = e.target.dataset.userType;
    
    // Simple validation - in real app, verify against database
    if (username && password) {
        loginModal.style.display = 'none';
        
        if (userType === 'student') {
            loadStudentDashboard();
        } else {
            loadAdminDashboard();
        }
    } else {
        alert('Please enter both username and password');
    }
});

// Student Dashboard
function loadStudentDashboard() {
    const student = sampleStudents.find(s => s.id === document.getElementById('username').value) || sampleStudents[0];
    
    mainContent.innerHTML = `
        <div class="student-dashboard">
            <h2>Welcome, ${student.name}</h2>
            <div class="student-info">
                <p><strong>Registration No:</strong> ${student.id}</p>
                <p><strong>Program:</strong> ${student.program}</p>
                <p><strong>Year:</strong> ${student.year}</p>
                <p><strong>Gender:</strong> ${student.gender}</p>
                ${student.isPWD ? '<p><strong>Special Needs:</strong> Yes</p>' : ''}
            </div>
            
            <div class="tabs">
                <button class="tab-btn active" data-tab="apply">Apply for Hostel</button>
                <button class="tab-btn" data-tab="status">Allocation Status</button>
                <button class="tab-btn" data-tab="payment">Payment History</button>
            </div>
            
            <div class="tab-content" id="applyTab">
                <h3>Hostel Application</h3>
                <form id="hostelApplication">
                    <div class="form-group">
                        <label for="hostelSelect">Preferred Hostel:</label>
                        <select id="hostelSelect" required>
                            <option value="">-- Select Hostel --</option>
                            ${sampleHostels
                                .filter(h => h.gender === student.gender)
                                .map(h => `<option value="${h.id}">${h.name} (${h.capacity - h.occupied} beds left)</option>`)
                                .join('')}
                        </select>
                    </div>
                    
                    ${student.isPWD ? `
                    <div class="form-group">
                        <label for="pwdNeeds">Special Needs Requirements:</label>
                        <textarea id="pwdNeeds" rows="3"></textarea>
                    </div>
                    ` : ''}
                    
                    <div class="form-group">
                        <button type="submit">Submit Application</button>
                    </div>
                </form>
            </div>
            
            <div class="tab-content hidden" id="statusTab">
                <h3>Allocation Status</h3>
                <div id="allocationStatus">
                    <p>You have not been allocated a hostel yet.</p>
                </div>
            </div>
            
            <div class="tab-content hidden" id="paymentTab">
                <h3>Payment History</h3>
                <div id="paymentHistory">
                    <p>No payment records found.</p>
                </div>
            </div>
        </div>
    `;
    
    // Set up tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
            
            btn.classList.add('active');
            document.getElementById(`${btn.dataset.tab}Tab`).classList.remove('hidden');
        });
    });
    
    // Handle application submission
    document.getElementById('hostelApplication')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const hostelId = document.getElementById('hostelSelect').value;
        const pwdNeeds = student.isPWD ? document.getElementById('pwdNeeds').value : null;
        
        // In a real app, this would be an API call
        const allocation = {
            studentId: student.id,
            hostelId: parseInt(hostelId),
            date: new Date().toISOString(),
            status: 'Pending',
            pwdNeeds
        };
        
        sampleAllocations.push(allocation);
        alert('Application submitted successfully!');
    });
}

// Admin Dashboard
function loadAdminDashboard() {
    mainContent.innerHTML = `
        <div class="dashboard">
            <div class="sidebar">
                <nav>
                    <ul>
                        <li><a href="#" class="active" data-section="rooms">Room Management</a></li>
                        <li><a href="#" data-section="allocations">Allocation System</a></li>
                        <li><a href="#" data-section="reports">Reports</a></li>
                    </ul>
                </nav>
            </div>
            
            <div class="content-area">
                <h2>Admin Dashboard</h2>
                
                <div id="roomsSection">
                    <h3>Room Inventory</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Hostel</th>
                                <th>Gender</th>
                                <th>PWD Access</th>
                                <th>Capacity</th>
                                <th>Occupied</th>
                                <th>Available</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sampleHostels.map(hostel => `
                                <tr>
                                    <td>${hostel.name}</td>
                                    <td>${hostel.gender}</td>
                                    <td>${hostel.pwdAccess ? 'Yes' : 'No'}</td>
                                    <td>${hostel.capacity}</td>
                                    <td>${hostel.occupied}</td>
                                    <td>${hostel.capacity - hostel.occupied}</td>
                                    <td>
                                        <button class="edit-btn" data-id="${hostel.id}">Edit</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <button id="addHostelBtn">Add New Hostel</button>
                </div>
                
                <div id="allocationsSection" class="hidden">
                    <h3>Allocation System</h3>
                    <div class="filters">
                        <select id="filterGender">
                            <option value="">All Genders</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        
                        <select id="filterYear">
                            <option value="">All Years</option>
                            <option value="1">First Year</option>
                            <option value="2">Second Year</option>
                            <option value="3">Third Year</option>
                            <option value="4">Final Year</option>
                        </select>
                        
                        <select id="filterPWD">
                            <option value="">All Students</option>
                            <option value="true">PWD Only</option>
                        </select>
                        
                        <button id="autoAllocateBtn">Auto Allocate</button>
                    </div>
                    
                    <div id="applicationsList">
                        <h4>Pending Applications</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Name</th>
                                    <th>Gender</th>
                                    <th>Year</th>
                                    <th>PWD</th>
                                    <th>Preferred Hostel</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Would be populated from database -->
                                <tr>
                                    <td colspan="7">No pending applications</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div id="reportsSection" class="hidden">
                    <h3>Reports</h3>
                    <div class="report-options">
                        <button id="occupancyReportBtn">Occupancy Report</button>
                        <button id="pendingReportBtn">Pending Requests Report</button>
                        <button id="pwdReportBtn">PWD Allocation Report</button>
                    </div>
                    
                    <div id="reportOutput">
                        <p>Select a report to generate.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Set up admin navigation
    document.querySelectorAll('.sidebar nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.sidebar nav a').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.content-area > div').forEach(div => div.classList.add('hidden'));
            
            link.classList.add('active');
            document.getElementById(`${link.dataset.section}Section`).classList.remove('hidden');
        });
    });
    
    // Auto allocation logic
    document.getElementById('autoAllocateBtn')?.addEventListener('click', () => {
        // In a real app, this would:
        // 1. Filter applications based on selected filters
        // 2. Prioritize PWD and final year students
        // 3. Allocate based on availability
        // 4. Update database
        
        alert('Auto allocation completed based on selected filters!');
    });
    
    // Report generation
    document.getElementById('occupancyReportBtn')?.addEventListener('click', () => {
        document.getElementById('reportOutput').innerHTML = `
            <h4>Hostel Occupancy Report</h4>
            <table>
                <thead>
                    <tr>
                        <th>Hostel</th>
                        <th>Capacity</th>
                        <th>Occupied</th>
                        <th>Available</th>
                        <th>Occupancy Rate</th>
                    </tr>
                </thead>
                <tbody>
                    ${sampleHostels.map(hostel => `
                        <tr>
                            <td>${hostel.name}</td>
                            <td>${hostel.capacity}</td>
                            <td>${hostel.occupied}</td>
                            <td>${hostel.capacity - hostel.occupied}</td>
                            <td>${Math.round((hostel.occupied / hostel.capacity) * 100)}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    });
}

// Initialize with public view
mainContent.innerHTML = `
    <div class="welcome-message">
        <h2>Welcome to Kyambogo University Hostel Allocation System</h2>
        <p>Please login to access the hostel application portal or admin dashboard.</p>
        
        <div class="features">
            <div class="feature-card">
                <h3>For Students</h3>
                <ul>
                    <li>Easy hostel application</li>
                    <li>Track allocation status</li>
                    <li>View payment history</li>
                    <li>PWD-friendly interface</li>
                </ul>
            </div>
            
            <div class="feature-card">
                <h3>For Administrators</h3>
                <ul>
                    <li>Manage room inventory</li>
                    <li>Automated allocation system</li>
                    <li>Comprehensive reports</li>
                    <li>Priority for PWDs</li>
                </ul>
            </div>
        </div>
    </div>
`;
