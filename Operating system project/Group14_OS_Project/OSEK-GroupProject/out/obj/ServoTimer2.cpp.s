	.file	"ServoTimer2.cpp"
__SP_H__ = 0x3e
__SP_L__ = 0x3d
__SREG__ = 0x3f
__tmp_reg__ = 0
__zero_reg__ = 1
	.text
	.section	.text.__vector_9,"ax",@progbits
.global	__vector_9
	.type	__vector_9, @function
__vector_9:
	push r1
	push r0
	in r0,__SREG__
	push r0
	clr __zero_reg__
	push r18
	push r19
	push r20
	push r21
	push r22
	push r23
	push r24
	push r25
	push r26
	push r27
	push r30
	push r31
/* prologue: Signal */
/* frame size = 0 */
/* stack size = 15 */
.L__stack_usage = 15
	lds r24,_ZL8ISRCount
	subi r24,lo8(-(1))
	sts _ZL8ISRCount,r24
	lds r30,_ZL7Channel
	lds r18,_ZL8ISRCount
	mov r24,r30
	ldi r25,0
	movw r30,r24
	lsl r30
	rol r31
	add r30,r24
	adc r31,r25
	subi r30,lo8(-(_ZL6servos))
	sbci r31,hi8(-(_ZL6servos))
	ldd r24,Z+1
	lds r30,_ZL7Channel
	cpse r24,r18
	rjmp .L2
	mov r24,r30
	ldi r25,0
	movw r30,r24
	lsl r30
	rol r31
	add r30,r24
	adc r31,r25
	subi r30,lo8(-(_ZL6servos))
	sbci r31,hi8(-(_ZL6servos))
	ldd r24,Z+2
	sts 178,r24
.L1:
/* epilogue start */
	pop r31
	pop r30
	pop r27
	pop r26
	pop r25
	pop r24
	pop r23
	pop r22
	pop r21
	pop r20
	pop r19
	pop r18
	pop r0
	out __SREG__,r0
	pop r0
	pop r1
	reti
.L2:
	lds r18,_ZL8ISRCount
	mov r24,r30
	ldi r25,0
	movw r30,r24
	lsl r30
	rol r31
	add r30,r24
	adc r31,r25
	subi r30,lo8(-(_ZL6servos))
	sbci r31,hi8(-(_ZL6servos))
	ldd r24,Z+1
	cp r24,r18
	brsh .L1
	lds r30,_ZL7Channel
	mov r24,r30
	ldi r25,0
	movw r30,r24
	lsl r30
	rol r31
	add r30,r24
	adc r31,r25
	subi r30,lo8(-(_ZL6servos))
	sbci r31,hi8(-(_ZL6servos))
	ld r24,Z
	sbrs r24,5
	rjmp .L5
	lds r30,_ZL7Channel
	mov r24,r30
	ldi r25,0
	movw r30,r24
	lsl r30
	rol r31
	add r30,r24
	adc r31,r25
	subi r30,lo8(-(_ZL6servos))
	sbci r31,hi8(-(_ZL6servos))
	ld r24,Z
	ldi r22,0
	andi r24,lo8(31)
	call digitalWrite
.L5:
	lds r24,_ZL7Channel
	subi r24,lo8(-(1))
	sts _ZL7Channel,r24
	sts _ZL8ISRCount,__zero_reg__
	sts 178,__zero_reg__
	lds r24,_ZL7Channel
	tst r24
	breq .L6
	lds r24,_ZL7Channel
	cpi r24,lo8(9)
	brsh .L6
	lds r30,_ZL7Channel
	mov r24,r30
	ldi r25,0
	movw r30,r24
	lsl r30
	rol r31
	add r30,r24
	adc r31,r25
	subi r30,lo8(-(_ZL6servos))
	sbci r31,hi8(-(_ZL6servos))
	ld r24,Z
	sbrs r24,5
	rjmp .L1
	lds r30,_ZL7Channel
	mov r24,r30
	ldi r25,0
	movw r30,r24
	lsl r30
	rol r31
	add r30,r24
	adc r31,r25
	subi r30,lo8(-(_ZL6servos))
	sbci r31,hi8(-(_ZL6servos))
	ld r24,Z
	ldi r22,lo8(1)
	andi r24,lo8(31)
	call digitalWrite
	rjmp .L1
