import requests
import json
import random
from time import sleep

# Define the URL for the API endpoint
url = "http://localhost:5173/api/sensor"


def generate_phase_data():
    voltage = random.uniform(108, 120)
    current = random.uniform(0, 25)
    pf = random.uniform(0.6, 1)
    pa = voltage*current
    power = pa*pf
    pr = (pa**2-power**2)**0.5
    return {
        "voltage": voltage,
        "current": current,
        "power": power,
        "power_r": pr,
        "power_a": pa,
        "power_factor": pf,
    }


# Send the data to the API endpoint using the POST method
headers = {'Content-Type': 'application/json'}

while True:
    # Create a data payload in JSON format
    data = {
        "phase1": generate_phase_data(),
        "phase2": generate_phase_data(),
        "phase3": generate_phase_data()
    }
    response = requests.post(url, headers=headers, data=json.dumps(data))

    # Check the response status code
    if response.status_code == 200:
        # The data was successfully uploaded
        print("Data uploaded successfully")
        print(response.json()['digital_outputs'])
    else:
        # An error occurred
        print("An error occurred: {}".format(response.status_code))
    sleep(5)
