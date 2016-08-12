from django.conf.urls import url
from django.views.generic import TemplateView

from . import views

urlpatterns = [

    # /thing/barcodenumber -> json object for unique thing
    url(r'thing/(?P<barcode_number>[0-9]+)', views.barcode ),
    url(r'things/(?P<user_id>\w+)', views.things_list),
    url(r'purchase', views.purchase)

]
