import test from 'node:test'
import assert from 'node:assert/strict'
import { isSafeUrl, isSafeImageUrl, sanitizeUrl, sanitizeImageUrl } from '../src/lib/url.ts'

test('isSafeUrl allows valid http and https URLs', () => {
  assert.equal(isSafeUrl('https://advaitachandra.in'), true)
  assert.equal(isSafeUrl('http://localhost:5173'), true)
  assert.equal(isSafeUrl('https://github.com/w1tneess'), true)
})

test('isSafeUrl allows relative root paths and page anchors', () => {
  assert.equal(isSafeUrl('/'), true)
  assert.equal(isSafeUrl('/projects'), true)
  assert.equal(isSafeUrl('/photography/photo-1'), true)
  assert.equal(isSafeUrl('#inquiries'), true)
})

test('isSafeUrl rejects malicious schemes and pseudo-protocols', () => {
  assert.equal(isSafeUrl('javascript:alert(1)'), false)
  assert.equal(isSafeUrl('JAVASCRIPT:alert(document.cookie)'), false)
  assert.equal(isSafeUrl('javascript:/*--></title></style>alert(1)'), false)
  assert.equal(isSafeUrl('vbscript:msgbox(1)'), false)
  assert.equal(isSafeUrl('data:text/html,<script>alert(1)</script>'), false)
  assert.equal(isSafeUrl('//evil.com/xss'), false) // protocol-relative URL
  assert.equal(isSafeUrl(''), false)
  assert.equal(isSafeUrl(null), false)
  assert.equal(isSafeUrl(undefined), false)
})

test('isSafeImageUrl permits safe image sources and data schemes', () => {
  assert.equal(isSafeImageUrl('https://images.unsplash.com/photo-123'), true)
  assert.equal(isSafeImageUrl('/photo.webp'), true)
  assert.equal(isSafeImageUrl('blob:http://localhost:5173/abcdef'), true)
  assert.equal(isSafeImageUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='), true)
  assert.equal(isSafeImageUrl('data:image/jpeg;base64,/9j/4AAQSkZJRg=='), true)
})

test('isSafeImageUrl rejects dangerous URI schemes and non-image data URIs', () => {
  assert.equal(isSafeImageUrl('javascript:alert(1)'), false)
  assert.equal(isSafeImageUrl('data:text/html,<script>alert(1)</script>'), false)
  assert.equal(isSafeImageUrl('data:application/javascript,alert(1)'), false)
  assert.equal(isSafeImageUrl('file:///etc/passwd'), false)
  assert.equal(isSafeImageUrl('//evil.com/img.jpg'), false)
  assert.equal(isSafeImageUrl(''), false)
  assert.equal(isSafeImageUrl(null), false)
})

test('sanitizeUrl and sanitizeImageUrl return safe fallbacks', () => {
  assert.equal(sanitizeUrl('https://example.com'), 'https://example.com')
  assert.equal(sanitizeUrl('javascript:alert(1)', '#'), '#')
  assert.equal(sanitizeUrl('', '#'), '#')
  assert.equal(sanitizeUrl(null, '#'), '#')

  assert.equal(sanitizeImageUrl('https://example.com/img.png'), 'https://example.com/img.png')
  assert.equal(sanitizeImageUrl('javascript:alert(1)', ''), '')
  assert.equal(sanitizeImageUrl('', ''), '')
  assert.equal(sanitizeImageUrl(null, ''), '')
})
