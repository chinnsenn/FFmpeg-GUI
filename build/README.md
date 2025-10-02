# Build Resources

This directory contains resources for building the application with electron-builder.

## Application Icons

To build the application with proper icons, add the following files to this directory:

### For all platforms
- `icon.png` - 512x512 or 1024x1024 PNG icon

### Platform-specific icons (optional, will be generated from icon.png if not provided)
- `icon.icns` - macOS icon
- `icon.ico` - Windows icon

## Icon Requirements

- **PNG**: 512x512 or 1024x1024 pixels, transparent background recommended
- **ICNS**: macOS icon, can be generated from PNG using `iconutil` or `electron-icon-builder`
- **ICO**: Windows icon, multiple sizes (16x16, 32x32, 48x48, 256x256)

## Generating Icons

You can use tools like:
- [electron-icon-builder](https://www.npmjs.com/package/electron-icon-builder)
- [electron-builder icon generation](https://www.electron.build/icons)
- Online tools like [iConvert Icons](https://iconverticons.com/)

## Note

If no icon files are provided, electron-builder will use default Electron icons.
