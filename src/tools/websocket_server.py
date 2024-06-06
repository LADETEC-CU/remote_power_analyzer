import asyncio
import websockets
import json
import random

async def generate_3phase_data():
    data = {
        "voltages": {
            "V1": round(random.uniform(220, 240), 2),
            "V2": round(random.uniform(220, 240), 2),
            "V3": round(random.uniform(220, 240), 2)
        },
        "currents": {
            "I1": round(random.uniform(0, 100), 2),
            "I2": round(random.uniform(0, 100), 2),
            "I3": round(random.uniform(0, 100), 2)
        },
        "powers": {
            "total_power": round(random.uniform(5000, 10000), 2),
            "reactive_power": round(random.uniform(1000, 2000), 2),
            "apparent_power": round(random.uniform(6000, 12000), 2)
        }
    }
    return json.dumps(data)

async def handler(websocket, path):
    async for message in websocket:
        if message == "get_data":
            data = await generate_3phase_data()
            await websocket.send(data)

async def main():
    async with websockets.serve(handler, "localhost", 8765):
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())
