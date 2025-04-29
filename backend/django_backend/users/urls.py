from django.urls import path
from .views import RegisterView, LoginView
from .views import MeView 

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
        path('usuario/', MeView.as_view()),
]
