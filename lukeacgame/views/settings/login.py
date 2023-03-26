from django.contrib.auth import authenticate, login
from django.http import JsonResponse

def login(request):
    data = request.GET
