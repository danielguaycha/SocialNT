from django.urls import path

from . import views

urlpatterns = [
    # Login
    path('login', views.index, name='index'),
    # Register
    path('', views.takePhoto, name='takePhoto'),
    path('register', views.takePhoto, name='takePhoto'),    

    path('identificar', views.identificar, name='identificar'),
    path('registerPhotos', views.registerPhotos, name='registerPhotos'),
    
]