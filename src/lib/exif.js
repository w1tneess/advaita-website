/**
 * Lightweight, zero-dependency client-side EXIF metadata reader.
 * Parses JPEG APP1 (0xFFE1) TIFF header for camera exposure data.
 */

export async function extractExifFromFile(file) {
  if (!file || !file.type.startsWith('image/')) return null

  try {
    // Read the first 64KB where EXIF header lives
    const slice = file.slice(0, 65536)
    const buffer = await slice.arrayBuffer()
    const view = new DataView(buffer)

    // Check SOI marker 0xFFD8
    if (view.getUint16(0) !== 0xffd8) return null

    let offset = 2
    const length = view.byteLength

    while (offset < length - 4) {
      const marker = view.getUint16(offset)
      offset += 2

      // APP1 marker (0xFFE1) contains Exif
      if (marker === 0xffe1) {
        const app1Length = view.getUint16(offset)
        offset += 2

        // Check for 'Exif\0\0' (0x457869660000)
        if (
          view.getUint32(offset) === 0x45786966 &&
          view.getUint16(offset + 4) === 0x0000
        ) {
          return parseTiffHeader(view, offset + 6)
        }
        offset += app1Length - 2
      } else if ((marker & 0xff00) === 0xff00) {
        // Other JPEG markers
        if (marker === 0xffda || marker === 0xffd9) break // SOS or EOI
        const sectionLength = view.getUint16(offset)
        offset += sectionLength
      } else {
        break
      }
    }
  } catch (err) {
    console.debug('EXIF extraction skipped:', err)
  }

  return null
}

function parseTiffHeader(view, tiffOffset) {
  const byteOrder = view.getUint16(tiffOffset)
  const isLittleEndian = byteOrder === 0x4949 // 'II' = Intel = Little Endian

  // Verify TIFF test number 42
  if (view.getUint16(tiffOffset + 2, isLittleEndian) !== 0x002a) return null

  const firstIfdOffset = view.getUint32(tiffOffset + 4, isLittleEndian)
  if (firstIfdOffset < 8) return null

  const tags = {}
  readIFD(view, tiffOffset, tiffOffset + firstIfdOffset, isLittleEndian, tags)

  // Look into Exif SubIFD if present (tag 0x8769)
  if (tags[0x8769]) {
    readIFD(view, tiffOffset, tiffOffset + tags[0x8769], isLittleEndian, tags)
  }

  // Format the extracted tags into clean display values
  const make = cleanString(tags[0x010f])
  const model = cleanString(tags[0x0110])
  const camera = model
    ? make && !model.toLowerCase().includes(make.toLowerCase())
      ? `${make} ${model}`
      : model
    : make || ''

  const lens = cleanString(tags[0xa434]) || cleanString(tags[0x0082]) || ''

  let aperture = ''
  if (tags[0x829d]) {
    aperture = `f/${tags[0x829d]}`
  } else if (tags[0x9202]) {
    const fStop = Math.round(Math.pow(2, tags[0x9202] / 2) * 10) / 10
    aperture = `f/${fStop}`
  }

  let shutter_speed = ''
  if (tags[0x829a]) {
    const val = tags[0x829a]
    shutter_speed = val < 1 ? `1/${Math.round(1 / val)}s` : `${val}s`
  }

  let focal_length = ''
  if (tags[0x920a]) {
    focal_length = `${Math.round(tags[0x920a])}mm`
  }

  const iso = tags[0x8827] ? `ISO ${tags[0x8827]}` : ''

  return {
    camera,
    lens,
    aperture,
    shutter_speed,
    focal_length,
    iso,
    date: cleanString(tags[0x9003]) || cleanString(tags[0x0132]) || '',
  }
}

function readIFD(view, tiffOffset, dirOffset, isLittleEndian, outTags) {
  if (dirOffset + 2 > view.byteLength) return
  const numEntries = view.getUint16(dirOffset, isLittleEndian)
  let offset = dirOffset + 2

  for (let i = 0; i < numEntries; i++) {
    if (offset + 12 > view.byteLength) break
    const tag = view.getUint16(offset, isLittleEndian)
    const type = view.getUint16(offset + 2, isLittleEndian)
    const count = view.getUint32(offset + 4, isLittleEndian)
    const valueOffset = offset + 8

    outTags[tag] = readTagValue(view, tiffOffset, valueOffset, type, count, isLittleEndian)
    offset += 12
  }
}

function readTagValue(view, tiffOffset, valueOffset, type, count, isLittleEndian) {
  switch (type) {
    case 1: // BYTE
    case 7: // UNDEFINED
      if (count === 1) return view.getUint8(valueOffset)
      break
    case 2: { // ASCII
      const stringOffset =
        count > 4 ? tiffOffset + view.getUint32(valueOffset, isLittleEndian) : valueOffset
      if (stringOffset + count <= view.byteLength) {
        let str = ''
        for (let i = 0; i < count - 1; i++) {
          str += String.fromCharCode(view.getUint8(stringOffset + i))
        }
        return str
      }
      break
    }
    case 3: // SHORT
      return view.getUint16(valueOffset, isLittleEndian)
    case 4: // LONG
      return view.getUint32(valueOffset, isLittleEndian)
    case 5: { // RATIONAL
      const rOffset = tiffOffset + view.getUint32(valueOffset, isLittleEndian)
      if (rOffset + 8 <= view.byteLength) {
        const num = view.getUint32(rOffset, isLittleEndian)
        const den = view.getUint32(rOffset + 4, isLittleEndian)
        return den ? num / den : 0
      }
      break
    }
    default:
      break
  }
  return null
}

function cleanString(str) {
  return typeof str === 'string' ? str.trim().replace(/\0+$/, '') : ''
}
