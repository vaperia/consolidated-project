	.file	"task.cpp"
__SP_H__ = 0x3e
__SP_L__ = 0x3d
__SREG__ = 0x3f
__tmp_reg__ = 0
__zero_reg__ = 1
	.text
	.section	.text.is_night_time,"ax",@progbits
	.type	is_night_time, @function
is_night_time:
/* prologue: function */
/* frame size = 0 */
/* stack size = 0 */
.L__stack_usage = 0
	lds r24,_ZL5hours
	lds r25,_ZL5hours+1
	cpi r24,19
	cpc r25,__zero_reg__
	brge .L7
	cpi r24,18
	cpc r25,__zero_reg__
	brne .L3
	ldi r24,lo8(1)
	lds r18,_ZL7minutes
	lds r19,_ZL7minutes+1
	cpi r18,30
	cpc r19,__zero_reg__
	brge .L1
.L8:
	ldi r24,0
	rjmp .L1
.L3:
	cpi r24,7
	cpc r25,__zero_reg__
	brlt .L7
	sbiw r24,7
	brne .L8
	ldi r24,lo8(1)
	lds r18,_ZL7minutes
	lds r19,_ZL7minutes+1
	cpi r18,30
	cpc r19,__zero_reg__
	brge .L8
.L1:
/* epilogue start */
	ret
.L7:
	ldi r24,lo8(1)
	ret
	.size	is_night_time, .-is_night_time
.global	__floatsisf
.global	__divsf3
.global	__mulsf3
.global	__ltsf2
.global	__subsf3
.global	__gtsf2
.global	__addsf3
.global	__fixunssfsi
	.section	.text.adc_to_lux,"ax",@progbits
	.type	adc_to_lux, @function
adc_to_lux:
	push r12
	push r13
	push r14
	push r15
/* prologue: function */
/* frame size = 0 */
/* stack size = 4 */
.L__stack_usage = 4
	cp __zero_reg__,r24
	cpc __zero_reg__,r25
	brlt .+2
	rjmp .L17
	movw r22,r24
	mov __tmp_reg__,r23
	lsl r0
	sbc r24,r24
	sbc r25,r25
	call __floatsisf
	ldi r18,0
	ldi r19,lo8(-64)
	ldi r20,lo8(127)
	ldi r21,lo8(68)
	call __divsf3
	ldi r18,0
	ldi r19,0
	ldi r20,lo8(-96)
	ldi r21,lo8(64)
	call __mulsf3
	movw r12,r22
	movw r14,r24
	ldi r18,lo8(111)
	ldi r19,lo8(18)
	ldi r20,lo8(-125)
	ldi r21,lo8(58)
	call __ltsf2
	sbrs r24,7
	rjmp .L11
	ldi r19,lo8(111)
	mov r12,r19
	ldi r19,lo8(18)
	mov r13,r19
	ldi r19,lo8(-125)
	mov r14,r19
	ldi r19,lo8(58)
	mov r15,r19
.L11:
	movw r20,r14
	movw r18,r12
	ldi r22,0
	ldi r23,0
	ldi r24,lo8(-96)
	ldi r25,lo8(64)
	call __subsf3
	movw r20,r14
	movw r18,r12
	call __divsf3
	ldi r18,0
	ldi r19,lo8(64)
	ldi r20,lo8(-100)
	ldi r21,lo8(69)
	call __mulsf3
	movw r12,r22
	movw r14,r24
	ldi r18,0
	ldi r19,0
	ldi r20,lo8(-128)
	ldi r21,lo8(63)
	call __ltsf2
	sbrs r24,7
	rjmp .L13
	mov r12,__zero_reg__
	mov r13,__zero_reg__
	ldi r18,lo8(-128)
	mov r14,r18
	ldi r18,lo8(63)
	mov r15,r18
.L13:
	ldi r18,lo8(-62)
	ldi r19,lo8(47)
	ldi r20,lo8(-107)
	ldi r21,lo8(-65)
	movw r24,r14
	movw r22,r12
	call pow
	ldi r18,lo8(30)
	ldi r19,lo8(72)
	ldi r20,lo8(89)
	ldi r21,lo8(73)
	call __mulsf3
	movw r12,r22
	movw r14,r24
	ldi r18,0
	ldi r19,0
	ldi r20,lo8(-128)
	ldi r21,lo8(63)
	call __ltsf2
	sbrc r24,7
	rjmp .L18
	ldi r18,0
	ldi r19,lo8(-64)
	ldi r20,lo8(121)
	ldi r21,lo8(68)
	movw r24,r14
	movw r22,r12
	call __gtsf2
	cp __zero_reg__,r24
	brge .L15
	mov r12,__zero_reg__
	ldi r25,lo8(-64)
	mov r13,r25
	ldi r25,lo8(121)
	mov r14,r25
	ldi r25,lo8(68)
	mov r15,r25