.L6:
	lds r24,_ZL7Channel
	cpi r24,lo8(9)
	brsh .+2
	rjmp .L1
	sts _ZL7Channel,__zero_reg__
	rjmp .L1
	.size	__vector_9, .-__vector_9
	.section	.text._ZN11ServoTimer2C2Ev,"ax",@progbits
.global	_ZN11ServoTimer2C2Ev
	.type	_ZN11ServoTimer2C2Ev, @function
_ZN11ServoTimer2C2Ev:
/* prologue: function */
/* frame size = 0 */
/* stack size = 0 */
.L__stack_usage = 0
	movw r30,r24
	lds r25,ChannelCount
	cpi r25,lo8(8)
	brsh .L17
	subi r25,lo8(-(1))
	sts ChannelCount,r25
	st Z,r25
	ret
.L17:
	st Z,__zero_reg__
/* epilogue start */
	ret
	.size	_ZN11ServoTimer2C2Ev, .-_ZN11ServoTimer2C2Ev
.global	_ZN11ServoTimer2C1Ev
	.set	_ZN11ServoTimer2C1Ev,_ZN11ServoTimer2C2Ev
	.section	.text._ZN11ServoTimer26attachEi,"ax",@progbits
.global	_ZN11ServoTimer26attachEi
	.type	_ZN11ServoTimer26attachEi, @function
_ZN11ServoTimer26attachEi:
	push r17
	push r28
	push r29
/* prologue: function */
/* frame size = 0 */
/* stack size = 3 */
.L__stack_usage = 3
	movw r28,r24
	mov r17,r22
	lds r24,_ZL9isStarted
	cpse r24,__zero_reg__
	rjmp .L20
	ldi r30,lo8(_ZL6servos)
	ldi r31,hi8(_ZL6servos)
	ldi r24,lo8(_ZL6servos+24)
	ldi r25,hi8(_ZL6servos+24)
	ldi r19,lo8(11)
	ldi r18,lo8(87)
.L21:
	std Z+4,r19
	std Z+5,r18
	adiw r30,3
	cp r24,r30
	cpc r25,r31
	brne .L21
	ldi r24,lo8(62)
	sts _ZL6servos+1,r24
	sts _ZL7Channel,__zero_reg__
	sts _ZL8ISRCount,__zero_reg__
	sts 112,__zero_reg__
	sts 176,__zero_reg__
	ldi r24,lo8(2)
	sts 177,r24
	sts 178,__zero_reg__
	ldi r24,lo8(1)
	out 0x17,r24
	sts 112,r24
	sts _ZL9isStarted,r24
.L20:
	ld r24,Y
	tst r24
	breq .L22
	ldi r22,lo8(1)
	mov r24,r17
	call pinMode
	ld r30,Y
	mov r24,r30
	ldi r25,0
	movw r30,r24
	lsl r30
	rol r31
	add r30,r24
	adc r31,r25
	subi r30,lo8(-(_ZL6servos))
	sbci r31,hi8(-(_ZL6servos))
	andi r17,lo8(31)
	ld r22,Z
	andi r22,lo8(-32)
	or r22,r17
	ori r22,lo8(1<<5)
	st Z,r22
.L22:
	ld r24,Y
/* epilogue start */
	pop r29
	pop r28
	pop r17
	ret
	.size	_ZN11ServoTimer26attachEi, .-_ZN11ServoTimer26attachEi
	.section	.text._ZN11ServoTimer26detachEv,"ax",@progbits
.global	_ZN11ServoTimer26detachEv
	.type	_ZN11ServoTimer26detachEv, @function
_ZN11ServoTimer26detachEv:
/* prologue: function */
/* frame size = 0 */
/* stack size = 0 */
.L__stack_usage = 0
	movw r26,r24
	ld r30,X
	mov r24,r30
	ldi r25,0
	movw r30,r24
	lsl r30
	rol r31
	add r30,r24
	adc r31,r25
	subi r30,lo8(-(_ZL6servos))
	sbci r31,hi8(-(_ZL6servos))
	ld r24,Z
	andi r24,lo8(~(1<<5))
	st Z,r24
/* epilogue start */
	ret
	.size	_ZN11ServoTimer26detachEv, .-_ZN11ServoTimer26detachEv
	.section	.text._ZN11ServoTimer25writeEi,"ax",@progbits
.global	_ZN11ServoTimer25writeEi
	.type	_ZN11ServoTimer25writeEi, @function
