import time
import statistics
import spidev
import board
import adafruit_dht

from gpiozero import Device, MotionSensor
from gpiozero.pins.native import NativeFactory

from config import (
    PIR_GPIO,
    DHT_GPIO_PIN,
    RAIN_CHANNEL,
    SPI_BUS,
    SPI_DEVICE,
    SPI_MAX_SPEED_HZ,
    RAIN_NO_RAIN_THRESHOLD,
    RAIN_LIGHT_RAIN_THRESHOLD,
)

Device.pin_factory = NativeFactory()


class SensorController:
    def __init__(self):
        self.pir = MotionSensor(PIR_GPIO)
        self.dht_device = adafruit_dht.DHT11(getattr(board, f"D{DHT_GPIO_PIN}"), use_pulseio=False)

        self.spi = spidev.SpiDev()
        self.spi.open(SPI_BUS, SPI_DEVICE)
        self.spi.max_speed_hz = SPI_MAX_SPEED_HZ

    def read_adc(self, channel: int) -> int:
        response = self.spi.xfer2([1, (8 + channel) << 4, 0])
        return ((response[1] & 3) << 8) + response[2]

    def read_rain_raw(self, samples: int = 5, delay: float = 0.05) -> int:
        vals = []
        for _ in range(samples):
            vals.append(self.read_adc(RAIN_CHANNEL))
            time.sleep(delay)
        return int(statistics.median(vals))

    def classify_rain(self, raw_value: int) -> str:
        if raw_value > RAIN_NO_RAIN_THRESHOLD:
            return "no_rain"
        elif raw_value >= RAIN_LIGHT_RAIN_THRESHOLD:
            return "light_rain"
        return "heavy_rain"

    def read_temperature(self):
        try:
            return self.dht_device.temperature
        except Exception as e:
            print(f"[WARN] DHT read failed: {e}")
            return None

    def read_motion(self) -> bool:
        return bool(self.pir.motion_detected)

    def read_all(self) -> dict:
        rain_raw = self.read_rain_raw()
        return {
            "motion": self.read_motion(),
            "temperature": self.read_temperature(),
            "rain_raw": rain_raw,
            "rain_status": self.classify_rain(rain_raw),
            "source": "sensor_pi",
        }

    def cleanup(self):
        try:
            self.spi.close()
        except Exception:
            pass
