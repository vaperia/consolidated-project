/*  \file	hwpins.h
 *  \brief	This is the header to define the pins and macros.
 *
 *  Created on: 2 July 2021
 *      Author:
 */

#ifndef HWPINS_H_
#define HWPINS_H_

// [all contribution] contribution - All pin definitions
/* LDR Pins */
#define LDR_WEST_PIN    A0
#define LDR_EAST_PIN    A1

/* LED Pins */
#define LED_WEST_PIN    4
#define LED_EAST_PIN    7

/* Servo Pins */
#define SERVO_WEST_PIN  9
#define SERVO_EAST_PIN  10

/* LCD Pins (4-bit mode) */
#define LCD_RS_PIN      12
#define LCD_EN_PIN      11
#define LCD_D4_PIN      5
#define LCD_D5_PIN      6
#define LCD_D6_PIN      8
#define LCD_D7_PIN      13

/* LCD 2 Pins (4-bit mode) */
#define LCD2_RS_PIN     2
#define LCD2_EN_PIN     3
#define LCD2_D4_PIN     A2
#define LCD2_D5_PIN     A3
#define LCD2_D6_PIN     A4
#define LCD2_D7_PIN     A5

#endif