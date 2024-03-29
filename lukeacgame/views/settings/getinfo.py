from django.http import JsonResponse
from lukeacgame.models.player.player import Player


def getinfo_acapp(request):
    player = Player.objects.all()[0]
    #player = Player.objects.get(user=user)
    return JsonResponse({
        'result': 'success',
        'username': player.user.username,
        'photo': player.photo,

        })


def getinfo_web(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({
                'result': 'Not log in'
            })
    else:
        #player = Player.objects.all()[0]
        player = Player.objects.get(user=user)
        return JsonResponse({
            'result': 'success',
            'username': player.user.username,
            'photo': player.photo,
            })


def getinfo(request):
    platform = request.GET.get('platform')
    if platform == "ACAPP":
        return getinfo_acpp(request)
    elif platform == "WEB":
    #else:
        return getinfo_web(request)
