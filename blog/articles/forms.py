from django import forms
from django.contrib.auth.models import User


class RegistrationForm(forms.Form):
    username = forms.CharField(label='Имя пользователя', max_length=150)
    email = forms.EmailField(label='Электронная почта')
    password = forms.CharField(label='Пароль', strip=False, widget=forms.PasswordInput)

    def clean_username(self):
        username = self.cleaned_data['username']
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError('Пользователь с таким именем уже существует')
        return username


class LoginForm(forms.Form):
    username = forms.CharField(label='Имя пользователя', max_length=150)
    password = forms.CharField(label='Пароль', strip=False, widget=forms.PasswordInput)