.L15:
	ldi r18,0
	ldi r19,0
	ldi r20,0
	ldi r21,lo8(63)
	movw r24,r14
	movw r22,r12
	call __addsf3
	call __fixunssfsi
	movw r24,r22
.L9:
/* epilogue start */
	pop r15
	pop r14
	pop r13
	pop r12
	ret
.L18:
	mov r12,__zero_reg__
	mov r13,__zero_reg__
	ldi r24,lo8(-128)
	mov r14,r24
	ldi r24,lo8(63)
	mov r15,r24
	rjmp .L15
.L17:
	ldi r24,lo8(-25)
	ldi r25,lo8(3)
	rjmp .L9
	.size	adc_to_lux, .-adc_to_lux
	.section	.text.FuncSensorTask,"ax",@progbits
.global	FuncSensorTask
	.type	FuncSensorTask, @function
FuncSensorTask:
	push r12
	push r13
	push r14
	push r15
	push r16
	push r17
	push r28
	push r29
/* prologue: function */
/* frame size = 0 */
/* stack size = 8 */
.L__stack_usage = 8
	ldi r24,lo8(14)
	call analogRead
	movw r14,r24
	ldi r24,lo8(15)
	call analogRead
	movw r16,r24
	movw r24,r14
	call adc_to_lux
	movw r28,r24
	movw r24,r16
	call adc_to_lux
	movw r12,r24
	ldi r24,lo8(3)
	call GetResource
	ldi r30,lo8(_ZL13g_sensor_data)
	ldi r31,hi8(_ZL13g_sensor_data)
	ld r18,Z
	ldd r19,Z+1
	add r18,r28
	adc r19,r29
	lsr r19
	ror r18
	ldd r24,Z+2
	ldd r25,Z+3
	add r12,r24
	adc r13,r25
	lsr r13
	ror r12
	std Z+1,r19
	st Z,r18
	std Z+3,r13
	std Z+2,r12
	add r18,r12
	adc r19,r13
	lsr r19
	ror r18
	std Z+5,r19
	std Z+4,r18
	std Z+7,r15
	std Z+6,r14
	std Z+9,r17
	std Z+8,r16
	ldi r24,lo8(1)
	std Z+10,r24
	ldi r24,lo8(3)
	call ReleaseResource
	ldi r22,lo8(2)
	ldi r23,0
	ldi r24,lo8(2)
	call SetEvent
	ldi r22,lo8(1)
	ldi r23,0
	ldi r24,lo8(3)
	call SetEvent
/* epilogue start */
	pop r29
	pop r28
	pop r17
	pop r16
	pop r15
	pop r14
	pop r13
	pop r12
	jmp TerminateTask
	.size	FuncSensorTask, .-FuncSensorTask
	.section	.text.FuncServoControlTask,"ax",@progbits
.global	FuncServoControlTask
	.type	FuncServoControlTask, @function
FuncServoControlTask:
	push r28
	push r29
	rcall .
	in r28,__SP_L__
	in r29,__SP_H__
/* prologue: function */
/* frame size = 2 */
/* stack size = 4 */
.L__stack_usage = 4
	lds r24,_ZL18servos_initialized
	cpse r24,__zero_reg__
	rjmp .L25
	ldi r22,lo8(9)
	ldi r23,0
	ldi r24,lo8(_ZL6servoW)
	ldi r25,hi8(_ZL6servoW)
	call _ZN11ServoTimer26attachEi
	ldi r22,lo8(10)
	ldi r23,0
	ldi r24,lo8(_ZL6servoE)
	ldi r25,hi8(_ZL6servoE)
	call _ZN11ServoTimer26attachEi
	ldi r24,lo8(1)
	sts _ZL18servos_initialized,r24
