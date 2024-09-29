'use client'

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { ClerkProvider } from '@clerk/nextjs';
import discoTheme from './theme';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <ThemeProvider theme={discoTheme}>
            <CssBaseline />
            <Box
              sx={{
                minHeight: '100vh',
                backgroundColor: 'background.default',
                backgroundImage: 'radial-gradient(circle, #FF1493 1px, transparent 1px), radial-gradient(circle, #00FFFF 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                backgroundPosition: '0 0, 20px 20px',
              }}
            >
              {children}
            </Box>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
