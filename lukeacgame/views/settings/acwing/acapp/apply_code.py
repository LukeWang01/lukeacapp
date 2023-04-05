from django.http import JsonResponse
from urllib.parse import quote
from random import randint
from django.core.cache import cache


def get_state():
    res = ""
    for i in range(8):
        res += str(randint(0,9))

    return res


def apply_code(requset):
    appid = "5069"
    
    redirect_uri = quote("https://app5069.acapp.acwing.com.cn/settings/acwing/acapp/receive_code/")
    scope = "userinfo"
    state = get_state()
    
    # url to access acwing to get code back
    # apply_code_url = "https://www.acwing.com/third_party/api/oauth2/web/authorize/"  

    cache.set(state, True, 7200)  # vaild 2 hours

    return JsonResponse({
            'result': 'success',
            'appid': appid,
            'redirect_uri': redirect_uri,
            'scope': scope,
            'state': state,
        })