.L25:
	ldi r24,lo8(2)
	ldi r25,0
	call WaitEvent
	movw r22,r28
	subi r22,-1
	sbci r23,-1
	ldi r24,lo8(2)
	call GetEvent
	ldd r24,Y+1
	sbrs r24,1
	rjmp .L25
	ldi r24,lo8(3)
	call GetResource
	lds r14,_ZL13g_sensor_data
	lds r15,_ZL13g_sensor_data+1
	lds r16,_ZL13g_sensor_data+2
	lds r17,_ZL13g_sensor_data+2+1
	ldi r24,lo8(1)
	ldi r25,-12
	cp r14,r25
	ldi r25,1
	cpc r15,r25
	brsh .L26
	ldi r24,0
.L26:
	sts _ZL13g_sensor_data+13,r24
	ldi r24,lo8(1)
	cpi r16,-12
	ldi r25,1
	cpc r17,r25
	brsh .L27
	ldi r24,0
.L27:
	sts _ZL13g_sensor_data+14,r24
	ldi r24,lo8(3)
	call ReleaseResource
	ldi r24,-12
	cp r14,r24
	ldi r24,1
	cpc r15,r24
	brlo .+2
	rjmp .L35
	ldi r25,lo8(-18)
	mov r14,r25
	ldi r25,lo8(2)
	mov r15,r25
.L28:
	cpi r16,-12
	sbci r17,1
	brlo .+2
	rjmp .L36
	ldi r16,lo8(-18)
	ldi r17,lo8(2)
.L29:
	ldi r24,lo8(4)
	call GetResource
	sts _ZL11west_target+1,r15
	sts _ZL11west_target,r14
	sts _ZL11east_target+1,r17
	sts _ZL11east_target,r16
	ldi r24,lo8(4)
	call ReleaseResource
	ldi r24,lo8(4)
	call GetResource
	lds r24,_ZL8west_pos
	lds r25,_ZL8west_pos+1
	lds r18,_ZL11west_target
	lds r19,_ZL11west_target+1
	cp r24,r18
	cpc r25,r19
	brge .L30
	adiw r24,15
	sts _ZL8west_pos+1,r25
	sts _ZL8west_pos,r24
.L30:
	lds r24,_ZL8west_pos
	lds r25,_ZL8west_pos+1
	cp r18,r24
	cpc r19,r25
	brge .L31
	sbiw r24,15
	sts _ZL8west_pos+1,r25
	sts _ZL8west_pos,r24
.L31:
	lds r24,_ZL8east_pos
	lds r25,_ZL8east_pos+1
	lds r18,_ZL11east_target
	lds r19,_ZL11east_target+1
	cp r24,r18
	cpc r25,r19
	brge .L32
	adiw r24,15
	sts _ZL8east_pos+1,r25
	sts _ZL8east_pos,r24
.L32:
	lds r24,_ZL8east_pos
	lds r25,_ZL8east_pos+1
	cp r18,r24
	cpc r19,r25
	brge .L33
	sbiw r24,15
	sts _ZL8east_pos+1,r25
	sts _ZL8east_pos,r24
.L33:
	lds r22,_ZL8west_pos
	lds r23,_ZL8west_pos+1
	ldi r24,lo8(_ZL6servoW)
	ldi r25,hi8(_ZL6servoW)
	call _ZN11ServoTimer25writeEi
	lds r22,_ZL8east_pos
	lds r23,_ZL8east_pos+1
	ldi r24,lo8(_ZL6servoE)
	ldi r25,hi8(_ZL6servoE)
	call _ZN11ServoTimer25writeEi
	ldi r24,lo8(4)
	call ReleaseResource
	ldi r24,lo8(2)
	ldi r25,0
	call ClearEvent
	rjmp .L25
.L35:
	ldi r24,lo8(-54)
	mov r14,r24
	ldi r24,lo8(8)
	mov r15,r24
	rjmp .L28
.L36:
	ldi r16,lo8(-54)
	ldi r17,lo8(8)
	rjmp .L29
	.size	FuncServoControlTask, .-FuncServoControlTask
	.section	.text.FuncLEDControlTask,"ax",@progbits
.global	FuncLEDControlTask
	.type	FuncLEDControlTask, @function
FuncLEDControlTask:
	push r28
	push r29
	rcall .
	in r28,__SP_L__
	in r29,__SP_H__
