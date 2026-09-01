	.file	"code.cpp"
__SP_H__ = 0x3e
__SP_L__ = 0x3d
__SREG__ = 0x3f
__tmp_reg__ = 0
__zero_reg__ = 1
	.text
	.section	.rodata.StartupHook.str1.1,"aMS",@progbits,1
.LC0:
	.string	"Bus-Stop Shade"
.LC1:
	.string	"& Street Light"
.LC2:
	.string	"Controller Sys"
.LC3:
	.string	"v2.0 - 5 Tasks"
.LC4:
	.string	"Sun Tracker"
.LC5:
	.string	"System Ready"
.LC6:
	.string	"5-Task OSEK"
	.section	.text.StartupHook,"ax",@progbits
.global	StartupHook
	.type	StartupHook, @function
StartupHook:
/* prologue: function */
/* frame size = 0 */
/* stack size = 0 */
.L__stack_usage = 0
	ldi r22,lo8(1)
	ldi r24,lo8(4)
	call pinMode
	ldi r22,lo8(1)
	ldi r24,lo8(7)
	call pinMode
	ldi r22,0
	ldi r24,lo8(4)
	call digitalWrite
	ldi r22,0
	ldi r24,lo8(7)
	call digitalWrite
	ldi r18,0
	ldi r20,lo8(4)
	ldi r22,lo8(20)
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN13LiquidCrystal5beginEhhh
	ldi r18,0
	ldi r20,lo8(4)
	ldi r22,lo8(20)
	ldi r24,lo8(lcd2)
	ldi r25,hi8(lcd2)
	call _ZN13LiquidCrystal5beginEhhh
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN13LiquidCrystal5clearEv
	ldi r24,lo8(lcd2)
	ldi r25,hi8(lcd2)
	call _ZN13LiquidCrystal5clearEv
	ldi r20,0
	ldi r22,0
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN13LiquidCrystal9setCursorEhh
	ldi r22,lo8(.LC0)
	ldi r23,hi8(.LC0)
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN5Print5printEPKc
	ldi r20,lo8(1)
	ldi r22,0
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN13LiquidCrystal9setCursorEhh
	ldi r22,lo8(.LC1)
	ldi r23,hi8(.LC1)
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN5Print5printEPKc
	ldi r20,lo8(2)
	ldi r22,0
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN13LiquidCrystal9setCursorEhh
	ldi r22,lo8(.LC2)
	ldi r23,hi8(.LC2)
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN5Print5printEPKc
	ldi r20,lo8(3)
	ldi r22,0
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN13LiquidCrystal9setCursorEhh
	ldi r22,lo8(.LC3)
	ldi r23,hi8(.LC3)
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN5Print5printEPKc
	ldi r20,0
	ldi r22,0
	ldi r24,lo8(lcd2)
	ldi r25,hi8(lcd2)
	call _ZN13LiquidCrystal9setCursorEhh
	ldi r22,lo8(.LC4)
	ldi r23,hi8(.LC4)
	ldi r24,lo8(lcd2)
	ldi r25,hi8(lcd2)
	call _ZN5Print5printEPKc
	ldi r20,lo8(1)
	ldi r22,0
	ldi r24,lo8(lcd2)
	ldi r25,hi8(lcd2)
	call _ZN13LiquidCrystal9setCursorEhh
	ldi r22,lo8(.LC5)
	ldi r23,hi8(.LC5)
	ldi r24,lo8(lcd2)
	ldi r25,hi8(lcd2)
	call _ZN5Print5printEPKc
	ldi r20,lo8(2)
	ldi r22,0
	ldi r24,lo8(lcd2)
	ldi r25,hi8(lcd2)
	call _ZN13LiquidCrystal9setCursorEhh
	ldi r22,lo8(.LC6)
	ldi r23,hi8(.LC6)
	ldi r24,lo8(lcd2)
	ldi r25,hi8(lcd2)
	call _ZN5Print5printEPKc
	ldi r22,lo8(-48)
	ldi r23,lo8(7)
	ldi r24,0
	ldi r25,0
	call delay
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN13LiquidCrystal5clearEv
	ldi r24,lo8(lcd2)
	ldi r25,hi8(lcd2)
	call _ZN13LiquidCrystal5clearEv
	ldi r20,lo8(100)
	ldi r21,0
	ldi r22,lo8(10)
	ldi r23,0
	ldi r24,0
	call SetRelAlarm
	ldi r20,lo8(-12)
	ldi r21,lo8(1)
	ldi r22,lo8(20)
	ldi r23,0
	ldi r24,lo8(1)
	jmp SetRelAlarm
	.size	StartupHook, .-StartupHook
	.section	.text.idle_hook,"ax",@progbits
