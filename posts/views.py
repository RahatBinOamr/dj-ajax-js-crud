from django.shortcuts import render
from .models import Post
from django.http import JsonResponse
from django.views.generic import View
from  .forms import PostForm
from profiles.models import Profile
# Create your views here.

def create_posts_view(request, *args, **kwargs):
  posts = Post.objects.all()
  form = PostForm(request.POST,None)
  if request.headers.get('x-requested-with') == 'XMLHttpRequest':
    if form.is_valid():
      author = Profile.objects.get(user=request.user)
      instance = form.save(commit=False)
      instance.author = author
      instance.save()
      return JsonResponse({
        'title': instance.title,
        'body': instance.body,
        'author': instance.author.user.username,
        'id': instance.pk,
      })
  context = {'posts': posts, 'form':form}
  return render(request, 'posts.html',context)


class post_data_view_list(View):
  def get(self, request, *args, **kwargs):
    upper = kwargs.get('num_post_view')
    lower = upper - 6
    posts = Post.objects.all()
    data =[]
    for post in posts:
      item={
        'id': post.pk,
        'title': post.title,
        'body': post.body,
        'author': post.author.user.username,
        'liked': True if request.user in post.liked.all() else False,
        'like_count': post.like_count,
      }
      data.append(item)
    post_size = len(posts)
    max_size = True if upper >= post_size else False 
    return JsonResponse({'data': data[lower:upper],'max':max_size},safe=False)


def like_unlike_post(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        pk = request.POST.get('pk')
        obj = Post.objects.get(pk=pk)

        if request.user in obj.liked.all():
            liked = False
            obj.liked.remove(request.user)
        else:
            liked = True
            obj.liked.add(request.user)

        return JsonResponse({'liked': liked, 'like_count': obj.like_count}, safe=False)
  
def post_detail(request, pk):
    form = PostForm()  
    post = Post.objects.get(pk=pk)
    context = {
        'form': form,
        'post': post,
    }
    return render(request, 'detail.html', context)


def post_detail_data_view(request,pk):
  post = Post.objects.get(pk=pk)
  data={
    'id': post.pk,
    'title': post.title,
    'body': post.body,
    'author': post.author.user.username,
    'logged_in': request.user.username,
  }
  return JsonResponse({'data': data})


def update_post(request,pk):
  post = Post.objects.get(pk=pk)
  if request.headers.get('x-requested-with') == 'XMLHttpRequest':
    new_title = request.POST.get('title')
    new_body = request.POST.get('body')
    post.title = new_title
    post.body = new_body
    post.save()
    return JsonResponse({
        'title': new_title,
        'body': new_body
      })


def delete_post(request,pk):
  post = Post.objects.get(pk=pk)
  if request.headers.get('x-requested-with') == 'XMLHttpRequest':
    post.delete()
    return JsonResponse({'message':'post deleted successfully'})
    
        
        


