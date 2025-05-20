document.addEventListener('DOMContentLoaded', function() {
    // Sample data - in real app, this would come from API
    const hostels = [
        { id: 1, name: "North Hall", gender: "Male", pwdAccess: true, capacity: 200, occupied: 150 },
        { id: 2, name: "South Hall", gender: "Female", pwdAccess: true, capacity: 250, occupied: 200 },
        { id: 3, name: "East Hall", gender: "Male", pwdAccess: false, capacity: 150, occupied: 120 },
        { id: 4, name: "West Hall", gender: "Female", pwdAccess: false, capacity: 180, occupied: 160 }
    ];

    const applications = [
        { id: 1, studentId: "2023/001", name: "Ayikobua Gilbert", gender: "Male", year: 3, isPWD: false, hostelPref: "Bavana", status: "Pending" },
        { id: 2, studentId: "2023/002", name: "Mpumwire Geoffrey", gender: "Male", year: 2, isPWD: true, hostelPref: "Good Sheperd", status: "Pending" },
        { id: 3, studentId: "2023/003", name: "Maliamungu Ronald", gender: "Male", year: 1, isPWD: false, hostelPref: "Sports Pro", status: "Pending" },
        { id: 4, studentId: "2023/004", name: "Rachel Rubangakene", gender: "Female", year: 2, isPWD: false, hostelPref: "Madonna", status: "Pending" }
    ];

    // DOM Elements
    const tabs = document.querySelectorAll('.admin-nav li');
    const tabContents = document.querySelectorAll('.tab-content');
    const logoutBtn = document.getElementById('logoutBtn');
    const addHostelBtn = document.getElementById('addHostelBtn');
    const hostelModal = document.getElementById('hostelModal');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const hostelForm = document.getElementById('hostelForm');
    const hostelTableBody = document.getElementById('hostelTableBody');
    const applicationsTableBody = document.getElementById('applicationsTableBody');
    const reportDisplay = document.getElementById('reportDisplay');

    // Tab navigation
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}Tab`).classList.add('active');
            
            // Load data when tab is clicked
            if (tab.dataset.tab === 'roomManagement') {
                loadHostels();
            } else if (tab.dataset.tab === 'allocationSystem') {
                loadApplications();
            }
        });
    });

    // Load hostels data
    function loadHostels(filter = 'all') {
        hostelTableBody.innerHTML = '';
        
        let filteredHostels = hostels;
        
        if (filter === 'male') {
            filteredHostels = hostels.filter(h => h.gender === 'Male');
        } else if (filter === 'female') {
            filteredHostels = hostels.filter(h => h.gender === 'Female');
        } else if (filter === 'pwd') {
            filteredHostels = hostels.filter(h => h.pwdAccess);
        }
        
        filteredHostels.forEach(hostel => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${hostel.name}</td>
                <td>${hostel.gender}</td>
                <td>${hostel.pwdAccess ? 'Yes' : 'No'}</td>
                <td>${hostel.capacity}</td>
                <td>${hostel.occupied}</td>
                <td>${hostel.capacity - hostel.occupied}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${hostel.id}">Edit</button>
                    <button class="action-btn delete-btn" data-id="${hostel.id}">Delete</button>
                </td>
            `;
            
            hostelTableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editHostel(btn.dataset.id));
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteHostel(btn.dataset.id));
        });
    }

    // Load applications data
    function loadApplications(gender = 'all', year = 'all', pwd = 'all') {
        applicationsTableBody.innerHTML = '';
        
        let filteredApplications = applications;
        
        if (gender !== 'all') {
            filteredApplications = filteredApplications.filter(a => a.gender === gender);
        }
        
        if (year !== 'all') {
            filteredApplications = filteredApplications.filter(a => a.year.toString() === year);
        }
        
        if (pwd !== 'all') {
            filteredApplications = filteredApplications.filter(a => a.isPWD.toString() === pwd);
        }
        
        filteredApplications.forEach(app => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${app.studentId}</td>
                <td>${app.name}</td>
                <td>${app.gender}</td>
                <td>${app.year}</td>
                <td>${app.isPWD ? 'Yes' : 'No'}</td>
                <td>${app.hostelPref}</td>
                <td><span class="status-badge">${app.status}</span></td>
                <td>
                    <button class="action-btn" data-id="${app.id}">Allocate</button>
                </td>
            `;
            
            applicationsTableBody.appendChild(row);
        });
    }

    // Hostel modal control
    addHostelBtn.addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'Add New Hostel';
        hostelForm.reset();
        document.getElementById('hostelId').value = '';
        hostelModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        hostelModal.style.display = 'none';
    });

    cancelBtn.addEventListener('click', () => {
        hostelModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === hostelModal) {
            hostelModal.style.display = 'none';
        }
    });

    // Edit hostel
    function editHostel(id) {
        const hostel = hostels.find(h => h.id === parseInt(id));
        
        if (hostel) {
            document.getElementById('modalTitle').textContent = 'Edit Hostel';
            document.getElementById('hostelId').value = hostel.id;
            document.getElementById('hostelName').value = hostel.name;
            document.querySelector(`input[name="hostelGender"][value="${hostel.gender}"]`).checked = true;
            document.getElementById('hostelCapacity').value = hostel.capacity;
            document.getElementById('hostelPWD').value = hostel.pwdAccess ? 'yes' : 'no';
            
            hostelModal.style.display = 'block';
        }
    }

    // Delete hostel
    function deleteHostel(id) {
        if (confirm('Are you sure you want to delete this hostel?')) {
            const index = hostels.findIndex(h => h.id === parseInt(id));
            if (index !== -1) {
                hostels.splice(index, 1);
                loadHostels();
            }
        }
    }

    // Save hostel (add/edit)
    hostelForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = document.getElementById('hostelId').value;
        const name = document.getElementById('hostelName').value;
        const gender = document.querySelector('input[name="hostelGender"]:checked').value;
        const capacity = parseInt(document.getElementById('hostelCapacity').value);
        const pwdAccess = document.getElementById('hostelPWD').value === 'yes';
        
        if (id) {
            // Edit existing
            const index = hostels.findIndex(h => h.id === parseInt(id));
            if (index !== -1) {
                hostels[index] = { ...hostels[index], name, gender, capacity, pwdAccess };
            }
        } else {
            // Add new
            const newId = hostels.length > 0 ? Math.max(...hostels.map(h => h.id)) + 1 : 1;
            hostels.push({
                id: newId,
                name,
                gender,
                pwdAccess,
                capacity,
                occupied: 0
            });
        }
        
        loadHostels();
        hostelModal.style.display = 'none';
    });

    // Filter applications
    document.getElementById('applyFiltersBtn').addEventListener('click', () => {
        const gender = document.getElementById('filterGender').value;
        const year = document.getElementById('filterYear').value;
        const pwd = document.getElementById('filterPWD').value;
        
        loadApplications(gender, year, pwd);
    });

    // Auto allocate
    document.getElementById('autoAllocateBtn').addEventListener('click', () => {
        // In real app, this would:
        // 1. Prioritize PWD and final year students
        // 2. Match with appropriate hostels
        // 3. Update database
        
        alert('Auto allocation completed based on current filters!');
    });

    // Reports
    document.getElementById('occupancyReportBtn').addEventListener('click', () => {
        reportDisplay.innerHTML = `
            <h3>Hostel Occupancy Report</h3>
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
                    ${hostels.map(hostel => `
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

    document.getElementById('pendingReportBtn').addEventListener('click', () => {
        const pendingCount = applications.filter(a => a.status === 'Pending').length;
        
        reportDisplay.innerHTML = `
            <h3>Pending Applications Report</h3>
            <p>Total pending applications: <strong>${pendingCount}</strong></p>
            <div class="chart-placeholder" style="height: 300px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; margin-top: 20px;">
                [Chart visualization would appear here]
            </div>
        `;
    });

    document.getElementById('pwdReportBtn').addEventListener('click', () => {
        const pwdApps = applications.filter(a => a.isPWD);
        const allocatedPWD = pwdApps.filter(a => a.status === 'Approved').length;
        
        reportDisplay.innerHTML = `
            <h3>PWD Allocations Report</h3>
            <p>Total PWD applications: <strong>${pwdApps.length}</strong></p>
            <p>PWD students allocated: <strong>${allocatedPWD}</strong></p>
            <p>PWD students pending: <strong>${pwdApps.length - allocatedPWD}</strong></p>
        `;
    });

    document.getElementById('exportReportBtn').addEventListener('click', () => {
        alert('Report exported to Excel (simulated)');
    });

    // Hostel search and filter
    document.getElementById('hostelSearch').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = hostelTableBody.querySelectorAll('tr');
        
        rows.forEach(row => {
            const name = row.cells[0].textContent.toLowerCase();
            row.style.display = name.includes(searchTerm) ? '' : 'none';
        });
    });

    document.getElementById('hostelFilter').addEventListener('change', (e) => {
        loadHostels(e.target.value);
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = 'index.html';
        }
    });

    // Initialize
    loadHostels();
});