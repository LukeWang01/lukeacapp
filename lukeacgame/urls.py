from django.urls import path
from lukeacgame.views import index


urlpatterns = [
    path("", index, name="index"),
        ]