/* prologue: function */
/* frame size = 2 */
/* stack size = 4 */
.L__stack_usage = 4
.L40:
	ldi r24,lo8(1)
	ldi r25,0
	call WaitEvent
	movw r22,r28
	subi r22,-1
	sbci r23,-1
	ldi r24,lo8(3)
	call GetEvent
	ldd r24,Y+1
	sbrs r24,0
	rjmp .L40
	ldi r24,lo8(2)
	call GetResource
	ldi r24,lo8(3)
	call GetResource
	call is_night_time
	ldi r17,lo8(1)
	ldi r16,lo8(1)
	cpse r24,__zero_reg__
	rjmp .L41
	ldi r16,lo8(1)
	lds r24,_ZL13g_sensor_data
	lds r25,_ZL13g_sensor_data+1
	cpi r24,-55
	cpc r25,__zero_reg__
	brlo .L42
	ldi r16,0
.L42:
	ldi r17,lo8(1)
	lds r24,_ZL13g_sensor_data+2
	lds r25,_ZL13g_sensor_data+2+1
	cpi r24,-55
	cpc r25,__zero_reg__
	brlo .L41
	ldi r17,0
.L41:
	mov r22,r16
	ldi r24,lo8(4)
	call digitalWrite
	mov r22,r17
	ldi r24,lo8(7)
	call digitalWrite
	sts _ZL13g_sensor_data+11,r16
	sts _ZL13g_sensor_data+12,r17
	ldi r24,lo8(3)
	call ReleaseResource
	ldi r24,lo8(2)
	call ReleaseResource
	ldi r24,lo8(1)
	ldi r25,0
	call ClearEvent
	rjmp .L40
	.size	FuncLEDControlTask, .-FuncLEDControlTask
	.section	.rodata.FuncDisplayTask.str1.1,"aMS",@progbits,1
.LC0:
	.string	"OPN"
.LC1:
	.string	"CLS"
.LC2:
	.string	"ON"
.LC3:
	.string	"OFF"
.LC4:
	.string	"WEST"
.LC5:
	.string	"<-- SUN"
.LC6:
	.string	"EAST"
.LC7:
	.string	"SUN -->"
.LC8:
	.string	"CENTER"
.LC9:
	.string	"SUN CENTER"
.LC10:
	.string	"ON "
.LC11:
	.string	"W:%3d E:%3d Avg:%3d"
.LC12:
	.string	"   "
.LC13:
	.string	"Shade W:%s E:%s"
.LC14:
	.string	"      "
.LC15:
	.string	"Light W:%s E:%s"
.LC16:
	.string	"Time %02d:%02d:%02d"
.LC17:
	.string	"     "
.LC18:
	.string	"Sun Tracker       "
.LC19:
	.string	"             "
.LC20:
	.string	"Pos:%s D:%d"
.LC21:
	.string	"        "
.LC22:
	.string	"Night:%s"
.LC23:
	.string	"            "
	.section	.text.FuncDisplayTask,"ax",@progbits
.global	FuncDisplayTask
	.type	FuncDisplayTask, @function
FuncDisplayTask:
	push r8
	push r9
	push r10
	push r11
	push r12
	push r13
	push r14
	push r15
	push r16
	push r17
	push r28
	push r29
	in r28,__SP_L__
	in r29,__SP_H__
	sbiw r28,21
	in __tmp_reg__,__SREG__
	cli
	out __SP_H__,r29
	out __SREG__,__tmp_reg__
	out __SP_L__,r28
/* prologue: function */
/* frame size = 21 */
/* stack size = 33 */
.L__stack_usage = 33
	ldi r24,lo8(3)
	call GetResource
	lds r24,_ZL13g_sensor_data+10
	tst r24
	brne .+2
	rjmp .L56
	lds r14,_ZL13g_sensor_data
	lds r15,_ZL13g_sensor_data+1
	lds r12,_ZL13g_sensor_data+2
	lds r13,_ZL13g_sensor_data+2+1
	lds r17,_ZL13g_sensor_data+4
	lds r16,_ZL13g_sensor_data+5
	lds r11,_ZL13g_sensor_data+11
	lds r10,_ZL13g_sensor_data+12
	lds r9,_ZL13g_sensor_data+13
	lds r8,_ZL13g_sensor_data+14
