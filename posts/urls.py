from django.urls import path
from .views import create_posts_view,post_data_view_list,like_unlike_post,post_detail,post_detail_data_view,delete_post,update_post
urlpatterns =[
  path('',create_posts_view,name='create_post'),
  path('posts/<int:num_post_view>/',post_data_view_list.as_view(),name='posts_list_view'),
  path('like-unlike/',like_unlike_post,name="like-unlike"),
  path('<pk>/',post_detail,name="post_detail"),
  path('<pk>/data/',post_detail_data_view,name="post_detail_data"),
  path('<pk>/update/',update_post,name="post_update"),
  path('<pk>/delete/',delete_post,name="post_delete"),
]