	.file	"debug.cpp"
__SP_H__ = 0x3e
__SP_L__ = 0x3d
__SREG__ = 0x3f
__tmp_reg__ = 0
__zero_reg__ = 1
	.text
	.section	.text.serial_print,"ax",@progbits
.global	serial_print
	.type	serial_print, @function
serial_print:
/* prologue: function */
/* frame size = 0 */
/* stack size = 0 */
.L__stack_usage = 0
/* #APP */
 ;  17 "/home/user/Osek/OSEK-GroupProject/debug.cpp" 1
	cli
 ;  0 "" 2
/* #NOAPP */
	movw r30,r24
	0:
	ld __tmp_reg__,Z+
	tst __tmp_reg__
	brne 0b
	sbiw r30,1
	movw r20,r30
	sub r20,r24
	sbc r21,r25
	movw r22,r24
	ldi r24,lo8(Serial)
	ldi r25,hi8(Serial)
	call _ZN5Print5writeEPKhj
/* #APP */
 ;  22 "/home/user/Osek/OSEK-GroupProject/debug.cpp" 1
	sei
 ;  0 "" 2
/* epilogue start */
/* #NOAPP */
	ret
	.size	serial_print, .-serial_print
	.ident	"GCC: (GNU) 7.3.0"
