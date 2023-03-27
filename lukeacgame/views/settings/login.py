from django.contrib.auth import authenticate, login
from django.http import JsonResponse

def signin(request):
    data = request.GET
    username = data.get('username')
    password = data.get('password')
    user = authenticate(username=username, password=password)
    if not user:
        return JsonResponse({
                'result': 'username or password is incorrect!'
            })

    login(request, user)    # login function from Django
    return JsonResponse({
            'result': 'success'
        })
