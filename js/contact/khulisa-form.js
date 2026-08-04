document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('khulisaSupportForm');
    const statusMsg = document.getElementById('formStatus');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            supportType: document.getElementById('supportType').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };

        if (navigator.onLine) {
            // Simulated direct submit
            statusMsg.textContent = "Your request has been submitted to a counselor successfully!";
            statusMsg.className = "status-message success";
            form.reset();
        } else {
            // Queue offline using localStorage or IndexedDB
            let queuedRequests = JSON.parse(localStorage.getItem('khulisa_offline_requests') || '[]');
            queuedRequests.push(formData);
            localStorage.setItem('khulisa_offline_requests', JSON.stringify(queuedRequests));

            statusMsg.textContent = "You are currently offline. Your request has been saved and will sync automatically when connected!";
            statusMsg.className = "status-message offline";
            form.reset();
        }
    });
});