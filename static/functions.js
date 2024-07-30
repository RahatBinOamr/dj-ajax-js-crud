const handleAlert = (type, message) => {
  alertBox.innerHTML = `
    <div class="alert alert-${type}" role="alert">
      ${message}
    </div>
  `;

  // Remove the alert after 2 second
  setTimeout(() => {
    alertBox.innerHTML = '';
  }, 2000);
};
