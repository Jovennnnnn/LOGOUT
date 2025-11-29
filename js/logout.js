// js/logout.js - Custom logout modal with beautiful styling

// Create custom logout modal on page load
function createLogoutModal() {
  // Check if modal already exists
  if (document.getElementById('logoutModalOverlay')) return;

  var host = window.location.hostname || 'this site';
  var overlay = document.createElement('div');
  overlay.id = 'logoutModalOverlay';
  overlay.className = 'logout-modal-overlay';
  overlay.innerHTML = `
    <div class="logout-modal-dialog">
      <div class="logout-modal-header">
        <i class="fa-solid fa-right-from-bracket"></i>
        <span>Confirm Logout</span>
      </div>
      <div class="logout-modal-body">
        <p class="logout-modal-message">Are you sure you want to logout?</p>
        <p class="logout-modal-hostname">from <strong>` + host + `</strong></p>
      </div>
      <div class="logout-modal-footer">
        <button class="logout-btn-cancel" id="logoutBtnCancel">Cancel</button>
        <button class="logout-btn-confirm" id="logoutBtnConfirm">
          <i class="fa-solid fa-check me-2"></i>Logout
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Handle cancel
  document.getElementById('logoutBtnCancel').addEventListener('click', function () {
    overlay.classList.remove('active');
  });

  // Handle confirm
  document.getElementById('logoutBtnConfirm').addEventListener('click', function () {
    performLogout();
  });

  // Close on overlay click
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      overlay.classList.remove('active');
    }
  });

  // Close on ESC key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      overlay.classList.remove('active');
    }
  });
}

// Perform logout request
function performLogout() {
  var confirmBtn = document.getElementById('logoutBtnConfirm');
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Logging out...';
  }

  fetch('api/logout.php', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json'
    }
  })
    .then(function (resp) { return resp.json(); })
    .then(function (data) {
      if (data && data.success) {
        // Redirect to landing/login
        window.location.href = 'index.php';
      } else {
        alert('Logout failed: ' + (data.message || 'unknown error'));
        if (confirmBtn) {
          confirmBtn.disabled = false;
          confirmBtn.innerHTML = '<i class="fa-solid fa-check me-2"></i>Logout';
        }
      }
    })
    .catch(function (err) {
      alert('Logout error: ' + err);
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<i class="fa-solid fa-check me-2"></i>Logout';
      }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
  // Create the modal
  createLogoutModal();

  // Attach logout action to any element with the .js-logout-action class
  var els = document.querySelectorAll('.js-logout-action');
  if (!els || els.length === 0) return;

  els.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      // Show the custom modal instead of window.confirm
      var overlay = document.getElementById('logoutModalOverlay');
      if (overlay) {
        overlay.classList.add('active');
      }
    });
  });
});
