from django.shortcuts import redirect
from django.core.cache import cache
from django.contrib.auth.models import User
from django.contrib.auth import login
from lukeacgame.models.player.player import Player
import requests
from random import randint
from django.http import JsonResponse


def receive_code(request):
    data = request.GET
    
    if "errcode" in data:
        return JsonResponse({
                'result': "apply failed",
                'errcode': data['errcode'],
                'errmsg': data['errmsg'],
            })

    code = data.get("code")
    state = data.get("state")
    
    ## apply from unknow site
    if not cache.has_key(state):
        return JsonResponse({
                'result': "state is incorrect."
            })

    cache.delete(state)
    
    # get appid secret code
    apply_access_token_url = "https://www.acwing.com/third_party/api/oauth2/access_token/"
    params = {
                'appid': '5069',
                'secret': '05bb911a5081483b8ecb7283752d50ac',
                'code': code,
            }

    access_token_res = requests.get(apply_access_token_url, params=params).json()

    #print(access_token_res)
    access_token = access_token_res['access_token']
    openid = access_token_res['openid']

    players = Player.objects.filter(openid=openid)
    if players.exists():
        #login(request, players[0].user)
        player = players[0]

        return JsonResponse({
                'result': "success",
                'username': player.user.username,
                'photo': player.photo,

            })



    get_userinfo_url = "https://www.acwing.com/third_party/api/meta/identity/getinfo/"
    params = {
                'access_token': access_token,
                'openid': openid
            }

    userinfo_res = requests.get(get_userinfo_url, params).json()

    username = userinfo_res['username']
    user_photo = userinfo_res['photo']

    # ensure the username is different
    while User.objects.filter(username=username).exists():
        username += str(randint(0,9))


    # create user:
    user = User.objects.create(username=username)
    player = Player.objects.create(user=user, photo=user_photo, openid=openid)

    #login(request, user)

    
    return JsonResponse({
                'result': "success",
                'username': player.user.username,
                'photo': player.phot,
            })
