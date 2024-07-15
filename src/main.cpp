/**
 *   ESP32 SvelteKit
 *
 *   A simple, secure and extensible framework for IoT projects for ESP32 platforms
 *   with responsive Sveltekit front-end built with TailwindCSS and DaisyUI.
 *   https://github.com/theelims/ESP32-sveltekit
 *
 *   Copyright (C) 2018 - 2023 rjwats
 *   Copyright (C) 2023 - 2024 theelims
 *
 *   All Rights Reserved. This software may be modified and distributed under
 *   the terms of the LGPL v3 license. See the LICENSE file for details.
 **/

#include <ESP32SvelteKit.h>
#include <LightMqttSettingsService.h>
#include <LightStateService.h>
#include <PsychicHttpServer.h>
#include <ModbusMaster.h>

#define SERIAL_BAUD_RATE 115200

boolean modbusSerialEcho = false;
boolean modbusSimulation = false;

const uint8_t pinWorking         = 27; 
const uint8_t pinMainPower       = 26; 
const uint8_t pinStartFail       = 25; 

const uint8_t pinRpm             = 34; // rpm (analog)
const uint8_t pinTemperature     = 33; // temperature (analog)
const uint8_t pinBateryLevel     = 35; // battery level (abalog)
const uint8_t pinOilPressure     = 36; // Oil presuure (analog)

uint64_t timeOn                   = 500;
uint64_t timeOff                  = 1000;
boolean myClock                   = false;

ModbusMaster node;
uint8_t  result;
uint16_t MODBUS_DIR_PIN = 5;
uint16_t PIN_LEDBUILTIN = 2;
uint16_t SLAVE_ID = 1;

boolean  isMainPower;
boolean  isWorking;
boolean  isBatteryOk;
boolean  isBatteryLow;
boolean  isBatteryHigh;

boolean  isStartFail;
boolean  isHighTemp;
boolean  isLowOilPress;
boolean  isOverSpeed;
boolean  isOverVoltage;

uint16_t workingHours;
uint16_t temperature;
uint16_t batteryLevel;
int16_t  oilPressure;
uint16_t rpm;

uint64_t modbusQualityTotalReads = 0;
uint64_t modbusQualityErrors = 0;
uint16_t modbusErrors;
uint16_t modbusFails;
uint16_t modbusMaxErrors = 5;
boolean  modbusState = true;
const int numDataRegs = 41;
const int numControRegs = 11;
int16_t  modbusData[numDataRegs + numControRegs];

PsychicHttpServer server;

ESP32SvelteKit esp32sveltekit(&server, 120);

LightMqttSettingsService lightMqttSettingsService = LightMqttSettingsService(&server,
                                                                             esp32sveltekit.getFS(),
                                                                             esp32sveltekit.getSecurityManager());

LightStateService lightStateService = LightStateService(&server,
                                                        esp32sveltekit.getSocket(),
                                                        esp32sveltekit.getSecurityManager(),
                                                        esp32sveltekit.getMqttClient(),
                                                        &lightMqttSettingsService);

void eepromInit() {
  ///////////////////////////////////////////////////////////////////////
  
}

void modbusPreTransmission() {
  delay(50);
  digitalWrite(MODBUS_DIR_PIN, HIGH);
}
void modbusPostTransmission() {
  digitalWrite(MODBUS_DIR_PIN, LOW);
  delay(50);
}
void setupModbus() {
  // RS-485 control pin
  pinMode(MODBUS_DIR_PIN, OUTPUT);
  digitalWrite(MODBUS_DIR_PIN, LOW);

  Serial2.begin(4800);
  Serial2.setTimeout(200);

  node.begin(SLAVE_ID, Serial2);
  node.preTransmission(modbusPreTransmission);
  node.postTransmission(modbusPostTransmission);

  eepromInit();
}

