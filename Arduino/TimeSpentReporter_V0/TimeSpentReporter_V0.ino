#include <LiquidCrystal.h>

LiquidCrystal lcd(7, 6, 5, 4, 3, 2);

void setup()
{
  lcd.begin(16, 2);
  lcd.clear();

  Serial.begin(9600);

  pinMode(8, INPUT);
  digitalWrite(8, HIGH);

  lcd.clear();
  lcd.print("press start");
  delay(100);

}

double a = millis();
double i = 0;
double c ;
double currentTimer = 0;
int seconds = 0;
int minutes = 0;
int hours = 0;
boolean run = false;
char currentTime[9];
int current;
long millis_held = 0;    // How long the button was held (milliseconds)
long secs_held;      // How long the button was held (seconds)
long prev_secs_held; // How long the button was held in the previous check
byte previous = HIGH;
unsigned long firstTime; // how long since the button was first pressed
int reset_threshold = 600; // how long the button must be held to reset the chrono
int pause_threshold = 350; // how long the button can be held to pause

void loop()
{
  current = digitalRead(8);
  
  // if the button state changes to pressed, remember the start time
    if (current == LOW && previous == HIGH && (millis() - firstTime) > 200) {
      firstTime = millis();
    }

    millis_held = (millis() - firstTime);
    secs_held = millis_held / 1000;

    // This if statement is a basic debouncing tool, the button must be pushed for at least
    // 50 milliseconds in a row for it to be considered as a push.
    if (millis_held > 50) {
      if(current == LOW && millis_held > pause_threshold){
        Blink();
        if (millis_held >= reset_threshold) {      // If the button is held for more than 0.6 seconds, reset
          reset();
        }
      }
      // check if the button was released since we last checked
      if (current == HIGH && previous == LOW) {

        // Button pressed for less than 1 second, one long LED blink
        if (millis_held <= pause_threshold) {
          switch (run)
          {
            case false:
              start();
              break;

            case true:
              pause() ;
              break;
          }
        }
      }
    }
    previous = current;
    prev_secs_held = secs_held;
}


void start()
{
    Serial.println("Start");
    a = millis();
    delay(150);
    currentTimer = i;
    while (digitalRead(8) == HIGH)
    {
      c = millis();
      i = (c - a) / 1000 + currentTimer;

      lcd.clear();
      Display();

      run = true;
    }
}

void pause()
{
    Serial.println("Pause");
    a = millis();
    delay(10);
    while (digitalRead(8) == HIGH)
    {
      Display();
      lcd.setCursor(0, 1);
      lcd.print("Pause");
      lcd.setCursor(0, 0);
      delay(10);
    }
    run = false;
}

void Display()
{
    int total = i;
    minutes = total / 60;
    seconds = total % 60;
    hours = minutes / 60;
    minutes = minutes % 60;

    sprintf(currentTime, "%02d:%02d:%02d", hours, minutes, seconds);
    lcd.setCursor(0,0);
    lcd.print(currentTime); // prints in the format HH:MM:SS
//    Serial.println(currentTime);

//    Serial.println(total);
    delay(10);
}

void reset()
{
  Serial.println("Reset");
  lcd.clear();
  lcd.print("press start");
  i = 0;
  run = false;
  delay(100);
}

void Blink()
{
  if(secs_held <= 0.7){
    lcd.noDisplay(); // Turn off the display
    delay(500);
    lcd.display();   // Turn on the display:
    delay(500);
  }
}
