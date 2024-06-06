# Poker Analyzer Project

This project is a web application built with SvelteKit and TailwindCSS, using WebSockets to request and display poker analyzer data. The application is designed to be served by an ESP32 microcontroller using the static adapter. The project uses pnpm as the package manager.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Building for Production](#building-for-production)
- [Deploying to ESP32](#deploying-to-esp32)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

This project aims to provide real-time poker analysis using a web interface. It leverages the power of SvelteKit for the frontend, TailwindCSS for styling, and WebSockets for real-time data communication with the poker analyzer server. The application is designed to be lightweight and efficient, making it suitable for deployment on an ESP32 microcontroller.

## Features

- Real-time poker data analysis
- Responsive design with TailwindCSS
- Fast and reactive UI with SvelteKit
- WebSocket communication for live updates
- Static site generation for easy deployment on ESP32

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and pnpm installed on your local machine
- An ESP32 microcontroller for deployment
- A poker analyzer server that supports WebSocket communication

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/poker-analyzer-project.git
   cd poker-analyzer-project
   ```

2. Install dependencies using pnpm:

   ```sh
   pnpm install
   ```

## Running the Project

To start the development server:

Run the test websocket server (a replacement for the Esp32 board for testing purposes) in another terminal:

```sh
python3 src/tools/websocket_server.py
```

```sh
pnpm dev
```

This will start the SvelteKit development server. You can view the application at `http://localhost:5173`.

## Building for Production

To build the project for production:

```sh
pnpm build
```

This will generate a static version of the site in the `build` directory, ready to be deployed on an ESP32 microcontroller.

## Deploying to ESP32

1. Ensure you have the necessary tools to flash the ESP32. You may use tools like [PlatformIO](https://platformio.org/) or [esptool](https://github.com/espressif/esptool).

2. Convert the `build` directory into a format suitable for the ESP32 filesystem (e.g., SPIFFS).

3. Upload the filesystem image to the ESP32.

4. Configure your ESP32 to serve the static files.

Refer to the specific documentation for your ESP32 framework (e.g., Arduino, ESP-IDF) for detailed instructions on flashing the filesystem.

## Folder Structure

```plaintext
poker-analyzer-project/
├── src/
│   ├── routes/
│   │   ├── index.svelte
│   │   └── ... (other routes)
│   ├── lib/
│   │   ├── components/
│   │   └── stores/
│   ├── assets/
│   └── app.html
├── static/
├── build/
├── package.json
├── svelte.config.js
├── tailwind.config.js
└── ... (other configuration files)
```

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
