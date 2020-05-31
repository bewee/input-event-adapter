# Input Event Adapter
This add-on for the Mozilla WebThings Gateway allows you to use input events from USB devices attached to your Pi to control your IoT. I use <a href='https://www.amazon.com/dp/B07RFN8Z47'>this USB remote</a> in order to control my WiFi radio device, but you should be able to use all kinds of USB devices (keyboards, mice, ...) to control all devices connected to your MozillaIOT Gateway (plugs, lights, ...).

If you happen to experience any problems, feel free to open an issue or a pull request.

# Setup
Install this add-on through the WebThings gateway's add-on list.

The user `pi` has to be allowed to execute the `evtest` command with root privileges. In order to achieve this, connect to your Pi via SSH and execute the following command:
```
sudo chmod u+s /usr/bin/evtest
```

# Usage
After you have enabled the add-on, all connected USB devices should be listed on the Gateway (on the homepage, press the (+) in the lower right corner).

![](https://user-images.githubusercontent.com/44091658/83340525-9931c480-a2d9-11ea-81bd-734dec02a776.PNG)

Pressing a button on your physical device will cause an event to be raised in the gateway

![](https://user-images.githubusercontent.com/44091658/83340565-1d844780-a2da-11ea-88c5-540af80e5929.PNG)

(in order to show events that occured, click on a device and then on the three dots in the lower right corner and select event log)

You can configure the events each device provides in the add-on settings

![](https://user-images.githubusercontent.com/44091658/83340752-4c9bb880-a2dc-11ea-8e22-e1c075ba5c35.PNG)

Here you can add all events you need. The events keyup, keydown, keypress and data fire regardless of which key was pressed. These events are especially helpful to obtain the key names (can be found in the event log ("code_name"); e.g.: KEY_ENTER, KEY_BACKSPACE, KEY_MUTE, ...). You can also specify events that only react to specific keys (see image).

Using the Input Event devices, you can then create rules with the required events as a trigger.

![](https://user-images.githubusercontent.com/44091658/83340715-dac36f00-a2db-11ea-9b8f-e9e6e596e62d.PNG)

# Power Button

My remote happend to have a power button that shut down my Raspberry Pi whenever I hit it. In order to disable this functionality, follow <a href='https://amp.reddit.com/r/linux4noobs/comments/aem32x/how_to_turn_off_sleep_button_on_keyboard_for/'>the instructions provided here</a>.
