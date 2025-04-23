import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000, // Specify the server port
  },
  define: {
    'env': {
      WS_URL_ALICE_HYDRA_NODE: 'ws://localhost:4001', // Specify the Alice's Hydra node WebSocket URL
      WS_URL_BOB_HYDRA_NODE: 'ws://localhost:4002', // Specify the Bob's Hydra node WebSocket URL
      WS_URL_CARDANO_CLI_WRAPPER: 'ws://localhost:3002', // Specify the Cardano CLI Wrapper WebSocket URL
    },
  },
})