.global	idle_hook
	.type	idle_hook, @function
idle_hook:
	push r28
	push r29
	rcall .
	in r28,__SP_L__
	in r29,__SP_H__
/* prologue: function */
/* frame size = 2 */
/* stack size = 4 */
.L__stack_usage = 4
	in r24,__SP_L__
	in r25,__SP_L__+1
	std Y+2,r25
	std Y+1,r24
	lds r24,main_sp
	lds r25,main_sp+1
	or r24,r25
	brne .L2
	ldd r24,Y+1
	ldd r25,Y+2
	sts main_sp+1,r25
	sts main_sp,r24
.L2:
/* epilogue start */
	pop __tmp_reg__
	pop __tmp_reg__
	pop r29
	pop r28
	ret
	.size	idle_hook, .-idle_hook
	.section	.text.setup,"ax",@progbits
.global	setup
	.type	setup, @function
setup:
/* prologue: function */
/* frame size = 0 */
/* stack size = 0 */
.L__stack_usage = 0
	ldi r18,lo8(6)
	ldi r20,0
	ldi r21,lo8(-62)
	ldi r22,lo8(1)
	ldi r23,0
	ldi r24,lo8(Serial)
	ldi r25,hi8(Serial)
	jmp _ZN14HardwareSerial5beginEmh
	.size	setup, .-setup
	.section	.text.startup.main,"ax",@progbits
.global	main
	.type	main, @function
main:
/* prologue: function */
/* frame size = 0 */
/* stack size = 0 */
.L__stack_usage = 0
	call init
	call setup
	ldi r24,0
	call StartOS
	ldi r25,0
	ldi r24,0
/* epilogue start */
	ret
	.size	main, .-main
	.section	.text.startup._GLOBAL__sub_I_lcd,"ax",@progbits
	.type	_GLOBAL__sub_I_lcd, @function
_GLOBAL__sub_I_lcd:
	push r12
	push r14
	push r16
/* prologue: function */
/* frame size = 0 */
/* stack size = 3 */
.L__stack_usage = 3
	ldi r24,lo8(13)
	mov r12,r24
	ldi r25,lo8(8)
	mov r14,r25
	ldi r16,lo8(6)
	ldi r18,lo8(5)
	ldi r20,lo8(11)
	ldi r22,lo8(12)
	ldi r24,lo8(lcd)
	ldi r25,hi8(lcd)
	call _ZN13LiquidCrystalC1Ehhhhhh
	ldi r18,lo8(19)
	mov r12,r18
	ldi r19,lo8(18)
	mov r14,r19
	ldi r16,lo8(17)
	ldi r18,lo8(16)
	ldi r20,lo8(3)
	ldi r22,lo8(2)
	ldi r24,lo8(lcd2)
	ldi r25,hi8(lcd2)
	call _ZN13LiquidCrystalC1Ehhhhhh
/* epilogue start */
	pop r16
	pop r14
	pop r12
	ret
	.size	_GLOBAL__sub_I_lcd, .-_GLOBAL__sub_I_lcd
	.global __do_global_ctors
	.section .ctors,"a",@progbits
	.p2align	1
	.word	gs(_GLOBAL__sub_I_lcd)
.global	main_sp
	.section	.bss.main_sp,"aw",@nobits
	.type	main_sp, @object
	.size	main_sp, 2
main_sp:
	.zero	2
.global	lcd2
	.section	.bss.lcd2,"aw",@nobits
	.type	lcd2, @object
	.size	lcd2, 24
lcd2:
	.zero	24
.global	lcd
	.section	.bss.lcd,"aw",@nobits
	.type	lcd, @object
	.size	lcd, 24
lcd:
	.zero	24
	.ident	"GCC: (GNU) 7.3.0"
.global __do_copy_data
.global __do_clear_bss
