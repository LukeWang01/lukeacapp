from django.http import JsonResponse
from django.contrib.auth import login
from django.contrib.auth.models import User
from lukeacgame.models.player.player import Player


def register(request):
    data = request.GET
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()
    password_confirm = data.get("password_confirm", "").strip()
    if not password or not username:
        return JsonResponse({
                'result': 'Username or password cannot be empty.',
            })
    
    if password != password_confirm:
        return JsonResponse({
                'result': 'Please confirm password.'
            })

    if User.objects.filter(username=username).exists():
        return JsonResponse({
                'result': 'Username already exist'
            })

    user = User(username=username)
    user.set_password(password)
    user.save()

    Player.objects.create(user=user, photo="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXbyLvTsuIde58Q20O__YkT8Ry6ASkZKrfJQ")
    login(request, user)
    return JsonResponse({
            'result': 'success'
        })


