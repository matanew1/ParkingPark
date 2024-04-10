import requests as req
import pytest
import geocoder

@pytest.fixture
def url():
    return 'https://parking-park-server.vercel.app/api'

@pytest.fixture
def current_location():
    location = geocoder.ip('me')
    return location.latlng

def test_get_all_users(url):
    response = req.get(url + '/user')
    assert response.status_code == 200
    assert response.headers['Content-Type'] == 'application/json; charset=utf-8'
    assert response.json() != []
    assert type(response.json()) == list

def test_get_all_parkings(url):
    response = req.get(url + '/parking/stations')
    assert response.headers['Content-Type'] == 'application/json; charset=utf-8'
    assert response.status_code == 200
    assert response.json() != []
    assert type(response.json()) == list
    
def test_get_all_closest_parking_with_query(url, current_location):
    #find my current location and send it as a query
    query = {
        'latitude': current_location[0],
        'longitude': current_location[1]
    }
    response = req.get(url + '/parking/stations/closestStation', params=query)
    assert response.headers['Content-Type'] == 'application/json; charset=utf-8'
    assert response.status_code == 200
    assert response.json() != []
    assert type(response.json()) == dict
    
def test_get_all_closest_parking_with_no_query(url):
    response = req.get(url + '/parking/stations/closestStation')
    assert response.headers['Content-Type'] == 'application/json; charset=utf-8'
    assert response.status_code == 400
    assert response.json() == {'message': 'Latitude and longitude are required'}
    assert type(response.json()) == dict
   
    
if __name__ == '__main__':
    pytest.main(['-vv', 'main.py'])