.L49:
	ldi r24,lo8(3)
	call ReleaseResource
	ldi r24,lo8(1)
	call GetResource
	push r16
	push r17
	push r13
	push r12
	push r15
	push r14
	ldi r24,lo8(.LC11)
	ldi r25,hi8(.LC11)
	push r25
	push r24
	movw r16,r28
	subi r16,-1
	sbci r17,-1
	push r17
	push r16
	call sprintf
	ldi r20,0
	ldi r22,0
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN13LiquidCrystal9setCursorEhh
	movw r22,r16
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN5Print5printEPKc
	ldi r22,lo8(.LC12)
	ldi r23,hi8(.LC12)
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN5Print5printEPKc
	in __tmp_reg__,__SREG__
	cli
	out __SP_H__,r29
	out __SREG__,__tmp_reg__
	out __SP_L__,r28
	ldi r18,lo8(.LC1)
	ldi r19,hi8(.LC1)
	tst r8
	breq .L50
	ldi r18,lo8(.LC0)
	ldi r19,hi8(.LC0)
.L50:
	ldi r24,lo8(.LC1)
	ldi r25,hi8(.LC1)
	tst r9
	breq .L51
	ldi r24,lo8(.LC0)
	ldi r25,hi8(.LC0)
.L51:
	push r19
	push r18
	push r25
	push r24
	ldi r24,lo8(.LC13)
	ldi r25,hi8(.LC13)
	push r25
	push r24
	push r17
	push r16
	call sprintf
	ldi r20,lo8(1)
	ldi r22,0
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN13LiquidCrystal9setCursorEhh
	movw r22,r16
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN5Print5printEPKc
	ldi r22,lo8(.LC14)
	ldi r23,hi8(.LC14)
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN5Print5printEPKc
	in __tmp_reg__,__SREG__
	cli
	out __SP_H__,r29
	out __SREG__,__tmp_reg__
	out __SP_L__,r28
	ldi r18,lo8(.LC3)
	ldi r19,hi8(.LC3)
	tst r10
	breq .L52
	ldi r18,lo8(.LC2)
	ldi r19,hi8(.LC2)
.L52:
	ldi r24,lo8(.LC3)
	ldi r25,hi8(.LC3)
	tst r11
	breq .L53
	ldi r24,lo8(.LC2)
	ldi r25,hi8(.LC2)
.L53:
	push r19
	push r18
	push r25
	push r24
	ldi r24,lo8(.LC15)
	ldi r25,hi8(.LC15)
	push r25
	push r24
	push r17
	push r16
	call sprintf
	ldi r20,lo8(2)
	ldi r22,0
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN13LiquidCrystal9setCursorEhh
	movw r22,r16
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN5Print5printEPKc
	ldi r22,lo8(.LC12)
	ldi r23,hi8(.LC12)
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN5Print5printEPKc
	lds r24,_ZL7seconds+1
	push r24
	lds r24,_ZL7seconds
	push r24
	lds r24,_ZL7minutes+1
	push r24
	lds r24,_ZL7minutes
	push r24
	lds r24,_ZL5hours+1
	push r24
	lds r24,_ZL5hours
	push r24
	ldi r24,lo8(.LC16)
	ldi r25,hi8(.LC16)
	push r25
	push r24
	push r17
	push r16
	call sprintf
	ldi r20,lo8(3)
	ldi r22,0
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN13LiquidCrystal9setCursorEhh
	movw r22,r16
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN5Print5printEPKc
	ldi r22,lo8(.LC17)
	ldi r23,hi8(.LC17)
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN5Print5printEPKc
	sub r14,r12
	sbc r15,r13
	in __tmp_reg__,__SREG__
	cli
	out __SP_H__,r29
	out __SREG__,__tmp_reg__
	out __SP_L__,r28
	ldi r18,lo8(.LC4)
	mov r12,r18
	ldi r18,hi8(.LC4)
	mov r13,r18
	ldi r19,lo8(.LC5)
	mov r10,r19
	ldi r19,hi8(.LC5)
	mov r11,r19
	ldi r19,51
	cp r14,r19
	cpc r15,__zero_reg__
	brge .L54
	ldi r20,lo8(.LC8)
	mov r12,r20
	ldi r20,hi8(.LC8)
	mov r13,r20
	ldi r21,lo8(.LC9)
	mov r10,r21
	ldi r21,hi8(.LC9)
	mov r11,r21
	ldi r24,-50
	cp r14,r24
	ldi r24,-1
	cpc r15,r24
	brge .L54
	ldi r24,lo8(.LC6)
	mov r12,r24
	ldi r24,hi8(.LC6)
	mov r13,r24
	ldi r25,lo8(.LC7)
	mov r10,r25
	ldi r25,hi8(.LC7)
	mov r11,r25
