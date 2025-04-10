import type { Metadata } from 'next'
import '../client/src/index.css'
 
export const metadata: Metadata = {
  title: 'Library App',
  description: 'Web site created with Next.js.',
}

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <html lang="en">
        <head>
          <meta name="theme-color" content="#000000" />
          <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
          <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
          <link href="https://unpkg.com/filepond@^4/dist/filepond.css" rel="stylesheet" />
          <link href="https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css" rel="stylesheet"/>
          <script defer src="https://unpkg.com/filepond@^4/dist/filepond.js"></script>
          <script defer src="https://unpkg.com/filepond-plugin-file-encode/dist/filepond-plugin-file-encode.js"></script>
          <script defer src="https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.js"></script>
          <script defer src="https://unpkg.com/filepond-plugin-image-resize/dist/filepond-plugin-image-resize.js"></script>
          <script defer src="javascripts/fileUpload.js"></script>
        </head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div id="root">{children}</div>
        </body>
      </html>
    )
  }