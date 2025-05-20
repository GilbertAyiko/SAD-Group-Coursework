document.addEventListener('DOMContentLoaded', function() {
    // Get student data from session (in real app, this would come from backend)
    const studentData = {
        name: "Ayikobua Gilbert",
        regNumber: "reg2023",
        gender: "",
        isPWD: false,
        pwdNeeds: "",
        application: null,
        payments: []
    };

    // Set student name
    document.getElementById('studentName').textContent = studentData.name;

    // Tab navigation
    const tabs = document.querySelectorAll('.student-nav li');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}Tab`).classList.add('active');
        });
    });

    // PWD status toggle
    const pwdStatus = document.getElementById('pwdStatus');
    const pwdNeedsGroup = document.getElementById('pwdNeedsGroup');
    
    pwdStatus.addEventListener('change', function() {
        studentData.isPWD = this.value === 'yes';
        pwdNeedsGroup.classList.toggle('hidden', !studentData.isPWD);
    });

    // Gender selection updates hostel options
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    const hostelSelect = document.getElementById('hostelSelect');
    
    genderRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                studentData.gender = this.value;
                updateHostelOptions(this.value);
            }
        });
    });

    function updateHostelOptions(gender) {
        // In real app, this would fetch from API
        const hostels = {
            Male: ["North Hall", "East Hall", "University Hall"],
            Female: ["South Hall", "West Hall", "Mary Stuart Hall"]
        };
        
        hostelSelect.innerHTML = '';
        hostelSelect.disabled = false;
        
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- Select Hostel --';
        hostelSelect.appendChild(defaultOption);
        
        hostels[gender].forEach(hostel => {
            const option = document.createElement('option');
            option.value = hostel;
            option.textContent = hostel;
            hostelSelect.appendChild(option);
        });
    }

    // Form submission
    const applicationForm = document.getElementById('hostelApplication');
    
    applicationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        studentData.application = {
            date: new Date().toLocaleDateString(),
            hostel: hostelSelect.value,
            roomPref: document.getElementById('roomPref').value,
            status: 'Pending'
        };
        
        if (studentData.isPWD) {
            studentData.pwdNeeds = document.getElementById('pwdNeeds').value;
            studentData.application.pwdNeeds = studentData.pwdNeeds;
        }
        
        updateStatusTab();
        alert('Application submitted successfully!');
        
        // Switch to status tab
        tabs[1].click();
    });

    // Update status tab
    function updateStatusTab() {
        if (studentData.application) {
            const statusHeader = document.querySelector('#statusTab .status-header');
            const statusDetails = document.querySelector('#statusTab .status-details');
            
            statusHeader.innerHTML = `
                <h3>${studentData.application.hostel}</h3>
                <span class="status-badge ${studentData.application.status.toLowerCase()}">${studentData.application.status}</span>
            `;
            
            statusDetails.innerHTML = `
                <p>Room Preference: ${studentData.application.roomPref}</p>
                <p>Submitted on: ${studentData.application.date}</p>
                ${studentData.isPWD ? `<p>Special Needs: ${studentData.pwdNeeds}</p>` : ''}
            `;
        }
    }

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = 'index.html';
        }
    });

    // Initialize
    updateStatusTab();
});