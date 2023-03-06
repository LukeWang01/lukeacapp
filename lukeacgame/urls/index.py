from django.urls import path, include

from lukeacgame.views.index import index


urlpatterns=[

    path("", index, name="index"),
    path("menu/", include("lukeacgame.urls.menu.index")),
    path("playground/", include("lukeacgame.urls.playground.index"),
    path("settings/", include("lukeacgame.urls.settings.index"),

]


