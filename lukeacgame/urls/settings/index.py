from django.urls import path
from lukeacgame.views.settings.getinfo import getinfo
from lukeacgame.views.settings.login import signin
from lukeacgame.views.settings.logout import signout
from lukeacgame.views.settings.register import register


urlpatterns = [
    path("getinfo/", getinfo, name="settings_getinfo"),
    path("login/", signin, name="settings_login"),
    path("logout/", signout, name="settings_logout"),
    path("register/", register, name="settings_register"),

]
