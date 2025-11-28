// js/logout.js
document.addEventListener('DOMContentLoaded', function () {
  // Attach logout action to any element with the .js-logout-action class
  var els = document.querySelectorAll('.js-logout-action');
  if (!els || els.length === 0) return;

  els.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var host = window.location.hostname || 'this site';
      var confirmed = window.confirm('Are you sure you want to logout?');
      if (!confirmed) return;

      fetch('logout-action.php', {
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
          }
        })
        .catch(function (err) {
          alert('Logout error: ' + err);
        });
    });
  });
});
