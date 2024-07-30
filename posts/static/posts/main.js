const postsBox = document.getElementById('posts-box');
const spinnerBox = document.getElementById('spinner-box');
const loadBtn = document.getElementById('load-more-btn');
const loadingBox = document.getElementById('load-more-box');

const postForm = document.getElementById('post-form');
const title = document.getElementById('id_title');
const body = document.getElementById('id_body');
const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
const alertBox = document.getElementById('alert-box');

const url = window.location.href;
console.log(url);

let visible = 6;

const getCookie = name => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};
const csrftoken = getCookie('csrftoken');

const handleLikeUnlikeFormHandel = () => {
  const likeUnlikeForm = [
    ...document.getElementsByClassName('like-unlike-form'),
  ];
  likeUnlikeForm.forEach(form =>
    form.addEventListener('submit', e => {
      e.preventDefault();
      const clickedId = e.target.getAttribute('data-form-id');
      const clickBtn = document.getElementById(`like-unlike-${clickedId}`);
      $.ajax({
        type: 'POST',
        url: '/like-unlike/',
        data: {
          csrfmiddlewaretoken: csrftoken,
          pk: clickedId,
        },
        success: function (response) {
          clickBtn.textContent = response.liked
            ? `unLike (${response.like_count})`
            : `Like (${response.like_count})`;
        },
        error: function (error) {
          console.log(error);
        },
      });
    })
  );
};

const handlePostData = () => {
  $.ajax({
    type: 'GET',
    url: `/posts/${visible}/`,
    success: function (response) {
      const data = response.data;
      const maxSize = response.max;
      spinnerBox.classList.remove('not-visible');
      setTimeout(() => {
        spinnerBox.classList.add('not-visible');
        data.forEach(el => {
          postsBox.innerHTML += `
          <div class="col">
              <div class="card h-100">
                <div class="card-body">
                  <h5 class="card-title">${el.title}</h5>
                  <p class="card-text">${el.body} </p>
                </div>
              <div class="card-footer ">
                  <a href="${url}${
            el.id
          }"><button class="btn btn-primary w-100">Details</button></a>
                  <form class="like-unlike-form" data-form-id =${el.id}>
                  <a href=""><button  class="btn btn-primary w-100 mt-2" id ="like-unlike-${
                    el.id
                  }"> ${
            el.liked ? `unLike (${el.like_count})` : `Like (${el.like_count})`
          } </button></a>
                  </form>
                </div>
              </div>
          </div>
          `;
        });
        handleLikeUnlikeFormHandel();
      }, 100);
      if (maxSize === 0) {
        loadingBox.innerHTML = '<h3> no post available </h3> ';
      } else if (maxSize) {
        loadingBox.innerHTML = '<h3> no more posts </h3> ';
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
};

loadBtn.addEventListener('click', () => {
  visible += 6;
  handlePostData();
});

postForm.addEventListener('submit', e => {
  e.preventDefault();
  $.ajax({
    type: 'POST',
    url: '',
    data: {
      csrfmiddlewaretoken: csrf,
      title: title.value,
      body: body.value,
    },
    success: function (response) {
      postsBox.insertAdjacentHTML(
        'afterbegin',
        `
        <div class="col">
              <div class="card h-100">
                <div class="card-body">
                  <h5 class="card-title">${response.title}</h5>
                  <p class="card-text">${response.body}</p>
                </div>
              <div class="card-footer">
                  <a href=""><button class="btn btn-primary w-100">Details</button></a>
                  <form class="like-unlike-form" data-form-id=${response.id}>
                  <a href=""><button class="btn btn-primary w-100 mt-2" id="like-unlike-${response.id}">Like(0)</button></a>
                  </form>
                </div>
              </div>
          </div>
        `
      );
      handleLikeUnlikeFormHandel();
      $('#addPostModel').modal('hide');
      handleAlert('success', 'new post created successfully');
      postForm.reset();
    },
    error: function (error) {
      handleAlert('danger', 'ups...something went wrong');
      handleLikeUnlikeFormHandel();
      $('#addPostModel').modal('hide');
    },
  });
});

handlePostData();
