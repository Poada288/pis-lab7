from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.http import Http404
from django.shortcuts import redirect, render
from .forms import LoginForm, RegistrationForm
from .models import Article


def archive(request):
    return render(request, 'archive.html', {"posts": Article.objects.all()})


def get_article(request, article_id):
    try:
        post = Article.objects.get(id=article_id)
        return render(request, 'article.html', {"post": post})
    except Article.DoesNotExist:
        raise Http404


def create_post(request):
    if not request.user.is_authenticated:
        raise Http404

    if request.method == 'POST':
        form = {
            'title': request.POST.get('title', '').strip(),
            'text': request.POST.get('text', '').strip(),
        }
        if not form['title'] or not form['text']:
            form['errors'] = 'Не все поля заполнены'
        elif len(form['title']) > 200:
            form['errors'] = 'Название должно содержать не более 200 символов'
        elif Article.objects.filter(title=form['title']).exists():
            form['errors'] = 'Статья с таким названием уже существует'
        else:
            try:
                article = Article.objects.create(
                    title=form['title'], text=form['text'], author=request.user
                )
            except IntegrityError:
                if not Article.objects.filter(title=form['title']).exists():
                    raise
                form['errors'] = 'Статья с таким названием уже существует'
            else:
                return redirect('get_article', article_id=article.id)
        return render(request, 'create_post.html', {'form': form})

    return render(request, 'create_post.html', {'form': {}})


def register(request):
    form = RegistrationForm(request.POST if request.method == 'POST' else None)
    if form.is_valid():
        try:
            User.objects.create_user(**form.cleaned_data)
        except IntegrityError:
            if not User.objects.filter(username=form.cleaned_data['username']).exists():
                raise
            form.add_error('username', 'Пользователь с таким именем уже существует')
        else:
            return redirect('sign_in')
    return render(request, 'register.html', {'form': form})


def sign_in(request):
    form = LoginForm(request.POST if request.method == 'POST' else None)
    if form.is_valid():
        user = authenticate(request, **form.cleaned_data)
        if user is not None:
            login(request, user)
            return redirect('archive')
        form.add_error(None, 'Неверное имя пользователя или пароль')
    return render(request, 'login.html', {'form': form})
