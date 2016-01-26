from index import app
from query import api_feed
from flask import render_template, request
from config import BASE_URL


@app.route('/')
def index():
    tags = [170839705]
    page_url = BASE_URL + request.path
    page_title = 'Vermont Legislature'
    page_explainer = ["VPR's guide to the Vermont Legislature. Latest coverage, statehouse streams and legislative resources, all in one place."]
    stories = api_feed(tags, numResults=10, thumbnail=True)
    featured = api_feed([291752955, 292002570], numResults=2, thumbnail=True, sidebar=True)

    social = {
        'title': "VPR: Vermont Legislature 2014",
        'subtitle': 'www.vpr.net/apps/legislature/',
        'img': 'http://mediad.publicbroadcasting.net/p/vpr/files/201401/statehouse-january.jpg',
        'description': "VPR's guide to the Vermont Legislature. Latest coverage, statehouse streams and legislative resources, all in one place.",
        'twitter_text': "VPR's guide to the VT legislature. Latest coverage, statehouse streams and legislative resources",
        'twitter_hashtag': 'VTpoli'
    }

    return render_template('content.html',
        page_title=page_title,
        page_explainer=page_explainer,
        stories=stories,
        social=social,
        featured=featured,
        page_url=page_url)
