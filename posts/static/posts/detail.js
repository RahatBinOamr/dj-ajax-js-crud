const backBtn = document.getElementById('back-btn');

const url = window.location.href + 'data/';
const updateUrl = window.location.href + 'update/';
const deleteUrl = window.location.href + 'delete/';

const spinnerBox = document.getElementById('spinner-box');
const deleteBtn = document.getElementById('delete-btn');
const updateBtn = document.getElementById('update-btn');

const titleInput = document.getElementById('id_title');
const bodyInput = document.getElementById('id_body');

const updateForm = document.getElementById('update-form');
const deleteForm = document.getElementById('delete-form');

const alertBox = document.getElementById('alert-box');

const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;

backBtn.addEventListener('click', () => {
  history.back();
  spinnerBox.classList.remove('not-visible');
});

$.ajax({
  type: 'GET',
  url: url,
  success: function (response) {
    console.log(response);
    spinnerBox.classList.add('not-visible');
    const data = response.data;
    if (data.logged_in !== data.author) {
      console.log('differently logged in');
    } else {
      console.log('same logged in');
      deleteBtn.classList.remove('not-visible');
      updateBtn.classList.remove('not-visible');
    }

    titleInput.value = data.title;
    bodyInput.value = data.body;
  },
  error: function (error) {
    console.log(error);
  },
});

updateForm.addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('title');
  const body = document.getElementById('body');

  console.log(title, body);

  $.ajax({
    type: 'POST',
    url: updateUrl,
    data: {
      csrfmiddlewaretoken: csrf,
      title: titleInput.value,
      body: bodyInput.value,
    },
    success: function (response) {
      console.log(response);
      handleAlert('success', 'post update successful');
      title.textContent = response.title;
      body.textContent = response.body;

      // $('#updatePostModel').modal('hide');
    },
    error: function (error) {
      console.log(error);
    },
  });
});

const deleted = localStorage.getItem('title');
console.log(deleted);
if (deleted) {
  handleAlert('danger', `post ${deleted} successful`);
  localStorage.clear();
}

deleteForm.addEventListener('submit', () => {
  $.ajax({
    type: 'POST',
    url: deleteUrl,
    data: {
      csrfmiddlewaretoken: csrf,
    },
    success: function (response) {
      window.location.href = window.location.origin;
      localStorage.setItem('title', titleInput.value);
    },
    error: function (error) {
      console.log(error);
    },
  });
});
