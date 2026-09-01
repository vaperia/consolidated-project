#include <msp430.h>

//MOTOR DRIVER PINS (Annie)
#define L_IN1      BIT2      // P1.2
#define L_IN2      BIT3      // P1.3
#define LEFT_EN    BIT4      // P2.4

#define R_IN1      BIT4      // P1.4
#define R_IN2      BIT5      // P1.5
#define RIGHT_EN   BIT5      // P2.5

//LED PINS (Zion)
#define GREEN_LED  BIT1      // P6.1 ACTIVE

//BUTTON ISR PIN (Brendan)
#define BUTTON_PIN BIT2      // P2.2 NEW BUTTON

//I2C (Ryan Ang)
#define I2C_ADDR   0x08

volatile unsigned char active_mode = 1;

//GPIO INIT
void init_gpio(void) {

    // Motor pins (Annie)
    P1DIR |= L_IN1 | L_IN2 | R_IN1 | R_IN2;
    P1OUT &= ~(L_IN1 | L_IN2 | R_IN1 | R_IN2);

    // PWM pins (Annie)
    P2DIR |= LEFT_EN | RIGHT_EN;
    P2SEL |= LEFT_EN | RIGHT_EN;

    // LEDs (Zion)
    P6DIR |= GREEN_LED | YELLOW_LED;
    P6SEL &= ~(GREEN_LED | YELLOW_LED);

    // Start ACTIVE (Zion)
    P6OUT |= GREEN_LED;
    P6OUT &= ~YELLOW_LED;

    // BUTTON ISR ON P2.2 (Zion)
    P2DIR &= ~BUTTON_PIN;     // Input
    P2REN |= BUTTON_PIN;      // Enable resistor
    P2OUT |= BUTTON_PIN;      // Pull-up
    P2IES |= BUTTON_PIN;      // High → Low edge
    P2IFG &= ~BUTTON_PIN;     // Clear flag
    P2IE  |= BUTTON_PIN;      // Enable interrupt
}

// PWM (Annie)
void init_pwm(void) {
    TA2CCR0  = 1000 - 1;
    TA2CCTL1 = OUTMOD_7;
    TA2CCTL2 = OUTMOD_7;
    TA2CCR1  = 0;
    TA2CCR2  = 0;
    TA2CTL   = TASSEL_2 | MC_1;
}

// MOVEMENT FUNCTIONS (Annie and Brendan)
void stop_motion(void){
    TA2CCR1 = 0;
    TA2CCR2 = 0;
    P1OUT &= ~(L_IN1 | L_IN2 | R_IN1 | R_IN2);
}

void forward_motion(void){
    P1OUT |=  L_IN1; P1OUT &= ~L_IN2;
    P1OUT |=  R_IN1; P1OUT &= ~R_IN2;
    TA2CCR1 = 700; TA2CCR2 = 550;
}

void backward_motion(void){
    P1OUT |=  L_IN2; P1OUT &= ~L_IN1;
    P1OUT |=  R_IN2; P1OUT &= ~R_IN1;
    TA2CCR1 = 700; TA2CCR2 = 550;
}

void left_motion(void){
    P1OUT |=  L_IN2; P1OUT &= ~L_IN1;
    P1OUT |=  R_IN1; P1OUT &= ~R_IN2;
    TA2CCR1 = 350; TA2CCR2 = 350;
}

void right_motion(void){
    P1OUT |=  L_IN1; P1OUT &= ~L_IN2;
    P1OUT |=  R_IN2; P1OUT &= ~R_IN1;
    TA2CCR1 = 350; TA2CCR2 = 350;
}

// I2C INIT(Ryan Ang)
void init_i2c_slave(void){
    P4SEL |= BIT1 | BIT2;

    UCB1CTL1 |= UCSWRST;
    UCB1CTL0 = UCMODE_3 | UCSYNC;
    UCB1I2COA = I2C_ADDR;
    UCB1CTL1 &= ~UCSWRST;

    UCB1IE |= UCRXIE;
}

// I2C ISR
#pragma vector=USCI_B1_VECTOR
__interrupt void USCI_B1_ISR(void){
    switch (__even_in_range(UCB1IV,12)) {

        case 10: {
            char c = UCB1RXBUF;

            // WAKE (Zion)
            if (!active_mode && c == 'W') {
                active_mode = 1;
                P6OUT |= GREEN_LED;
                P6OUT &= ~YELLOW_LED;
                __bic_SR_register_on_exit(LPM0_bits);
                break;
            }

            // SLEEP (Zion)
            if (c == 'Z') {
                stop_motion();
                active_mode = 0;
                P6OUT &= ~GREEN_LED;
                P6OUT |= YELLOW_LED;
                __bis_SR_register_on_exit(LPM0_bits);
                break;
            }

            // MOVEMENT (Annie)
            if (active_mode) {
                if      (c == 'F') forward_motion();
                else if (c == 'B') backward_motion();
                else if (c == 'L') left_motion();
                else if (c == 'R') right_motion();
                else if (c == 'S') stop_motion();
            }
            break;
        }
    }
}

// BUTTON ISR — P2.2 — Wake MSP (Brendan)
#pragma vector=PORT2_VECTOR
__interrupt void PORT2_ISR(void)
{
    if (P2IFG & BUTTON_PIN) 
    {
        __delay_cycles(50000);  // debounce

        if (!(P2IN & BUTTON_PIN)) {
            active_mode = 1;
            stop_motion();

            P6OUT |= GREEN_LED;
            P6OUT &= ~YELLOW_LED;

            __bic_SR_register_on_exit(LPM0_bits);
        }

        P2IFG &= ~BUTTON_PIN;
    }
}

// MAIN LOOP
void main(void){
    WDTCTL = WDTPW | WDTHOLD;

    init_gpio();
    init_pwm();
    init_i2c_slave();

    __enable_interrupt();

    while(1){
        if (!active_mode) {
            __low_power_mode_0();
        }
    }
}
