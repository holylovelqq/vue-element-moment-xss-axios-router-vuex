import { xssSanitizer } from '@/components/pages/common/CommonMethods.js'

describe('Test XSS Filter', () => {
  test('Regular html tags in the whitelist', () => {
    let regulerHtml = '<h1>HyperText Markup Language</h1>'
    regulerHtml += '<h2>HyperText Markup Language</h2>'
    regulerHtml += '<h3>HyperText Markup Language</h3>'
    regulerHtml += '<h4>HyperText Markup Language</h4>'
    regulerHtml += '<h5>HyperText Markup Language</h5>'
    regulerHtml += '<h6>HyperText Markup Language</h6>'
    regulerHtml += '<p>HyperText Markup Language</p>'
    regulerHtml += '<p><strong>HTML</strong><s>CSS</s>'
    regulerHtml += '<span>Span Tag</span>'
    regulerHtml += '<a>HTML</a></p>'
    regulerHtml += '<br />'
    regulerHtml += '<blockquote>'
    regulerHtml += '<p>ハイパーテキストマークアップランゲージ</p>'
    regulerHtml += '</blockquote>'
    regulerHtml += '<ul>'
    regulerHtml += '<li>Nodejs</li>'
    regulerHtml += '<li>Ruby</li>'
    regulerHtml += '<li>Python</li>'
    regulerHtml += '</ul>'
    regulerHtml += '<ol>'
    regulerHtml += '<li>Nodejs</li>'
    regulerHtml += '<li>Ruby</li>'
    regulerHtml += '<li>Python</li>'
    regulerHtml += '</ol>'
    regulerHtml += '<table><thead><tr><th>#</th><th>ブラウザ</th></tr></thead><tbody><tr><td>1</td><td>Internet Explorer</td></tr><tr><td>2</td><td>Google Chrome</td></tr><tr><td>3</td><td>FireFox</td></tr></tbody></table>'
    expect(xssSanitizer(regulerHtml)).toBe(regulerHtml)
  })

  test('Regular html attributes in the whitelist', () => {
    let regulerHtml = '<p style="color:#ffffff;">段落</p>'
    regulerHtml += '<p style="color:#ffffff;">Span Tag</span>'
    regulerHtml += '<a href="https://ja.wikipedia.org/wiki/HTML">HTML</a></p>'
    regulerHtml += '<img alt="sample.GIF" src="data:image/gif;base64,R0lGOD" />'
    regulerHtml += '<td colspan="2">TD</td>'
    regulerHtml += '<td rowspan="2">TD</td>'
    regulerHtml += '<td align="center">TD</td>'
    regulerHtml += '<th colspan="2">TD</th>'
    regulerHtml += '<th rowspan="2">TD</th>'
    regulerHtml += '<th align="center">TD</th>'
    expect(xssSanitizer(regulerHtml)).toBe(regulerHtml)
  })

  test('Regular html attribute values in the whitelist', () => {
    let regulerHtml = '<p style="color:#ffffff;">段落</p>'
    regulerHtml += '<p style="color:#fff;">Span Tag</span>'
    regulerHtml += '<a href="https://ja.wikipedia.org/wiki/HTML">HTML</a></p>'
    regulerHtml += '<img alt="sample.gif" src="data:image/gif;base64,R0lGOD" />'
    regulerHtml += '<img alt="sample.jpg" src="data:image/jpeg;base64,R0lGOD" />'
    regulerHtml += '<img alt="sample.png" src="data:image/png;base64,R0lGOD" />'
    expect(xssSanitizer(regulerHtml)).toBe(regulerHtml)
  })

  test('Plain text', () => {
    let text = 'HTML（エイチティーエムエル、HyperText Markup Language）'
    expect(xssSanitizer(text)).toBe(text)
  })

  test('Malformed html tag is escaped', () => {
    let malformedHtml = '<script>alert("Hello!")</script>'
    let expectedHtml = '&lt;script&gt;alert("Hello!")&lt;/script&gt;'
    expect(xssSanitizer(malformedHtml)).toBe(expectedHtml)
  })

  test('Malformed html tag attribute is removed', () => {
    let malformedHtml = '<a onClick="alert()">example</a>'
    let expectedHtml = '<a>example</a>'
    expect(xssSanitizer(malformedHtml)).toBe(expectedHtml)
  })

  test('Malformed css style property is removed', () => {
    let malformedHtml = '<p style="background: url(http://example.com/bg.png)">P</p>'
    let expectedHtml = '<p style>P</p>'
    expect(xssSanitizer(malformedHtml)).toBe(expectedHtml)
  })

  test('Malformed css value is removed', () => {
    let malformedHtml = '<p style="color: expression(alert("XSS!"))">XSS</p>'
    let expectedHtml = '<p style>XSS</p>'
    expect(xssSanitizer(malformedHtml)).toBe(expectedHtml)
  })

  test('Malformed data scheme is removed', () => {
    let malformedHtml = '<img alt="hostname.bat" src="data:application/octet-stream;base64,QGVjaG8gb2ZmDQoNCmhvc3RuYW1lDQoNCnBhdXNlDQo=" />'
    let expectedHtml = '<img alt="hostname.bat" src />'
    expect(xssSanitizer(malformedHtml)).toBe(expectedHtml)
  })
})
