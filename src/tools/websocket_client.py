import asyncio
import websockets

async def request_data():
    async with websockets.connect("ws://localhost:8765") as websocket:
        while True:
            await websocket.send("get_data")
            data = await websocket.recv()
            print(f"Received data: {data}")
            await asyncio.sleep(2)  # Wait for 2 seconds before sending the next request

if __name__ == "__main__":
    asyncio.run(request_data())