.L54:
	ldi r20,0
	ldi r22,0
	ldi r24,lo8(lcd2)
	ldi r25,hi8(lcd2)
	call _ZN13LiquidCrystal9setCursorEhh
	ldi r22,lo8(.LC18)
	ldi r23,hi8(.LC18)
	ldi r24,lo8(lcd2)
	ldi r25,hi8(lcd2)
	call _ZN5Print5printEPKc
	ldi r20,lo8(1)
	ldi r22,0
	ldi r24,lo8(lcd2)
	ldi r25,hi8(lcd2)
	call _ZN13LiquidCrystal9setCursorEhh
	movw r22,r10
	ldi r24,lo8(lcd2)
	ldi r25,hi8(lcd2)
	call _ZN5Print5printEPKc
	ldi r22,lo8(.LC19)
	ldi r23,hi8(.LC19)
	ldi r24,lo8(lcd2)
	ldi r25,hi8(lcd2)
	call _ZN5Print5printEPKc
	push r15
	push r14
	push r13
	push r12
	ldi r24,lo8(.LC20)
	ldi r25,hi8(.LC20)
	push r25
	push r24
	push r17
	push r16
	call sprintf
	ldi r20,lo8(2)
	ldi r22,0
	ldi r24,lo8(lcd2)
	ldi r25,hi8(lcd2)
	call _ZN13LiquidCrystal9setCursorEhh
	movw r22,r16
	ldi r24,lo8(lcd2)
	ldi r25,hi8(lcd2)
	call _ZN5Print5printEPKc
	ldi r22,lo8(.LC21)
	ldi r23,hi8(.LC21)
	ldi r24,lo8(lcd2)
	ldi r25,hi8(lcd2)
	call _ZN5Print5printEPKc
	call is_night_time
	in __tmp_reg__,__SREG__
	cli
	out __SP_H__,r29
	out __SREG__,__tmp_reg__
	out __SP_L__,r28
	cpse r24,__zero_reg__
	rjmp .L63
	ldi r24,lo8(.LC3)
	ldi r25,hi8(.LC3)
.L55:
	push r25
	push r24
	ldi r24,lo8(.LC22)
	ldi r25,hi8(.LC22)
	push r25
	push r24
	push r17
	push r16
	call sprintf
	ldi r20,lo8(3)
	ldi r22,0
	ldi r24,lo8(lcd2)
	ldi r25,hi8(lcd2)
	call _ZN13LiquidCrystal9setCursorEhh
	movw r22,r16
	ldi r24,lo8(lcd2)
	ldi r25,hi8(lcd2)
	call _ZN5Print5printEPKc
	ldi r22,lo8(.LC23)
	ldi r23,hi8(.LC23)
	ldi r24,lo8(lcd2)
	ldi r25,hi8(lcd2)
	call _ZN5Print5printEPKc
	ldi r24,lo8(1)
	call ReleaseResource
	call TerminateTask
	pop __tmp_reg__
	pop __tmp_reg__
	pop __tmp_reg__
	pop __tmp_reg__
	pop __tmp_reg__
	pop __tmp_reg__
/* epilogue start */
	adiw r28,21
	in __tmp_reg__,__SREG__
	cli
	out __SP_H__,r29
	out __SREG__,__tmp_reg__
	out __SP_L__,r28
	pop r29
	pop r28
	pop r17
	pop r16
	pop r15
	pop r14
	pop r13
	pop r12
	pop r11
	pop r10
	pop r9
	pop r8
	ret
.L56:
	mov r8,__zero_reg__
	mov r9,__zero_reg__
	mov r10,__zero_reg__
	mov r11,__zero_reg__
	ldi r17,0
	ldi r16,0
	mov r13,__zero_reg__
	mov r12,__zero_reg__
	mov r15,__zero_reg__
	mov r14,__zero_reg__
	rjmp .L49
.L63:
	ldi r24,lo8(.LC10)
	ldi r25,hi8(.LC10)
	rjmp .L55
	.size	FuncDisplayTask, .-FuncDisplayTask
	.section	.text.FuncClockTask,"ax",@progbits
.global	FuncClockTask
	.type	FuncClockTask, @function
