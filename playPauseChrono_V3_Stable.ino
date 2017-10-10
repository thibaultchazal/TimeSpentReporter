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
double current = 0;
int seconds = 0;
int minutes = 0;
int hours = 0;
boolean run = false;
char currentTime[9];

void loop()
{

        if (digitalRead(8) == LOW)
        {
          switch (run)
          {
            case false:
              start() ;
              break;

            case true:
              pause() ;
              break;
          }

        }
}

void start()
{
    a = millis();
    delay(150);
    current = i;
    while (digitalRead(8) == HIGH)
    {
      c = millis();
      i = (c - a) / 1000 + current;

      lcd.clear();
      display();

      run = true;
    }
}

void pause()
{
    a = millis();
    delay(150);
    while (digitalRead(8) == HIGH)
    {
      display();
      lcd.setCursor(0, 1);
      lcd.print("Pause");
      lcd.setCursor(0, 0);
      delay(10);
    }
    run = false;
}

void display()
{
    int total = i;
    minutes = total / 60;
    seconds = total % 60;
    hours = minutes / 60;
    minutes = minutes % 60;

    sprintf(currentTime, "%02d:%02d:%02d", hours, minutes, seconds);
    lcd.setCursor(0,0);
    lcd.print(currentTime); // prints in the format HH:MM:SS
    Serial.println(currentTime);

      Serial.println(total);
      delay(10);
}