_ZN11ServoTimer25writeEi:
/* prologue: function */
/* frame size = 0 */
/* stack size = 0 */
.L__stack_usage = 0
	movw r26,r24
	ld r30,X
	ldi r24,lo8(-1)
	add r24,r30
	cpi r24,lo8(8)
	brsh .L28
	movw r24,r22
	cpi r22,-53
	sbci r23,8
	brlt .L30
	ldi r24,lo8(-54)
	ldi r25,lo8(8)
.L30:
	cpi r24,-18
	ldi r18,2
	cpc r25,r18
	brge .L31
	ldi r24,lo8(-18)
	ldi r25,lo8(2)
.L31:
	sbiw r24,8
	movw r20,r24
	lsl r20
	mov r20,r21
	rol r20
	sbc r21,r21
	mov r18,r30
	ldi r19,0
	movw r30,r18
	lsl r30
	rol r31
	add r30,r18
	adc r31,r19
	subi r30,lo8(-(_ZL6servos))
	sbci r31,hi8(-(_ZL6servos))
	std Z+1,r20
	lsl r24
	com r24
	std Z+2,r24
.L28:
/* epilogue start */
	ret
	.size	_ZN11ServoTimer25writeEi, .-_ZN11ServoTimer25writeEi
	.section	.text._ZN11ServoTimer24readEv,"ax",@progbits
.global	_ZN11ServoTimer24readEv
	.type	_ZN11ServoTimer24readEv, @function
_ZN11ServoTimer24readEv:
/* prologue: function */
/* frame size = 0 */
/* stack size = 0 */
.L__stack_usage = 0
	movw r26,r24
	ld r30,X
	tst r30
	breq .L34
	mov r24,r30
	ldi r25,0
	movw r30,r24
	lsl r30
	rol r31
	add r30,r24
	adc r31,r25
	subi r30,lo8(-(_ZL6servos))
	sbci r31,hi8(-(_ZL6servos))
	ldd r18,Z+2
	ldi r24,lo8(-1)
	ldi r25,0
	sub r24,r18
	sbc r25,__zero_reg__
	asr r25
	ror r24
	ldd r18,Z+1
	ldi r27,lo8(-128)
	mul r18,r27
	movw r18,r0
	clr __zero_reg__
	add r24,r18
	adc r25,r19
	adiw r24,8
	ret
.L34:
	ldi r25,0
	ldi r24,0
/* epilogue start */
	ret
	.size	_ZN11ServoTimer24readEv, .-_ZN11ServoTimer24readEv
	.section	.text._ZN11ServoTimer28attachedEv,"ax",@progbits
.global	_ZN11ServoTimer28attachedEv
	.type	_ZN11ServoTimer28attachedEv, @function
_ZN11ServoTimer28attachedEv:
/* prologue: function */
/* frame size = 0 */
/* stack size = 0 */
.L__stack_usage = 0
	movw r26,r24
	ld r30,X
	mov r24,r30
	ldi r25,0
	movw r30,r24
	lsl r30
	rol r31
	add r30,r24
	adc r31,r25
	subi r30,lo8(-(_ZL6servos))
	sbci r31,hi8(-(_ZL6servos))
	ld r24,Z
	bst r24,5
	clr r24
	bld r24,0
/* epilogue start */
	ret
	.size	_ZN11ServoTimer28attachedEv, .-_ZN11ServoTimer28attachedEv
	.section	.bss._ZL9isStarted,"aw",@nobits
	.type	_ZL9isStarted, @object
	.size	_ZL9isStarted, 1
_ZL9isStarted:
	.zero	1
.global	ChannelCount
	.section	.bss.ChannelCount,"aw",@nobits
	.type	ChannelCount, @object
	.size	ChannelCount, 1
ChannelCount:
	.zero	1
	.section	.bss._ZL8ISRCount,"aw",@nobits
	.type	_ZL8ISRCount, @object
	.size	_ZL8ISRCount, 1
_ZL8ISRCount:
	.zero	1
	.section	.bss._ZL7Channel,"aw",@nobits
	.type	_ZL7Channel, @object
	.size	_ZL7Channel, 1
_ZL7Channel:
	.zero	1
	.section	.bss._ZL6servos,"aw",@nobits
	.type	_ZL6servos, @object
	.size	_ZL6servos, 27
_ZL6servos:
	.zero	27
	.ident	"GCC: (GNU) 7.3.0"
.global __do_clear_bss