FuncClockTask:
/* prologue: function */
/* frame size = 0 */
/* stack size = 0 */
.L__stack_usage = 0
	lds r24,_ZL7seconds
	lds r25,_ZL7seconds+1
	adiw r24,1
	sts _ZL7seconds+1,r25
	sts _ZL7seconds,r24
	sbiw r24,60
	brlt .L65
	lds r24,_ZL7minutes
	lds r25,_ZL7minutes+1
	sts _ZL7seconds+1,__zero_reg__
	sts _ZL7seconds,__zero_reg__
	adiw r24,1
	sts _ZL7minutes+1,r25
	sts _ZL7minutes,r24
.L65:
	lds r24,_ZL7minutes
	lds r25,_ZL7minutes+1
	sbiw r24,60
	brlt .L66
	lds r24,_ZL5hours
	lds r25,_ZL5hours+1
	sts _ZL7minutes+1,__zero_reg__
	sts _ZL7minutes,__zero_reg__
	adiw r24,1
	sts _ZL5hours+1,r25
	sts _ZL5hours,r24
.L66:
	lds r24,_ZL5hours
	lds r25,_ZL5hours+1
	sbiw r24,24
	brlt .L67
	sts _ZL5hours+1,__zero_reg__
	sts _ZL5hours,__zero_reg__
.L67:
	ldi r22,lo8(1)
	ldi r23,0
	ldi r24,lo8(3)
	call SetEvent
	jmp TerminateTask
	.size	FuncClockTask, .-FuncClockTask
	.section	.text.startup._GLOBAL__sub_I_FuncSensorTask,"ax",@progbits
	.type	_GLOBAL__sub_I_FuncSensorTask, @function
_GLOBAL__sub_I_FuncSensorTask:
/* prologue: function */
/* frame size = 0 */
/* stack size = 0 */
.L__stack_usage = 0
	ldi r24,lo8(_ZL6servoW)
	ldi r25,hi8(_ZL6servoW)
	call _ZN11ServoTimer2C1Ev
	ldi r24,lo8(_ZL6servoE)
	ldi r25,hi8(_ZL6servoE)
	jmp _ZN11ServoTimer2C1Ev
	.size	_GLOBAL__sub_I_FuncSensorTask, .-_GLOBAL__sub_I_FuncSensorTask
	.global __do_global_ctors
	.section .ctors,"a",@progbits
	.p2align	1
	.word	gs(_GLOBAL__sub_I_FuncSensorTask)
	.section	.data._ZL7seconds,"aw",@progbits
	.type	_ZL7seconds, @object
	.size	_ZL7seconds, 2
_ZL7seconds:
	.word	30
	.section	.data._ZL7minutes,"aw",@progbits
	.type	_ZL7minutes, @object
	.size	_ZL7minutes, 2
_ZL7minutes:
	.word	29
	.section	.data._ZL5hours,"aw",@progbits
	.type	_ZL5hours, @object
	.size	_ZL5hours, 2
_ZL5hours:
	.word	7
	.section	.bss._ZL13g_sensor_data,"aw",@nobits
	.type	_ZL13g_sensor_data, @object
	.size	_ZL13g_sensor_data, 15
_ZL13g_sensor_data:
	.zero	15
	.section	.bss._ZL18servos_initialized,"aw",@nobits
	.type	_ZL18servos_initialized, @object
	.size	_ZL18servos_initialized, 1
_ZL18servos_initialized:
	.zero	1
	.section	.data._ZL11east_target,"aw",@progbits
	.type	_ZL11east_target, @object
	.size	_ZL11east_target, 2
_ZL11east_target:
	.word	750
	.section	.data._ZL11west_target,"aw",@progbits
	.type	_ZL11west_target, @object
	.size	_ZL11west_target, 2
_ZL11west_target:
	.word	750
	.section	.data._ZL8east_pos,"aw",@progbits
	.type	_ZL8east_pos, @object
	.size	_ZL8east_pos, 2
_ZL8east_pos:
	.word	750
	.section	.data._ZL8west_pos,"aw",@progbits
	.type	_ZL8west_pos, @object
	.size	_ZL8west_pos, 2
_ZL8west_pos:
	.word	750
	.section	.bss._ZL6servoE,"aw",@nobits
	.type	_ZL6servoE, @object
	.size	_ZL6servoE, 1
_ZL6servoE:
	.zero	1
	.section	.bss._ZL6servoW,"aw",@nobits
	.type	_ZL6servoW, @object
	.size	_ZL6servoW, 1
_ZL6servoW:
	.zero	1
	.ident	"GCC: (GNU) 7.3.0"
.global __do_copy_data
.global __do_clear_bss