void readModbus() {
  if (!modbusSimulation) {
    result = node.readHoldingRegisters(0, numDataRegs);
    modbusQualityTotalReads++;
    if (result == node.ku8MBSuccess) {
      if (modbusSerialEcho) Serial.print("Success: ");
      for (int k = 0; k < numDataRegs; k++) {
        modbusData[k] = node.getResponseBuffer(k);
      }
      result = node.readHoldingRegisters(0x50, numControRegs);
      if (result == node.ku8MBSuccess) {
        modbusErrors = 0;
        modbusState = true;
        for (int k = 0; k < numControRegs; k++) {
          modbusData[numDataRegs + k] = node.getResponseBuffer(k);
        }
      }
    }
  }
  // result = 55;
  if (result != node.ku8MBSuccess) {
    if (modbusSerialEcho) {
      Serial.print("Failed:");
      Serial.print(result);
    }
    modbusQualityErrors++;
    modbusErrors++;
    if (modbusErrors > modbusMaxErrors) {
      if (modbusState) modbusFails++;
      modbusState = false;
      modbusQualityTotalReads--;
      modbusQualityErrors--;
    }
  }
  if (modbusSimulation || !modbusState) { // generates random values in case of modbusError

    float runTime = millis() / 1000.0;

    modbusData[0x00] = uint16_t(1300 + 1000 * sin(0.2 * runTime));   // phase voltages
    modbusData[0x01] = uint16_t(1000 + rand() % 200);
    modbusData[0x02] = uint16_t(1200 + rand() % 200);
    
    modbusData[0x03] = uint16_t(15000 + 15000 * cos(0.3 * runTime + 5));  // phase currents
    modbusData[0x04] = uint16_t(10000 + rand() % 20000);
    modbusData[0x05] = uint16_t(20000 + rand() % 10000);

    modbusData[0x08] = int16_t(3000 + 3000 * cos(0.3 * runTime + 8));  // active power
    modbusData[0x09] = int16_t(1000 + rand() % 300);
    modbusData[0x0A] = int16_t(2000 + rand() % 300);
    modbusData[0x07] = int16_t(modbusData[0x08] + modbusData[0x09] + modbusData[0x0A]);
    
    modbusData[0x0C] = int16_t(3000 + 6000 * cos(0.5 * runTime + 3)); // reactive powers
    modbusData[0x0D] = int16_t(1000 - (rand() % 2000));
    modbusData[0x0E] = int16_t(-1000 - (rand() % 1000));
    modbusData[0x0B] = modbusData[0x0C] + modbusData[0x0D] + modbusData[0x0E];

    modbusData[0x10] = uint16_t(sqrt(pow(modbusData[0x0C],2) + pow(modbusData[0x08],2))); //  aparent power
    modbusData[0x11] = uint16_t(sqrt(pow(modbusData[0x0D],2) + pow(modbusData[0x09],2)));
    modbusData[0x12] = uint16_t(sqrt(pow(modbusData[0x0E],2) + pow(modbusData[0x0A],2)));
    modbusData[0x0F] = uint16_t(sqrt(pow(modbusData[0x07],2) + pow(modbusData[0x0B],2)));

    modbusData[0x14] = uint16_t(1000 * cos(atan(abs(1.0*modbusData[0x0C])/(1.0*modbusData[0x08]))));  // power factor
    modbusData[0x15] = uint16_t(1000 * cos(atan(abs(1.0*modbusData[0x0D])/(1.0*modbusData[0x09]))));
    modbusData[0x16] = uint16_t(1000 * cos(atan(abs(1.0*modbusData[0x0E])/(1.0*modbusData[0x0A]))));
    modbusData[0x13] = uint16_t(1000 * cos(atan(abs(1.0*modbusData[0x0B])/(1.0*modbusData[0x07]))));
    
    modbusData[0x17] = uint16_t(1500 + 2000 * sin(0.4 * runTime));   // line voltages
    modbusData[0x18] = int16_t(-150 + rand() % 300);
    modbusData[0x19] = uint16_t(2850 + rand() % 300);
    
    modbusData[0x1A] = uint16_t(3000 + rand() % 6000);  // frequency
    modbusData[0x1B] = modbusData[0x1A];
    modbusData[0x1C] = modbusData[0x1A];

    modbusData[0x1D] = uint16_t(10 + rand() % 10);  // energy
    modbusData[0x1E] = uint16_t(100 + rand() % 100);
    modbusData[0x1F] = uint16_t(10 + rand() % 10);
    modbusData[0x20] = uint16_t(100 + rand() % 100);
    modbusData[0x21] = uint16_t(10 + rand() % 10);
    modbusData[0x22] = uint16_t(100 + rand() % 100);
    modbusData[0x23] = uint16_t(10 + rand() % 10);
    modbusData[0x24] = uint16_t(100 + rand() % 100);
    modbusData[0x25] = uint16_t(10 + rand() % 10);
    modbusData[0x26] = uint16_t(100 + rand() % 100);
    modbusData[0x27] = uint16_t(10 + rand() % 10);
    modbusData[0x28] = uint16_t(100 + rand() % 100);

    modbusData[0x2F] = 1;
    modbusData[0x30] = 1;

  }

  isOverVoltage = (modbusData[0x00] > 1500 || modbusData[0x01] > 1500 || modbusData[0x02] > 1500);


  if (modbusSerialEcho) {
    Serial.print(" - ");
    for (int k = 0; k < numDataRegs; k++) {
      Serial.print(modbusData[k]);
      Serial.print(" ");
    }
    Serial.println("");
    Serial.print("        --> ");
    for (int k = 0; k < numControRegs; k++) {
      Serial.print(modbusData[numDataRegs + k]);
      Serial.print(" ");
    }
    Serial.print(" - ");
    Serial.print("T:");
    Serial.print(modbusQualityTotalReads);
    Serial.print(" E:");
    Serial.print(modbusQualityErrors);
    Serial.print(" PE:");
    Serial.print(100 * ((float) modbusQualityErrors / (float) modbusQualityTotalReads));
    Serial.print(" iE:");
    Serial.print(modbusErrors);
    Serial.print(" F:");
    Serial.print(modbusFails);
    Serial.print(" S:");
    Serial.print(modbusState);
    Serial.println();
    Serial.print("        ==> ");
    Serial.print("Temp:");
    Serial.print(temperature);
    Serial.print(" batL:");
    Serial.print(batteryLevel);
    Serial.print(" oilP:");
    Serial.print(oilPressure);
    Serial.print(" rpm:");
    Serial.print(rpm);
    Serial.print(" W:");
    Serial.print(isWorking);
    Serial.print(" MP:");
    Serial.print(isMainPower);
    Serial.print(" SF:");
    Serial.print(isStartFail);
    Serial.print(" HT:");
    Serial.print(isHighTemp);
    Serial.print(" LP:");
    Serial.print(isLowOilPress);
    Serial.print(" OS:");
    Serial.print(isOverSpeed);
    Serial.print(" OV:");
    Serial.print(isOverVoltage);
    Serial.println("");
  }
}

