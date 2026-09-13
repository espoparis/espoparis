"""Validate the built public pages on an isolated local Next server (stdlib only)."""
import json
import subprocess
import time
import urllib.request
import xml.etree.ElementTree as ET
from urllib.parse import urlparse
from html.parser import HTMLParser
from pathlib import Path

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.html = {}
        self.mains = 0
        self.links = []
        self.iframes = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'html':
            self.html = attrs
        if tag == 'main':
            self.mains += 1
        if tag == 'a' and 'href' in attrs:
            self.links.append(attrs['href'])
        if tag == 'iframe':
            self.iframes += 1

BASE = 'http://localhost:3112'
ROUTES = ['/', '/about', '/about/founder', '/about/advisory-board',
          '/global-presence', '/faculty', '/academic-program', '/library',
          '/learning', '/activities', '/contact', '/support', '/register']
FORMS = {'ar': 'GT5y7x96U69goLua9', 'en': 'HknrC7XQX9frGytX8',
         'fr': 'VTdZ6cHwRvQTib3F7', 'fa': '34Qg7vWZpnSVh8RZA',
         'az': 'PuFtQdrxunG1oQ6U6', 'tr': 'EjibGFgNADxg8c9d6'}

def fetch(path):
    with urllib.request.urlopen(BASE + path, timeout=30) as response:
        assert response.status == 200, path
        page = Page()
        page.feed(response.read().decode())
    return page

def check():
    results = []
    faculty_links = set()
    for locale in ['en', 'fr', 'ar', 'fa']:
        prefix = '' if locale == 'en' else '/' + locale
        direction = 'rtl' if locale in ['ar', 'fa'] else 'ltr'
        for route in ROUTES:
            path = prefix + route
            page = fetch(path)
            assert page.html['lang'] == locale, path
            assert page.html['dir'] == direction, path
            assert page.mains == 1, (path, 'main landmarks', page.mains)
            assert not any('/' + code + '/' + code + '/' in href for code in ['en', 'fr', 'ar', 'fa'] for href in page.links), (path, 'duplicated locale prefix')
            if route == '/register':
                links = [x for x in page.links if x.startswith('https://forms.gle/')]
                assert len(links) == 6, path
                assert links[0] == 'https://forms.gle/' + FORMS[locale], path
                assert set(links) == {'https://forms.gle/' + x for x in FORMS.values()}, path
                assert page.iframes == 0, path
            if route == '/':
                assert any(x in page.links for x in [prefix + '/support', '/' + locale + '/support']), path
            if route == '/faculty':
                faculty_links.update(x for x in page.links if '/faculty/' in x)
            results.append({'path': path, 'status': 200, 'lang': locale, 'dir': direction})
    for path in sorted(faculty_links):
        page = fetch(path)
        assert page.mains == 1, path
        results.append({'path': path, 'status': 200})
    for path in ['/robots.txt', '/sitemap.xml']:
        fetch(path)
        results.append({'path': path, 'status': 200})
    with urllib.request.urlopen(BASE + '/sitemap.xml', timeout=30) as response:
        root = ET.fromstring(response.read())
    ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9',
          'x': 'http://www.w3.org/1999/xhtml'}
    entries = root.findall('s:url', ns)
    sitemap_paths = [urlparse(entry.find('s:loc', ns).text).path for entry in entries]
    expected = {r['path'] for r in results if r['path'] not in ['/robots.txt', '/sitemap.xml']}
    assert set(sitemap_paths) == expected, ('sitemap coverage', expected - set(sitemap_paths))
    assert len(sitemap_paths) == len(set(sitemap_paths)), 'duplicate sitemap URLs'
    for entry in entries:
        assert {link.attrib['hreflang'] for link in entry.findall('x:link', ns)} == {'en', 'fr', 'ar', 'fa'}
    print(f'PASS: sitemap contains {len(entries)} public URLs with four language alternates each.')
    for locale in ['en', 'fr', 'ar', 'fa']:
        prefix = '' if locale == 'en' else '/' + locale
        for route in ['/admin/content', '/admin/content/profiles', '/admin/help', '/admin/library']:
            path = prefix + route
            with urllib.request.urlopen(BASE + path, timeout=30) as response:
                html = response.read().decode()
                # Streaming Next responses can carry redirects as a refresh meta.
                streamed = 'id="__next-page-redirect"' in html and 'url=' + prefix + '/sign-in' in html
                assert '/sign-in' in response.url or streamed, (path, 'unauthenticated admin access')
                assert 'content-editor-title' not in html and 'name="pdfFileId"' not in html, path
                results.append({'path': path, 'status': response.status, 'redirect': 'sign-in'})
    try:
        urllib.request.urlopen(BASE + '/api/content-media/abcdefghijk123', timeout=30)
        raise AssertionError('unpublished image unexpectedly accessible')
    except urllib.error.HTTPError as error:
        assert error.code == 404
        results.append({'path': '/api/content-media/abcdefghijk123', 'status': 404})
    Path('docs/release-route-validation.json').write_text(json.dumps(results, indent=2) + '\n')
    print(f'PASS: {len(results)} routes, language directions, registration mappings and main landmarks.')

if __name__ == '__main__':
    with open('/tmp/espo-release-server.log', 'w') as log:
        server = subprocess.Popen(['node', 'node_modules/next/dist/bin/next', 'start',
                                   '-H', 'localhost', '-p', '3112'], stdout=log, stderr=subprocess.STDOUT)
        try:
            for attempt in range(40):
                if server.poll() is not None:
                    raise RuntimeError('Next server exited; see /tmp/espo-release-server.log')
                try:
                    fetch('/fr')
                    break
                except OSError:
                    time.sleep(0.25)
            else:
                raise RuntimeError('Next server did not become ready')
            check()
        finally:
            server.terminate()
            server.wait(timeout=10)