void readVars() {
  //////////////////////////////////////////////////////////
  if (isWorking) workingHours++;
  
  rpm = modbusData[0x1A] / 3;
  
  temperature = 300 + analogRead(pinTemperature) * 1100 / 4096;
  batteryLevel = 80 + analogRead(pinBateryLevel) * 100 / 4096;
  oilPressure = -20 + analogRead(pinOilPressure) * 100 / 4096;
  
  isWorking = digitalRead(pinWorking);
  isMainPower = digitalRead(pinMainPower);
  isStartFail = digitalRead(pinStartFail);

  modbusSerialEcho = isMainPower;

  isBatteryOk = (batteryLevel >= 110 && batteryLevel <= 150) ? true : false;
  isBatteryLow = batteryLevel < 110 ? true : false;
  isBatteryHigh = batteryLevel > 150 ? true : false;
  
  isHighTemp = temperature > 950 ? true : false;
  isLowOilPress = oilPressure < 40 ? true : false;
  isOverSpeed = rpm > 1900 ? true : false;
}

StateUpdateResult updateVars(LightState &state) {
    state.ledOn = !state.ledOn;
    for (int i = 0; i < numDataRegs + numControRegs; i++)
      state.modbusRegs[i] = modbusData[i];

    state.workingHours = workingHours;
    state.temperature = temperature;
    state.batteryLevel = batteryLevel;
    state.oilPressure = oilPressure;
    state.rpm = rpm;

    state.isWorking = isWorking;
    state.isMainPower = isMainPower;
    state.isStartFail = isStartFail;
    state.isBatteryOk = isBatteryOk;
    state.isBatteryLow = isBatteryLow;
    state.isBatteryHigh = isBatteryHigh;
    state.isHighTemp = isHighTemp;
    state.isLowOilPress = isLowOilPress;
    state.isOverSpeed = isOverSpeed;
    state.isOverVoltage = isOverVoltage;
    
    state.modbusQualityTotalReads = modbusQualityTotalReads;
    state.modbusQualityErrors = modbusQualityErrors;
    state.modbusErrors = modbusErrors;
    state.modbusFails = modbusFails;
    state.modbusState = modbusState;

    return StateUpdateResult::CHANGED;
}

void setup()
{
    // start serial and filesystem
    Serial.begin(SERIAL_BAUD_RATE);

    // // start modbus
    setupModbus();

    // start ESP32-SvelteKit
    esp32sveltekit.begin();

    // load the initial light settings
    lightStateService.begin();
    // start the light service
    lightMqttSettingsService.begin();

    // Serial.println("ssssssssss--------------");
    // Serial.println(FACTORY_WIFI_SSID);
    // Serial.println(FACTORY_WIFI_PASSWORD);
    // Serial.println(FACTORY_WIFI_HOSTNAME);
    // Serial.println(FACTORY_WIFI_RSSI_THRESHOLD);
    // Serial.println("xxxxxxxxxx--------------");

    pinMode(pinWorking, INPUT_PULLUP);
    pinMode(pinMainPower, INPUT_PULLUP);
    pinMode(pinStartFail, INPUT_PULLUP);

    pinMode(pinRpm, ANALOG);
    pinMode(pinTemperature, ANALOG);
    pinMode(pinBateryLevel, ANALOG);
    pinMode(pinOilPressure, ANALOG);

    workingHours = 2000 + rand() % 1500;

}

void loop()
{
    // Delete Arduino loop task, as it is not needed in this example
    // vTaskDelete(NULL);

  uint8_t result;
  ulong runTime = millis();

  if ((runTime > timeOn) && !myClock) {
      myClock = true;
      readModbus();
      readVars();
  }
  if ((runTime > timeOff) && myClock) {
      timeOn = runTime + 2000;   // time ON
      timeOff = runTime + 2000;  // time OFF
      myClock = false;
      lightStateService.update(updateVars, "modbus");
  }
}
