	.file	"ee_oo_kernel.c"
__SP_H__ = 0x3e
__SP_L__ = 0x3d
__SREG__ = 0x3f
__tmp_reg__ = 0
__zero_reg__ = 1
	.text
.Ltext0:
	.cfi_sections	.debug_frame
	.section	.text.osEE_task_activated,"ax",@progbits
.global	osEE_task_activated
	.type	osEE_task_activated, @function
osEE_task_activated:
.LFB64:
	.file 1 "/home/user/Osek/OSEK-GroupProject/erika/src/ee_oo_kernel.c"
	.loc 1 59 0
	.cfi_startproc
.LVL0:
/* prologue: function */
/* frame size = 0 */
/* stack size = 0 */
.L__stack_usage = 0
	movw r26,r24
	.loc 1 61 0
	adiw r26,4
	ld r30,X+
	ld r31,X
	sbiw r26,4+1
.LVL1:
	.loc 1 71 0
	ld r25,Z
	adiw r26,13
	ld r24,X
.LVL2:
	cp r25,r24
	brsh .L3
	.loc 1 72 0
	subi r25,lo8(-(1))
	st Z,r25
.LVL3:
	.loc 1 73 0
	ldi r25,0
	ldi r24,0
	ret
.LVL4:
.L3:
	.loc 1 75 0
	ldi r24,lo8(4)
	ldi r25,0
.LVL5:
/* epilogue start */
	.loc 1 87 0
	ret
	.cfi_endproc
.LFE64:
	.size	osEE_task_activated, .-osEE_task_activated
	.section	.text.osEE_task_end,"ax",@progbits
.global	osEE_task_end
	.type	osEE_task_end, @function
osEE_task_end:
.LFB65:
	.loc 1 94 0
	.cfi_startproc
.LVL6:
/* prologue: function */
/* frame size = 0 */
/* stack size = 0 */
.L__stack_usage = 0
	.loc 1 96 0
	movw r26,r24
	adiw r26,4
	ld r30,X+
	ld r31,X
	sbiw r26,4+1
.LVL7:
	.loc 1 98 0
	adiw r26,11
	ld r24,X
.LVL8:
	std Z+1,r24
	.loc 1 100 0
	ld r24,Z
	subi r24,lo8(-(-1))
	st Z,r24
	.loc 1 102 0
	cpse r24,__zero_reg__
	rjmp .L5
	.loc 1 103 0
	std Z+3,__zero_reg__
	std Z+2,__zero_reg__
	ret
.L5:
	.loc 1 105 0
	ldi r24,lo8(1)
	ldi r25,0
	std Z+3,r25
	std Z+2,r24
/* epilogue start */
	.loc 1 107 0
	ret
	.cfi_endproc
.LFE65:
	.size	osEE_task_end, .-osEE_task_end
	.section	.text.osEE_task_event_set_mask,"ax",@progbits
.global	osEE_task_event_set_mask
	.type	osEE_task_event_set_mask, @function
osEE_task_event_set_mask:
.LFB66:
	.loc 1 117 0
	.cfi_startproc
.LVL9:
/* prologue: function */
/* frame size = 0 */
/* stack size = 0 */
.L__stack_usage = 0
	.loc 1 122 0
	movw r26,r24
	adiw r26,4
	ld r30,X+
	ld r31,X
.LVL10:
	.loc 1 143 0
	ldd r24,Z+8
	ldd r25,Z+9
.LVL11:
	or r24,r22
	or r25,r23
	std Z+9,r25
	std Z+8,r24
	.loc 1 145 0
	movw r26,r20
.LVL12:
	st X+,__zero_reg__
	st X,__zero_reg__
	.loc 1 147 0
	ldd r24,Z+6
	ldd r25,Z+7
	and r22,r24
.LVL13:
	and r23,r25
	or r22,r23
	breq .L9
	.loc 1 148 0
	ldd r24,Z+10
	ldd r25,Z+11
.LVL14:
	.loc 1 152 0
	sbiw r24,0
	breq .L7
	.loc 1 153 0
	std Z+11,__zero_reg__
	std Z+10,__zero_reg__
	ret
.LVL15:
.L9:
	.loc 1 120 0
	ldi r25,0
	ldi r24,0
.LVL16:
.L7:
/* epilogue start */
	.loc 1 167 0
	ret
	.cfi_endproc
.LFE66:
	.size	osEE_task_event_set_mask, .-osEE_task_event_set_mask
	.section	.text.osEE_activate_isr2,"ax",@progbits
.global	osEE_activate_isr2
	.type	osEE_activate_isr2, @function
osEE_activate_isr2:
.LFB67:
	.loc 1 193 0
	.cfi_startproc
.LVL17:
/* prologue: function */
/* frame size = 0 */
/* stack size = 0 */
.L__stack_usage = 0
.LBB5:
	.loc 1 200 0
	lds r30,osEE_kdb_var+2
	lds r31,osEE_kdb_var+2+1
	ldi r25,0
	lsl r24
	rol r25
.LVL18:
	add r30,r24
	adc r31,r25
	ld r22,Z
	ldd r23,Z+1
.LVL19:
	.loc 1 205 0
	movw r26,r22
	adiw r26,4
	ld r30,X+
	ld r31,X
	ld r24,Z
	subi r24,lo8(-(1))
	st Z,r24
	.loc 1 207 0
	ldi r21,0
	ldi r20,0
	ldi r24,lo8(osEE_kdb_var)
	ldi r25,hi8(osEE_kdb_var)
	jmp osEE_scheduler_task_set_running
.LVL20:
.LBE5:
	.cfi_endproc
.LFE67:
	.size	osEE_activate_isr2, .-osEE_activate_isr2
	.text
.Letext0:
	.file 2 "/home/user/arduino-1.8.19/hardware/tools/avr/avr/include/stdint.h"
	.file 3 "/home/user/Osek/OSEK-GroupProject/erika/inc/ee_platform_types.h"
	.file 4 "/home/user/Osek/OSEK-GroupProject/erika/inc/ee_api_types.h"
	.file 5 "/home/user/Osek/OSEK-GroupProject/erika/inc/ee_scheduler_types.h"
	.file 6 "/home/user/Osek/OSEK-GroupProject/erika/inc/ee_kernel_types.h"
	.file 7 "/home/user/Osek/OSEK-GroupProject/erika/inc/ee_hal_internal_types.h"
	.file 8 "/home/user/Osek/OSEK-GroupProject/erika/inc/ee_get_kernel_and_core.h"
	.file 9 "/home/user/Osek/OSEK-GroupProject/erika/src/ee_scheduler.h"
	.section	.debug_info,"",@progbits
.Ldebug_info0:
	.long	0xe23
	.word	0x2
	.long	.Ldebug_abbrev0
	.byte	0x4
	.uleb128 0x1
	.long	.LASF210
	.byte	0xc
	.long	.LASF211
	.long	.LASF212
	.long	.Ldebug_ranges0+0
	.long	0
	.long	0
	.long	.Ldebug_line0
	.uleb128 0x2
	.byte	0x2
	.byte	0x5
	.string	"int"
	.uleb128 0x3
	.byte	0x2
	.byte	0x7
	.long	.LASF0
	.uleb128 0x3
	.byte	0x8
	.byte	0x5
	.long	.LASF1
	.uleb128 0x3
	.byte	0x4
	.byte	0x4
	.long	.LASF2
	.uleb128 0x3
	.byte	0x1
	.byte	0x6
	.long	.LASF3
	.uleb128 0x4
	.long	.LASF5
	.byte	0x2
	.byte	0x7e
	.long	0x57
	.uleb128 0x3
	.byte	0x1
	.byte	0x8
	.long	.LASF4
	.uleb128 0x4
	.long	.LASF6
	.byte	0x2
	.byte	0x80
	.long	0x30
	.uleb128 0x3
	.byte	0x4
	.byte	0x5
	.long	.LASF7
	.uleb128 0x3
	.byte	0x4
	.byte	0x7
	.long	.LASF8
	.uleb128 0x3
	.byte	0x8
	.byte	0x7
	.long	.LASF9
	.uleb128 0x4
	.long	.LASF10
	.byte	0x3
	.byte	0x5b
	.long	0x4c
	.uleb128 0x4
	.long	.LASF11
	.byte	0x3
	.byte	0x65
	.long	0x5e
	.uleb128 0x4
	.long	.LASF12
	.byte	0x3
	.byte	0x68
	.long	0x5e
	.uleb128 0x4
	.long	.LASF13
	.byte	0x3
	.byte	0x6d
	.long	0x5e
	.uleb128 0x5
	.byte	0x2
	.long	0xb0
	.uleb128 0x6
	.byte	0x1
	.uleb128 0x4
	.long	.LASF14
	.byte	0x4
	.byte	0x60
	.long	0x4c
	.uleb128 0x4
	.long	.LASF15
	.byte	0x4
	.byte	0x78
	.long	0x7e
	.uleb128 0x4
	.long	.LASF16
	.byte	0x4
	.byte	0xc8
	.long	0x4c
	.uleb128 0x4
	.long	.LASF17
	.byte	0x4
	.byte	0xf4
	.long	0x4c
	.uleb128 0x7
	.long	.LASF18
	.byte	0x4
	.word	0x13a
	.long	0xaa
	.uleb128 0x8
	.byte	0x7
	.byte	0x2
	.long	0x30
	.byte	0x4
	.word	0x145
	.long	0x111
	.uleb128 0x9
	.long	.LASF19
	.byte	0
	.uleb128 0x9
	.long	.LASF20
	.byte	0x1
	.uleb128 0x9
	.long	.LASF21
	.byte	0x2
	.uleb128 0x9
	.long	.LASF22
	.byte	0x3
	.byte	0
	.uleb128 0x7
	.long	.LASF23
	.byte	0x4
	.word	0x153
	.long	0xea
	.uleb128 0x7
	.long	.LASF24
	.byte	0x4
	.word	0x157
	.long	0x111
	.uleb128 0x8
	.byte	0x7
	.byte	0x2
	.long	0x30
	.byte	0x4
	.word	0x15d
	.long	0x15c
	.uleb128 0x9
	.long	.LASF25
	.byte	0
	.uleb128 0x9
	.long	.LASF26
	.byte	0x1
	.uleb128 0x9
	.long	.LASF27
	.byte	0x2
	.uleb128 0x9
	.long	.LASF28
	.byte	0x3
	.uleb128 0x9
	.long	.LASF29
	.byte	0x4
	.uleb128 0x9
	.long	.LASF30
	.byte	0x5
	.byte	0
	.uleb128 0x7
	.long	.LASF31
	.byte	0x4
	.word	0x16e
	.long	0x129
	.uleb128 0x7
	.long	.LASF32
	.byte	0x4
	.word	0x17e
	.long	0x15c
	.uleb128 0x7
	.long	.LASF33
	.byte	0x4
	.word	0x19e
	.long	0x94
	.uleb128 0xa
	.byte	0x4
	.byte	0x4
	.word	0x1b7
	.long	0x1a8
	.uleb128 0xb
	.long	.LASF34
	.byte	0x4
	.word	0x1b9
	.long	0x174
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF35
	.byte	0x4
	.word	0x1bc
	.long	0x174
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.byte	0
	.uleb128 0x7
	.long	.LASF36
	.byte	0x4
	.word	0x1c2
	.long	0x180
	.uleb128 0x7
	.long	.LASF37
	.byte	0x4
	.word	0x237
	.long	0x9f
	.uleb128 0x7
	.long	.LASF38
	.byte	0x4
	.word	0x2a3
	.long	0x89
	.uleb128 0x8
	.byte	0x7
	.byte	0x2
	.long	0x30
	.byte	0x4
	.word	0x2b1
	.long	0x289
	.uleb128 0x9
	.long	.LASF39
	.byte	0
	.uleb128 0x9
	.long	.LASF40
	.byte	0x1
	.uleb128 0x9
	.long	.LASF41
	.byte	0x2
	.uleb128 0x9
	.long	.LASF42
	.byte	0x3
	.uleb128 0x9
	.long	.LASF43
	.byte	0x4
	.uleb128 0x9
	.long	.LASF44
	.byte	0x5
	.uleb128 0x9
	.long	.LASF45
	.byte	0x6
	.uleb128 0x9
	.long	.LASF46
	.byte	0x7
	.uleb128 0x9
	.long	.LASF47
	.byte	0x8
	.uleb128 0x9
	.long	.LASF48
	.byte	0x9
	.uleb128 0x9
	.long	.LASF49
	.byte	0xa
	.uleb128 0x9
	.long	.LASF50
	.byte	0xb
	.uleb128 0x9
	.long	.LASF51
	.byte	0xc
	.uleb128 0x9
	.long	.LASF52
	.byte	0xd
	.uleb128 0x9
	.long	.LASF53
	.byte	0xe
	.uleb128 0x9
	.long	.LASF54
	.byte	0xf
	.uleb128 0x9
	.long	.LASF55
	.byte	0x10
	.uleb128 0x9
	.long	.LASF56
	.byte	0x11
	.uleb128 0x9
	.long	.LASF57
	.byte	0x12
	.uleb128 0x9
	.long	.LASF58
	.byte	0x13
	.uleb128 0x9
	.long	.LASF59
	.byte	0x14
	.uleb128 0x9
	.long	.LASF60
	.byte	0x15
	.uleb128 0x9
	.long	.LASF61
	.byte	0x16
	.uleb128 0x9
	.long	.LASF62
	.byte	0x17
	.uleb128 0x9
	.long	.LASF63
	.byte	0x18
	.uleb128 0x9
	.long	.LASF64
	.byte	0x19
	.uleb128 0x9
	.long	.LASF65
	.byte	0x1a
	.uleb128 0x9
	.long	.LASF66
	.byte	0x1b
	.uleb128 0x9
	.long	.LASF67
	.byte	0x1c
	.byte	0
	.uleb128 0x7
	.long	.LASF68
	.byte	0x4
	.word	0x2d4
	.long	0x1cc
	.uleb128 0x7
	.long	.LASF69
	.byte	0x4
	.word	0x2d9
	.long	0x289
	.uleb128 0xc
	.long	.LASF72
	.byte	0x4
	.byte	0x5
	.byte	0x4b
	.long	0x2ca
	.uleb128 0xd
	.long	.LASF70
	.byte	0x5
	.byte	0x4d
	.long	0x2ca
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xd
	.long	.LASF71
	.byte	0x5
	.byte	0x4f
	.long	0x35b
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0x2a1
	.uleb128 0xe
	.long	.LASF73
	.byte	0xe
	.byte	0x6
	.word	0x108
	.long	0x356
	.uleb128 0xf
	.string	"hdb"
	.byte	0x6
	.word	0x10b
	.long	0x53c
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF74
	.byte	0x6
	.word	0x10e
	.long	0x69e
	.byte	0x2
	.byte	0x23
	.uleb128 0x4
	.uleb128 0xf
	.string	"tid"
	.byte	0x6
	.word	0x110
	.long	0xbd
	.byte	0x2
	.byte	0x23
	.uleb128 0x6
	.uleb128 0xb
	.long	.LASF75
	.byte	0x6
	.word	0x112
	.long	0x11d
	.byte	0x2
	.byte	0x23
	.uleb128 0x7
	.uleb128 0xb
	.long	.LASF76
	.byte	0x6
	.word	0x114
	.long	0xde
	.byte	0x2
	.byte	0x23
	.uleb128 0x9
	.uleb128 0xb
	.long	.LASF77
	.byte	0x6
	.word	0x117
	.long	0xc8
	.byte	0x2
	.byte	0x23
	.uleb128 0xb
	.uleb128 0xb
	.long	.LASF78
	.byte	0x6
	.word	0x11a
	.long	0xc8
	.byte	0x2
	.byte	0x23
	.uleb128 0xc
	.uleb128 0xb
	.long	.LASF79
	.byte	0x6
	.word	0x11c
	.long	0xd3
	.byte	0x2
	.byte	0x23
	.uleb128 0xd
	.byte	0
	.uleb128 0x10
	.long	0x2d0
	.uleb128 0x5
	.byte	0x2
	.long	0x356
	.uleb128 0x4
	.long	.LASF80
	.byte	0x5
	.byte	0x50
	.long	0x2a1
	.uleb128 0x4
	.long	.LASF81
	.byte	0x5
	.byte	0xd5
	.long	0x377
	.uleb128 0x5
	.byte	0x2
	.long	0x361
	.uleb128 0xc
	.long	.LASF82
	.byte	0x14
	.byte	0x7
	.byte	0x43
	.long	0x48c
	.uleb128 0x11
	.string	"r29"
	.byte	0x7
	.byte	0x44
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0x11
	.string	"r28"
	.byte	0x7
	.byte	0x45
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0x1
	.uleb128 0x11
	.string	"r17"
	.byte	0x7
	.byte	0x46
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.uleb128 0x11
	.string	"r16"
	.byte	0x7
	.byte	0x47
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0x3
	.uleb128 0x11
	.string	"r15"
	.byte	0x7
	.byte	0x48
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0x4
	.uleb128 0x11
	.string	"r14"
	.byte	0x7
	.byte	0x49
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0x5
	.uleb128 0x11
	.string	"r13"
	.byte	0x7
	.byte	0x4a
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0x6
	.uleb128 0x11
	.string	"r12"
	.byte	0x7
	.byte	0x4b
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0x7
	.uleb128 0x11
	.string	"r11"
	.byte	0x7
	.byte	0x4c
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0x8
	.uleb128 0x11
	.string	"r10"
	.byte	0x7
	.byte	0x4d
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0x9
	.uleb128 0x11
	.string	"r9"
	.byte	0x7
	.byte	0x4e
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0xa
	.uleb128 0x11
	.string	"r8"
	.byte	0x7
	.byte	0x4f
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0xb
	.uleb128 0x11
	.string	"r7"
	.byte	0x7
	.byte	0x50
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0xc
	.uleb128 0x11
	.string	"r6"
	.byte	0x7
	.byte	0x51
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0xd
	.uleb128 0x11
	.string	"r5"
	.byte	0x7
	.byte	0x52
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0xe
	.uleb128 0x11
	.string	"r4"
	.byte	0x7
	.byte	0x53
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0xf
	.uleb128 0x11
	.string	"r3"
	.byte	0x7
	.byte	0x54
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0x10
	.uleb128 0x11
	.string	"r2"
	.byte	0x7
	.byte	0x55
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0x11
	.uleb128 0xd
	.long	.LASF83
	.byte	0x7
	.byte	0x56
	.long	0x48c
	.byte	0x2
	.byte	0x23
	.uleb128 0x12
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0x37d
	.uleb128 0x4
	.long	.LASF84
	.byte	0x7
	.byte	0x57
	.long	0x37d
	.uleb128 0xc
	.long	.LASF85
	.byte	0x2
	.byte	0x7
	.byte	0x5a
	.long	0x4b8
	.uleb128 0xd
	.long	.LASF86
	.byte	0x7
	.byte	0x5b
	.long	0x4b8
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0x492
	.uleb128 0x4
	.long	.LASF87
	.byte	0x7
	.byte	0x5c
	.long	0x49d
	.uleb128 0xc
	.long	.LASF88
	.byte	0x4
	.byte	0x7
	.byte	0x5e
	.long	0x4f2
	.uleb128 0xd
	.long	.LASF89
	.byte	0x7
	.byte	0x5f
	.long	0x4b8
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xd
	.long	.LASF90
	.byte	0x7
	.byte	0x60
	.long	0x89
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.byte	0
	.uleb128 0x10
	.long	0x4c9
	.uleb128 0x4
	.long	.LASF91
	.byte	0x7
	.byte	0x61
	.long	0x4f2
	.uleb128 0xc
	.long	.LASF92
	.byte	0x4
	.byte	0x7
	.byte	0x63
	.long	0x52b
	.uleb128 0xd
	.long	.LASF93
	.byte	0x7
	.byte	0x64
	.long	0x530
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xd
	.long	.LASF94
	.byte	0x7
	.byte	0x65
	.long	0x536
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.byte	0
	.uleb128 0x10
	.long	0x502
	.uleb128 0x5
	.byte	0x2
	.long	0x4f7
	.uleb128 0x5
	.byte	0x2
	.long	0x4be
	.uleb128 0x4
	.long	.LASF95
	.byte	0x7
	.byte	0x69
	.long	0x52b
	.uleb128 0x4
	.long	.LASF96
	.byte	0x6
	.byte	0x51
	.long	0xaa
	.uleb128 0x4
	.long	.LASF97
	.byte	0x6
	.byte	0x53
	.long	0x4c
	.uleb128 0x12
	.byte	0x7
	.byte	0x2
	.long	0x30
	.byte	0x6
	.byte	0x73
	.long	0x583
	.uleb128 0x9
	.long	.LASF98
	.byte	0
	.uleb128 0x9
	.long	.LASF99
	.byte	0x1
	.uleb128 0x9
	.long	.LASF100
	.byte	0x2
	.uleb128 0x9
	.long	.LASF101
	.byte	0x3
	.byte	0
	.uleb128 0x4
	.long	.LASF102
	.byte	0x6
	.byte	0x7d
	.long	0x55d
	.uleb128 0x13
	.long	0x583
	.uleb128 0x14
	.byte	0x5
	.byte	0x6
	.byte	0x90
	.long	0x5c6
	.uleb128 0xd
	.long	.LASF70
	.byte	0x6
	.byte	0x94
	.long	0x5f4
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xd
	.long	.LASF103
	.byte	0x6
	.byte	0x97
	.long	0xc8
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.uleb128 0xd
	.long	.LASF104
	.byte	0x6
	.byte	0x9a
	.long	0x35b
	.byte	0x2
	.byte	0x23
	.uleb128 0x3
	.byte	0
	.uleb128 0xc
	.long	.LASF105
	.byte	0x3
	.byte	0x6
	.byte	0xb5
	.long	0x5ef
	.uleb128 0xd
	.long	.LASF106
	.byte	0x6
	.byte	0xb7
	.long	0x605
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xd
	.long	.LASF107
	.byte	0x6
	.byte	0xc3
	.long	0xc8
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.byte	0
	.uleb128 0x10
	.long	0x5c6
	.uleb128 0x5
	.byte	0x2
	.long	0x5ef
	.uleb128 0x4
	.long	.LASF108
	.byte	0x6
	.byte	0x9b
	.long	0x593
	.uleb128 0x5
	.byte	0x2
	.long	0x5fa
	.uleb128 0x4
	.long	.LASF109
	.byte	0x6
	.byte	0xce
	.long	0x5ef
	.uleb128 0x4
	.long	.LASF110
	.byte	0x6
	.byte	0xd2
	.long	0x60b
	.uleb128 0x14
	.byte	0xc
	.byte	0x6
	.byte	0xe0
	.long	0x68c
	.uleb128 0xd
	.long	.LASF111
	.byte	0x6
	.byte	0xe4
	.long	0xd3
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xd
	.long	.LASF112
	.byte	0x6
	.byte	0xea
	.long	0xc8
	.byte	0x2
	.byte	0x23
	.uleb128 0x1
	.uleb128 0xd
	.long	.LASF113
	.byte	0x6
	.byte	0xec
	.long	0x168
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.uleb128 0xd
	.long	.LASF114
	.byte	0x6
	.byte	0xef
	.long	0x68c
	.byte	0x2
	.byte	0x23
	.uleb128 0x4
	.uleb128 0xd
	.long	.LASF115
	.byte	0x6
	.byte	0xf3
	.long	0x1b4
	.byte	0x2
	.byte	0x23
	.uleb128 0x6
	.uleb128 0xd
	.long	.LASF116
	.byte	0x6
	.byte	0xf5
	.long	0x1b4
	.byte	0x2
	.byte	0x23
	.uleb128 0x8
	.uleb128 0xd
	.long	.LASF117
	.byte	0x6
	.byte	0xfb
	.long	0x377
	.byte	0x2
	.byte	0x23
	.uleb128 0xa
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0x60b
	.uleb128 0x7
	.long	.LASF118
	.byte	0x6
	.word	0x101
	.long	0x621
	.uleb128 0x5
	.byte	0x2
	.long	0x692
	.uleb128 0x10
	.long	0x69e
	.uleb128 0x7
	.long	.LASF119
	.byte	0x6
	.word	0x122
	.long	0x356
	.uleb128 0x5
	.byte	0x2
	.long	0x6a9
	.uleb128 0x10
	.long	0x6b5
	.uleb128 0x7
	.long	.LASF120
	.byte	0x6
	.word	0x151
	.long	0x6cc
	.uleb128 0x5
	.byte	0x2
	.long	0x70d
	.uleb128 0xe
	.long	.LASF121
	.byte	0xe
	.byte	0x6
	.word	0x269
	.long	0x70d
	.uleb128 0xb
	.long	.LASF122
	.byte	0x6
	.word	0x26b
	.long	0x8d7
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF123
	.byte	0x6
	.word	0x26d
	.long	0x7fc
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.uleb128 0xb
	.long	.LASF124
	.byte	0x6
	.word	0x27b
	.long	0x840
	.byte	0x2
	.byte	0x23
	.uleb128 0x4
	.byte	0
	.uleb128 0x10
	.long	0x6d2
	.uleb128 0xa
	.byte	0x4
	.byte	0x6
	.word	0x155
	.long	0x73a
	.uleb128 0xb
	.long	.LASF125
	.byte	0x6
	.word	0x157
	.long	0x6c0
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF126
	.byte	0x6
	.word	0x159
	.long	0x174
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.byte	0
	.uleb128 0x7
	.long	.LASF127
	.byte	0x6
	.word	0x15e
	.long	0x712
	.uleb128 0xa
	.byte	0x6
	.byte	0x6
	.word	0x16f
	.long	0x76e
	.uleb128 0xb
	.long	.LASF128
	.byte	0x6
	.word	0x171
	.long	0x773
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF129
	.byte	0x6
	.word	0x177
	.long	0x1a8
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.byte	0
	.uleb128 0x10
	.long	0x746
	.uleb128 0x5
	.byte	0x2
	.long	0x73a
	.uleb128 0x7
	.long	.LASF130
	.byte	0x6
	.word	0x17c
	.long	0x76e
	.uleb128 0x8
	.byte	0x7
	.byte	0x2
	.long	0x30
	.byte	0x6
	.word	0x17f
	.long	0x7ac
	.uleb128 0x9
	.long	.LASF131
	.byte	0
	.uleb128 0x9
	.long	.LASF132
	.byte	0x1
	.uleb128 0x9
	.long	.LASF133
	.byte	0x2
	.uleb128 0x9
	.long	.LASF134
	.byte	0x3
	.byte	0
	.uleb128 0x7
	.long	.LASF135
	.byte	0x6
	.word	0x184
	.long	0x785
	.uleb128 0xa
	.byte	0x8
	.byte	0x6
	.word	0x189
	.long	0x7fc
	.uleb128 0xf
	.string	"f"
	.byte	0x6
	.word	0x18b
	.long	0x547
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF71
	.byte	0x6
	.word	0x18d
	.long	0x6b5
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.uleb128 0xb
	.long	.LASF123
	.byte	0x6
	.word	0x18f
	.long	0x7fc
	.byte	0x2
	.byte	0x23
	.uleb128 0x4
	.uleb128 0xb
	.long	.LASF136
	.byte	0x6
	.word	0x192
	.long	0x1b4
	.byte	0x2
	.byte	0x23
	.uleb128 0x6
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0x779
	.uleb128 0x10
	.long	0x7fc
	.uleb128 0x7
	.long	.LASF137
	.byte	0x6
	.word	0x194
	.long	0x7b8
	.uleb128 0xa
	.byte	0xa
	.byte	0x6
	.word	0x198
	.long	0x83b
	.uleb128 0xb
	.long	.LASF138
	.byte	0x6
	.word	0x19a
	.long	0x807
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF139
	.byte	0x6
	.word	0x19c
	.long	0x7ac
	.byte	0x2
	.byte	0x23
	.uleb128 0x8
	.byte	0
	.uleb128 0x10
	.long	0x813
	.uleb128 0x7
	.long	.LASF140
	.byte	0x6
	.word	0x19d
	.long	0x83b
	.uleb128 0x8
	.byte	0x7
	.byte	0x2
	.long	0x30
	.byte	0x6
	.word	0x22b
	.long	0x879
	.uleb128 0x9
	.long	.LASF141
	.byte	0
	.uleb128 0x9
	.long	.LASF142
	.byte	0x1
	.uleb128 0x9
	.long	.LASF143
	.byte	0x2
	.uleb128 0x9
	.long	.LASF144
	.byte	0x3
	.uleb128 0x9
	.long	.LASF145
	.byte	0x4
	.byte	0
	.uleb128 0x7
	.long	.LASF146
	.byte	0x6
	.word	0x231
	.long	0x84c
	.uleb128 0xa
	.byte	0x8
	.byte	0x6
	.word	0x242
	.long	0x8cb
	.uleb128 0xb
	.long	.LASF70
	.byte	0x6
	.word	0x244
	.long	0x6cc
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF147
	.byte	0x6
	.word	0x247
	.long	0x174
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.uleb128 0xb
	.long	.LASF113
	.byte	0x6
	.word	0x249
	.long	0x879
	.byte	0x2
	.byte	0x23
	.uleb128 0x4
	.uleb128 0xb
	.long	.LASF148
	.byte	0x6
	.word	0x24d
	.long	0x174
	.byte	0x2
	.byte	0x23
	.uleb128 0x6
	.byte	0
	.uleb128 0x7
	.long	.LASF149
	.byte	0x6
	.word	0x25e
	.long	0x885
	.uleb128 0x5
	.byte	0x2
	.long	0x8cb
	.uleb128 0x7
	.long	.LASF150
	.byte	0x6
	.word	0x290
	.long	0x70d
	.uleb128 0x7
	.long	.LASF151
	.byte	0x6
	.word	0x295
	.long	0x8dd
	.uleb128 0xa
	.byte	0x6
	.byte	0x6
	.word	0x2a9
	.long	0x92c
	.uleb128 0xb
	.long	.LASF152
	.byte	0x6
	.word	0x2ad
	.long	0x931
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF153
	.byte	0x6
	.word	0x2af
	.long	0x174
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.uleb128 0xb
	.long	.LASF154
	.byte	0x6
	.word	0x2b2
	.long	0x174
	.byte	0x2
	.byte	0x23
	.uleb128 0x4
	.byte	0
	.uleb128 0x10
	.long	0x8f5
	.uleb128 0x5
	.byte	0x2
	.long	0x8dd
	.uleb128 0x7
	.long	.LASF155
	.byte	0x6
	.word	0x2b8
	.long	0x92c
	.uleb128 0xa
	.byte	0x4
	.byte	0x6
	.word	0x2bb
	.long	0x96b
	.uleb128 0xb
	.long	.LASF156
	.byte	0x6
	.word	0x2bd
	.long	0x97b
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF157
	.byte	0x6
	.word	0x2bf
	.long	0x1c0
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.byte	0
	.uleb128 0x10
	.long	0x943
	.uleb128 0x15
	.long	0x937
	.long	0x97b
	.uleb128 0x16
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0x970
	.uleb128 0x7
	.long	.LASF158
	.byte	0x6
	.word	0x2c0
	.long	0x96b
	.uleb128 0xe
	.long	.LASF159
	.byte	0x4
	.byte	0x6
	.word	0x2c7
	.long	0x9b9
	.uleb128 0xb
	.long	.LASF160
	.byte	0x6
	.word	0x2c9
	.long	0x9c9
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF161
	.byte	0x6
	.word	0x2cb
	.long	0x1c0
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.byte	0
	.uleb128 0x10
	.long	0x98d
	.uleb128 0x15
	.long	0x6bb
	.long	0x9c9
	.uleb128 0x16
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0x9be
	.uleb128 0x7
	.long	.LASF162
	.byte	0x6
	.word	0x2cc
	.long	0x9b9
	.uleb128 0xa
	.byte	0x12
	.byte	0x6
	.word	0x2d9
	.long	0xa98
	.uleb128 0xb
	.long	.LASF163
	.byte	0x6
	.word	0x2dc
	.long	0x6b5
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xf
	.string	"rq"
	.byte	0x6
	.word	0x2ee
	.long	0x36c
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.uleb128 0xb
	.long	.LASF164
	.byte	0x6
	.word	0x2f0
	.long	0x377
	.byte	0x2
	.byte	0x23
	.uleb128 0x4
	.uleb128 0xb
	.long	.LASF165
	.byte	0x6
	.word	0x2ff
	.long	0x377
	.byte	0x2
	.byte	0x23
	.uleb128 0x6
	.uleb128 0xb
	.long	.LASF166
	.byte	0x6
	.word	0x301
	.long	0x58e
	.byte	0x2
	.byte	0x23
	.uleb128 0x8
	.uleb128 0xb
	.long	.LASF167
	.byte	0x6
	.word	0x305
	.long	0xb2
	.byte	0x2
	.byte	0x23
	.uleb128 0xa
	.uleb128 0xb
	.long	.LASF168
	.byte	0x6
	.word	0x307
	.long	0x295
	.byte	0x2
	.byte	0x23
	.uleb128 0xb
	.uleb128 0xb
	.long	.LASF169
	.byte	0x6
	.word	0x327
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0xd
	.uleb128 0xb
	.long	.LASF170
	.byte	0x6
	.word	0x329
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0xe
	.uleb128 0xb
	.long	.LASF171
	.byte	0x6
	.word	0x32b
	.long	0x552
	.byte	0x2
	.byte	0x23
	.uleb128 0xf
	.uleb128 0xb
	.long	.LASF172
	.byte	0x6
	.word	0x32d
	.long	0x552
	.byte	0x2
	.byte	0x23
	.uleb128 0x10
	.uleb128 0xb
	.long	.LASF173
	.byte	0x6
	.word	0x330
	.long	0x552
	.byte	0x2
	.byte	0x23
	.uleb128 0x11
	.byte	0
	.uleb128 0x7
	.long	.LASF174
	.byte	0x6
	.word	0x33a
	.long	0x9db
	.uleb128 0xa
	.byte	0x10
	.byte	0x6
	.word	0x344
	.long	0xb26
	.uleb128 0xb
	.long	.LASF175
	.byte	0x6
	.word	0x34a
	.long	0xb2b
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF176
	.byte	0x6
	.word	0x351
	.long	0xde
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.uleb128 0xb
	.long	.LASF177
	.byte	0x6
	.word	0x354
	.long	0x6b5
	.byte	0x2
	.byte	0x23
	.uleb128 0x4
	.uleb128 0xb
	.long	.LASF178
	.byte	0x6
	.word	0x358
	.long	0x7fc
	.byte	0x2
	.byte	0x23
	.uleb128 0x6
	.uleb128 0xb
	.long	.LASF179
	.byte	0x6
	.word	0x35c
	.long	0xb3c
	.byte	0x2
	.byte	0x23
	.uleb128 0x8
	.uleb128 0xb
	.long	.LASF180
	.byte	0x6
	.word	0x35e
	.long	0x1c0
	.byte	0x2
	.byte	0x23
	.uleb128 0xa
	.uleb128 0xb
	.long	.LASF181
	.byte	0x6
	.word	0x362
	.long	0xb4d
	.byte	0x2
	.byte	0x23
	.uleb128 0xc
	.uleb128 0xb
	.long	.LASF182
	.byte	0x6
	.word	0x364
	.long	0x1c0
	.byte	0x2
	.byte	0x23
	.uleb128 0xe
	.byte	0
	.uleb128 0x10
	.long	0xaa4
	.uleb128 0x5
	.byte	0x2
	.long	0xa98
	.uleb128 0x15
	.long	0x9cf
	.long	0xb3c
	.uleb128 0x16
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0xb31
	.uleb128 0x15
	.long	0x981
	.long	0xb4d
	.uleb128 0x16
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0xb42
	.uleb128 0x7
	.long	.LASF183
	.byte	0x6
	.word	0x36a
	.long	0xb26
	.uleb128 0xa
	.byte	0x1
	.byte	0x6
	.word	0x36f
	.long	0xb78
	.uleb128 0xb
	.long	.LASF184
	.byte	0x6
	.word	0x3b1
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.byte	0
	.uleb128 0x7
	.long	.LASF185
	.byte	0x6
	.word	0x3b3
	.long	0xb5f
	.uleb128 0xa
	.byte	0x12
	.byte	0x6
	.word	0x3c3
	.long	0xc15
	.uleb128 0xb
	.long	.LASF186
	.byte	0x6
	.word	0x3c5
	.long	0xc1a
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF160
	.byte	0x6
	.word	0x3d1
	.long	0x9c9
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.uleb128 0xb
	.long	.LASF161
	.byte	0x6
	.word	0x3d4
	.long	0x1c0
	.byte	0x2
	.byte	0x23
	.uleb128 0x4
	.uleb128 0xb
	.long	.LASF187
	.byte	0x6
	.word	0x3e0
	.long	0xc36
	.byte	0x2
	.byte	0x23
	.uleb128 0x6
	.uleb128 0xb
	.long	.LASF188
	.byte	0x6
	.word	0x3e2
	.long	0x1c0
	.byte	0x2
	.byte	0x23
	.uleb128 0x8
	.uleb128 0xb
	.long	.LASF189
	.byte	0x6
	.word	0x3e6
	.long	0xc47
	.byte	0x2
	.byte	0x23
	.uleb128 0xa
	.uleb128 0xb
	.long	.LASF190
	.byte	0x6
	.word	0x3e8
	.long	0x1c0
	.byte	0x2
	.byte	0x23
	.uleb128 0xc
	.uleb128 0xb
	.long	.LASF191
	.byte	0x6
	.word	0x3eb
	.long	0xc63
	.byte	0x2
	.byte	0x23
	.uleb128 0xe
	.uleb128 0xb
	.long	.LASF192
	.byte	0x6
	.word	0x3ed
	.long	0x1c0
	.byte	0x2
	.byte	0x23
	.uleb128 0x10
	.byte	0
	.uleb128 0x10
	.long	0xb84
	.uleb128 0x5
	.byte	0x2
	.long	0xb78
	.uleb128 0x15
	.long	0xc31
	.long	0xc2b
	.uleb128 0x16
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0x616
	.uleb128 0x10
	.long	0xc2b
	.uleb128 0x5
	.byte	0x2
	.long	0xc20
	.uleb128 0x15
	.long	0x802
	.long	0xc47
	.uleb128 0x16
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0xc3c
	.uleb128 0x15
	.long	0xc5e
	.long	0xc58
	.uleb128 0x16
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0x8e9
	.uleb128 0x10
	.long	0xc58
	.uleb128 0x5
	.byte	0x2
	.long	0xc4d
	.uleb128 0x7
	.long	.LASF193
	.byte	0x6
	.word	0x3fc
	.long	0xc15
	.uleb128 0x17
	.long	.LASF194
	.byte	0x8
	.byte	0x3f
	.long	0xc69
	.byte	0x1
	.byte	0x1
	.uleb128 0x17
	.long	.LASF195
	.byte	0x8
	.byte	0x40
	.long	0xb53
	.byte	0x1
	.byte	0x1
	.uleb128 0x17
	.long	.LASF196
	.byte	0x8
	.byte	0x41
	.long	0xb78
	.byte	0x1
	.byte	0x1
	.uleb128 0x17
	.long	.LASF197
	.byte	0x8
	.byte	0x42
	.long	0xa98
	.byte	0x1
	.byte	0x1
	.uleb128 0x18
	.byte	0x1
	.long	.LASF204
	.byte	0x1
	.byte	0xbd
	.byte	0x1
	.long	.LFB67
	.long	.LFE67
	.byte	0x3
	.byte	0x92
	.uleb128 0x20
	.sleb128 2
	.byte	0x1
	.long	0xd01
	.uleb128 0x19
	.long	.LASF198
	.byte	0x1
	.byte	0xbf
	.long	0xbd
	.long	.LLST6
	.uleb128 0x1a
	.long	.LBB5
	.long	.LBE5
	.uleb128 0x1b
	.long	.LASF213
	.byte	0x1
	.byte	0xc6
	.long	0xd07
	.uleb128 0x1c
	.long	.LASF202
	.byte	0x1
	.byte	0xc8
	.long	0x6bb
	.long	.LLST7
	.uleb128 0x1d
	.long	.LVL20
	.byte	0x1
	.long	0xe19
	.byte	0
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0xc69
	.uleb128 0x10
	.long	0xd01
	.uleb128 0x1e
	.byte	0x1
	.long	.LASF206
	.byte	0x1
	.byte	0x6f
	.byte	0x1
	.long	0x377
	.long	.LFB66
	.long	.LFE66
	.byte	0x3
	.byte	0x92
	.uleb128 0x20
	.sleb128 2
	.byte	0x1
	.long	0xd7c
	.uleb128 0x19
	.long	.LASF199
	.byte	0x1
	.byte	0x71
	.long	0x6b5
	.long	.LLST3
	.uleb128 0x19
	.long	.LASF200
	.byte	0x1
	.byte	0x72
	.long	0x1b4
	.long	.LLST4
	.uleb128 0x1f
	.long	.LASF201
	.byte	0x1
	.byte	0x73
	.long	0xd7c
	.byte	0x6
	.byte	0x64
	.byte	0x93
	.uleb128 0x1
	.byte	0x65
	.byte	0x93
	.uleb128 0x1
	.uleb128 0x1c
	.long	.LASF117
	.byte	0x1
	.byte	0x78
	.long	0x377
	.long	.LLST5
	.uleb128 0x20
	.long	.LASF203
	.byte	0x1
	.byte	0x7a
	.long	0x6a4
	.byte	0x6
	.byte	0x6e
	.byte	0x93
	.uleb128 0x1
	.byte	0x6f
	.byte	0x93
	.uleb128 0x1
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0x295
	.uleb128 0x18
	.byte	0x1
	.long	.LASF205
	.byte	0x1
	.byte	0x5a
	.byte	0x1
	.long	.LFB65
	.long	.LFE65
	.byte	0x3
	.byte	0x92
	.uleb128 0x20
	.sleb128 2
	.byte	0x1
	.long	0xdbe
	.uleb128 0x19
	.long	.LASF71
	.byte	0x1
	.byte	0x5c
	.long	0x6bb
	.long	.LLST2
	.uleb128 0x20
	.long	.LASF74
	.byte	0x1
	.byte	0x60
	.long	0x6a4
	.byte	0x6
	.byte	0x6e
	.byte	0x93
	.uleb128 0x1
	.byte	0x6f
	.byte	0x93
	.uleb128 0x1
	.byte	0
	.uleb128 0x1e
	.byte	0x1
	.long	.LASF207
	.byte	0x1
	.byte	0x37
	.byte	0x1
	.long	0x295
	.long	.LFB64
	.long	.LFE64
	.byte	0x3
	.byte	0x92
	.uleb128 0x20
	.sleb128 2
	.byte	0x1
	.long	0xe0c
	.uleb128 0x19
	.long	.LASF208
	.byte	0x1
	.byte	0x39
	.long	0x6b5
	.long	.LLST0
	.uleb128 0x21
	.string	"ev"
	.byte	0x1
	.byte	0x3c
	.long	0x295
	.long	.LLST1
	.uleb128 0x20
	.long	.LASF209
	.byte	0x1
	.byte	0x3d
	.long	0x6a4
	.byte	0x6
	.byte	0x6e
	.byte	0x93
	.uleb128 0x1
	.byte	0x6f
	.byte	0x93
	.uleb128 0x1
	.byte	0
	.uleb128 0x22
	.long	.LASF214
	.byte	0x8
	.byte	0x54
	.byte	0x1
	.long	0xd01
	.byte	0x3
	.uleb128 0x23
	.byte	0x1
	.byte	0x1
	.long	.LASF215
	.long	.LASF215
	.byte	0x9
	.byte	0x9b
	.byte	0
	.section	.debug_abbrev,"",@progbits
.Ldebug_abbrev0:
	.uleb128 0x1
	.uleb128 0x11
	.byte	0x1
	.uleb128 0x25
	.uleb128 0xe
	.uleb128 0x13
	.uleb128 0xb
	.uleb128 0x3
	.uleb128 0xe
	.uleb128 0x1b
	.uleb128 0xe
	.uleb128 0x55
	.uleb128 0x6
	.uleb128 0x11
	.uleb128 0x1
	.uleb128 0x52
	.uleb128 0x1
	.uleb128 0x10
	.uleb128 0x6
	.byte	0
	.byte	0
	.uleb128 0x2
	.uleb128 0x24
	.byte	0
	.uleb128 0xb
	.uleb128 0xb
	.uleb128 0x3e
	.uleb128 0xb
	.uleb128 0x3
	.uleb128 0x8
	.byte	0
	.byte	0
	.uleb128 0x3
	.uleb128 0x24
	.byte	0
	.uleb128 0xb
	.uleb128 0xb
	.uleb128 0x3e
	.uleb128 0xb
	.uleb128 0x3
	.uleb128 0xe
	.byte	0
	.byte	0
	.uleb128 0x4
	.uleb128 0x16
	.byte	0
	.uleb128 0x3
	.uleb128 0xe
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0xb
	.uleb128 0x49
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0x5
	.uleb128 0xf
	.byte	0
	.uleb128 0xb
	.uleb128 0xb
	.uleb128 0x49
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0x6
	.uleb128 0x15
	.byte	0
	.uleb128 0x27
	.uleb128 0xc
	.byte	0
	.byte	0
	.uleb128 0x7
	.uleb128 0x16
	.byte	0
	.uleb128 0x3
	.uleb128 0xe
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0x5
	.uleb128 0x49
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0x8
	.uleb128 0x4
	.byte	0x1
	.uleb128 0x3e
	.uleb128 0xb
	.uleb128 0xb
	.uleb128 0xb
	.uleb128 0x49
	.uleb128 0x13
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0x5
	.uleb128 0x1
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0x9
	.uleb128 0x28
	.byte	0
	.uleb128 0x3
	.uleb128 0xe
	.uleb128 0x1c
	.uleb128 0xb
	.byte	0
	.byte	0
	.uleb128 0xa
	.uleb128 0x13
	.byte	0x1
	.uleb128 0xb
	.uleb128 0xb
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0x5
	.uleb128 0x1
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0xb
	.uleb128 0xd
	.byte	0
	.uleb128 0x3
	.uleb128 0xe
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0x5
	.uleb128 0x49
	.uleb128 0x13
	.uleb128 0x38
	.uleb128 0xa
	.byte	0
	.byte	0
	.uleb128 0xc
	.uleb128 0x13
	.byte	0x1
	.uleb128 0x3
	.uleb128 0xe
	.uleb128 0xb
	.uleb128 0xb
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0xb
	.uleb128 0x1
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0xd
	.uleb128 0xd
	.byte	0
	.uleb128 0x3
	.uleb128 0xe
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0xb
	.uleb128 0x49
	.uleb128 0x13
	.uleb128 0x38
	.uleb128 0xa
	.byte	0
	.byte	0
	.uleb128 0xe
	.uleb128 0x13
	.byte	0x1
	.uleb128 0x3
	.uleb128 0xe
	.uleb128 0xb
	.uleb128 0xb
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0x5
	.uleb128 0x1
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0xf
	.uleb128 0xd
	.byte	0
	.uleb128 0x3
	.uleb128 0x8
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0x5
	.uleb128 0x49
	.uleb128 0x13
	.uleb128 0x38
	.uleb128 0xa
	.byte	0
	.byte	0
	.uleb128 0x10
	.uleb128 0x26
	.byte	0
	.uleb128 0x49
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0x11
	.uleb128 0xd
	.byte	0
	.uleb128 0x3
	.uleb128 0x8
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0xb
	.uleb128 0x49
	.uleb128 0x13
	.uleb128 0x38
	.uleb128 0xa
	.byte	0
	.byte	0
	.uleb128 0x12
	.uleb128 0x4
	.byte	0x1
	.uleb128 0x3e
	.uleb128 0xb
	.uleb128 0xb
	.uleb128 0xb
	.uleb128 0x49
	.uleb128 0x13
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0xb
	.uleb128 0x1
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0x13
	.uleb128 0x35
	.byte	0
	.uleb128 0x49
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0x14
	.uleb128 0x13
	.byte	0x1
	.uleb128 0xb
	.uleb128 0xb
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0xb
	.uleb128 0x1
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0x15
	.uleb128 0x1
	.byte	0x1
	.uleb128 0x49
	.uleb128 0x13
	.uleb128 0x1
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0x16
	.uleb128 0x21
	.byte	0
	.byte	0
	.byte	0
	.uleb128 0x17
	.uleb128 0x34
	.byte	0
	.uleb128 0x3
	.uleb128 0xe
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0xb
	.uleb128 0x49
	.uleb128 0x13
	.uleb128 0x3f
	.uleb128 0xc
	.uleb128 0x3c
	.uleb128 0xc
	.byte	0
	.byte	0
	.uleb128 0x18
	.uleb128 0x2e
	.byte	0x1
	.uleb128 0x3f
	.uleb128 0xc
	.uleb128 0x3
	.uleb128 0xe
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0xb
	.uleb128 0x27
	.uleb128 0xc
	.uleb128 0x11
	.uleb128 0x1
	.uleb128 0x12
	.uleb128 0x1
	.uleb128 0x40
	.uleb128 0xa
	.uleb128 0x2117
	.uleb128 0xc
	.uleb128 0x1
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0x19
	.uleb128 0x5
	.byte	0
	.uleb128 0x3
	.uleb128 0xe
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0xb
	.uleb128 0x49
	.uleb128 0x13
	.uleb128 0x2
	.uleb128 0x6
	.byte	0
	.byte	0
	.uleb128 0x1a
	.uleb128 0xb
	.byte	0x1
	.uleb128 0x11
	.uleb128 0x1
	.uleb128 0x12
	.uleb128 0x1
	.byte	0
	.byte	0
	.uleb128 0x1b
	.uleb128 0x34
	.byte	0
	.uleb128 0x3
	.uleb128 0xe
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0xb
	.uleb128 0x49
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0x1c
	.uleb128 0x34
	.byte	0
	.uleb128 0x3
	.uleb128 0xe
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0xb
	.uleb128 0x49
	.uleb128 0x13
	.uleb128 0x2
	.uleb128 0x6
	.byte	0
	.byte	0
	.uleb128 0x1d
	.uleb128 0x4109
	.byte	0
	.uleb128 0x11
	.uleb128 0x1
	.uleb128 0x2115
	.uleb128 0xc
	.uleb128 0x31
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0x1e
	.uleb128 0x2e
	.byte	0x1
	.uleb128 0x3f
	.uleb128 0xc
	.uleb128 0x3
	.uleb128 0xe
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0xb
	.uleb128 0x27
	.uleb128 0xc
	.uleb128 0x49
	.uleb128 0x13
	.uleb128 0x11
	.uleb128 0x1
	.uleb128 0x12
	.uleb128 0x1
	.uleb128 0x40
	.uleb128 0xa
	.uleb128 0x2117
	.uleb128 0xc
	.uleb128 0x1
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0x1f
	.uleb128 0x5
	.byte	0
	.uleb128 0x3
	.uleb128 0xe
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0xb
	.uleb128 0x49
	.uleb128 0x13
	.uleb128 0x2
	.uleb128 0xa
	.byte	0
	.byte	0
	.uleb128 0x20
	.uleb128 0x34
	.byte	0
	.uleb128 0x3
	.uleb128 0xe
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0xb
	.uleb128 0x49
	.uleb128 0x13
	.uleb128 0x2
	.uleb128 0xa
	.byte	0
	.byte	0
	.uleb128 0x21
	.uleb128 0x34
	.byte	0
	.uleb128 0x3
	.uleb128 0x8
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0xb
	.uleb128 0x49
	.uleb128 0x13
	.uleb128 0x2
	.uleb128 0x6
	.byte	0
	.byte	0
	.uleb128 0x22
	.uleb128 0x2e
	.byte	0
	.uleb128 0x3
	.uleb128 0xe
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0xb
	.uleb128 0x27
	.uleb128 0xc
	.uleb128 0x49
	.uleb128 0x13
	.uleb128 0x20
	.uleb128 0xb
	.byte	0
	.byte	0
	.uleb128 0x23
	.uleb128 0x2e
	.byte	0
	.uleb128 0x3f
	.uleb128 0xc
	.uleb128 0x3c
	.uleb128 0xc
	.uleb128 0x2007
	.uleb128 0xe
	.uleb128 0x3
	.uleb128 0xe
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0xb
	.byte	0
	.byte	0
	.byte	0
	.section	.debug_loc,"",@progbits
.Ldebug_loc0:
.LLST6:
	.long	.LVL17
	.long	.LVL18
	.word	0x1
	.byte	0x68
	.long	.LVL18
	.long	.LFE67
	.word	0x4
	.byte	0xf3
	.uleb128 0x1
	.byte	0x68
	.byte	0x9f
	.long	0
	.long	0
.LLST7:
	.long	.LVL19
	.long	.LVL20-1
	.word	0x6
	.byte	0x66
	.byte	0x93
	.uleb128 0x1
	.byte	0x67
	.byte	0x93
	.uleb128 0x1
	.long	0
	.long	0
.LLST3:
	.long	.LVL9
	.long	.LVL11
	.word	0x6
	.byte	0x68
	.byte	0x93
	.uleb128 0x1
	.byte	0x69
	.byte	0x93
	.uleb128 0x1
	.long	.LVL11
	.long	.LVL12
	.word	0x6
	.byte	0x6a
	.byte	0x93
	.uleb128 0x1
	.byte	0x6b
	.byte	0x93
	.uleb128 0x1
	.long	.LVL12
	.long	.LFE66
	.word	0x4
	.byte	0xf3
	.uleb128 0x1
	.byte	0x68
	.byte	0x9f
	.long	0
	.long	0
.LLST4:
	.long	.LVL9
	.long	.LVL13
	.word	0x6
	.byte	0x66
	.byte	0x93
	.uleb128 0x1
	.byte	0x67
	.byte	0x93
	.uleb128 0x1
	.long	.LVL13
	.long	.LFE66
	.word	0x4
	.byte	0xf3
	.uleb128 0x1
	.byte	0x66
	.byte	0x9f
	.long	0
	.long	0
.LLST5:
	.long	.LVL9
	.long	.LVL14
	.word	0x2
	.byte	0x30
	.byte	0x9f
	.long	.LVL14
	.long	.LVL15
	.word	0x6
	.byte	0x68
	.byte	0x93
	.uleb128 0x1
	.byte	0x69
	.byte	0x93
	.uleb128 0x1
	.long	.LVL15
	.long	.LVL16
	.word	0x2
	.byte	0x30
	.byte	0x9f
	.long	0
	.long	0
.LLST2:
	.long	.LVL6
	.long	.LVL8
	.word	0x6
	.byte	0x68
	.byte	0x93
	.uleb128 0x1
	.byte	0x69
	.byte	0x93
	.uleb128 0x1
	.long	.LVL8
	.long	.LFE65
	.word	0x6
	.byte	0x6a
	.byte	0x93
	.uleb128 0x1
	.byte	0x6b
	.byte	0x93
	.uleb128 0x1
	.long	0
	.long	0
.LLST0:
	.long	.LVL0
	.long	.LVL2
	.word	0x6
	.byte	0x68
	.byte	0x93
	.uleb128 0x1
	.byte	0x69
	.byte	0x93
	.uleb128 0x1
	.long	.LVL2
	.long	.LFE64
	.word	0x6
	.byte	0x6a
	.byte	0x93
	.uleb128 0x1
	.byte	0x6b
	.byte	0x93
	.uleb128 0x1
	.long	0
	.long	0
.LLST1:
	.long	.LVL3
	.long	.LVL4
	.word	0x2
	.byte	0x30
	.byte	0x9f
	.long	.LVL5
	.long	.LFE64
	.word	0x2
	.byte	0x34
	.byte	0x9f
	.long	0
	.long	0
	.section	.debug_aranges,"",@progbits
	.long	0x34
	.word	0x2
	.long	.Ldebug_info0
	.byte	0x4
	.byte	0
	.word	0
	.word	0
	.long	.LFB64
	.long	.LFE64-.LFB64
	.long	.LFB65
	.long	.LFE65-.LFB65
	.long	.LFB66
	.long	.LFE66-.LFB66
	.long	.LFB67
	.long	.LFE67-.LFB67
	.long	0
	.long	0
	.section	.debug_ranges,"",@progbits
.Ldebug_ranges0:
	.long	.LFB64
	.long	.LFE64
	.long	.LFB65
	.long	.LFE65
	.long	.LFB66
	.long	.LFE66
	.long	.LFB67
	.long	.LFE67
	.long	0
	.long	0
	.section	.debug_line,"",@progbits
.Ldebug_line0:
	.section	.debug_str,"MS",@progbits,1
.LASF134:
	.string	"OSEE_ACTION_CALLBACK"
.LASF13:
	.string	"OsEE_event_mask"
.LASF191:
	.string	"p_alarm_ptr_array"
.LASF97:
	.string	"OsEE_byte"
.LASF131:
	.string	"OSEE_ACTION_TASK"
.LASF165:
	.string	"p_stk_sn"
.LASF33:
	.string	"TickType"
.LASF167:
	.string	"app_mode"
.LASF10:
	.string	"OsEE_reg"
.LASF158:
	.string	"OsEE_autostart_trigger"
.LASF119:
	.string	"OsEE_TDB"
.LASF208:
	.string	"p_tdb_act"
.LASF211:
	.string	"/home/user/Osek/OSEK-GroupProject/erika/src/ee_oo_kernel.c"
.LASF56:
	.string	"E_OS_PROTECTION_ARRIVAL"
.LASF139:
	.string	"type"
.LASF188:
	.string	"res_array_size"
.LASF193:
	.string	"OsEE_KDB"
.LASF22:
	.string	"OSEE_TASK_TYPE_IDLE"
.LASF9:
	.string	"long long unsigned int"
.LASF205:
	.string	"osEE_task_end"
.LASF69:
	.string	"StatusType"
.LASF31:
	.string	"OsEE_task_status"
.LASF87:
	.string	"OsEE_SCB"
.LASF198:
	.string	"isr2_id"
.LASF25:
	.string	"OSEE_TASK_SUSPENDED"
.LASF21:
	.string	"OSEE_TASK_TYPE_ISR2"
.LASF183:
	.string	"OsEE_CDB"
.LASF75:
	.string	"task_type"
.LASF34:
	.string	"maxallowedvalue"
.LASF194:
	.string	"osEE_kdb_var"
.LASF164:
	.string	"p_free_sn"
.LASF1:
	.string	"long long int"
.LASF3:
	.string	"signed char"
.LASF19:
	.string	"OSEE_TASK_TYPE_BASIC"
.LASF182:
	.string	"autostart_trigger_array_size"
.LASF108:
	.string	"OsEE_MCB"
.LASF55:
	.string	"E_OS_PROTECTION_TIME"
.LASF67:
	.string	"E_OS_SYS_ACT"
.LASF177:
	.string	"p_idle_task"
.LASF23:
	.string	"OsEE_task_type"
.LASF106:
	.string	"p_cb"
.LASF16:
	.string	"TaskPrio"
.LASF7:
	.string	"long int"
.LASF187:
	.string	"p_res_ptr_array"
.LASF145:
	.string	"OSEE_TRIGGER_REENABLED"
.LASF130:
	.string	"OsEE_CounterDB"
.LASF62:
	.string	"E_OS_CORE"
.LASF40:
	.string	"E_OS_ACCESS"
.LASF95:
	.string	"OsEE_HDB"
.LASF6:
	.string	"uint16_t"
.LASF102:
	.string	"OsEE_kernel_status"
.LASF91:
	.string	"OsEE_SDB"
.LASF39:
	.string	"E_OK"
.LASF86:
	.string	"p_tos"
.LASF154:
	.string	"second_tick_parameter"
.LASF153:
	.string	"first_tick_parameter"
.LASF206:
	.string	"osEE_task_event_set_mask"
.LASF42:
	.string	"E_OS_ID"
.LASF38:
	.string	"MemSize"
.LASF215:
	.string	"osEE_scheduler_task_set_running"
.LASF64:
	.string	"E_OS_SYS_SUSPEND_NESTING_LIMIT"
.LASF99:
	.string	"OSEE_KERNEL_STARTING"
.LASF184:
	.string	"dummy"
.LASF57:
	.string	"E_OS_PROTECTION_LOCKED"
.LASF76:
	.string	"task_func"
.LASF126:
	.string	"value"
.LASF79:
	.string	"max_num_of_act"
.LASF109:
	.string	"OsEE_MDB"
.LASF114:
	.string	"p_last_m"
.LASF156:
	.string	"p_trigger_ptr_array"
.LASF0:
	.string	"unsigned int"
.LASF36:
	.string	"AlarmBaseType"
.LASF120:
	.string	"OsEE_TriggerQ"
.LASF132:
	.string	"OSEE_ACTION_EVENT"
.LASF128:
	.string	"p_counter_cb"
.LASF8:
	.string	"long unsigned int"
.LASF149:
	.string	"OsEE_TriggerCB"
.LASF54:
	.string	"E_OS_PROTECTION_MEMORY"
.LASF186:
	.string	"p_kcb"
.LASF147:
	.string	"when"
.LASF18:
	.string	"TaskFunc"
.LASF15:
	.string	"TaskType"
.LASF140:
	.string	"OsEE_action"
.LASF143:
	.string	"OSEE_TRIGGER_ACTIVE"
.LASF166:
	.string	"os_status"
.LASF14:
	.string	"AppModeType"
.LASF73:
	.string	"OsEE_TDB_tag"
.LASF85:
	.string	"OsEE_SCB_tag"
.LASF30:
	.string	"OSEE_TASK_CHAINED"
.LASF214:
	.string	"osEE_get_kernel"
.LASF81:
	.string	"OsEE_RQ"
.LASF174:
	.string	"OsEE_CCB"
.LASF176:
	.string	"p_idle_hook"
.LASF169:
	.string	"prev_s_isr_all_status"
.LASF189:
	.string	"p_counter_ptr_array"
.LASF190:
	.string	"counter_array_size"
.LASF192:
	.string	"alarm_array_size"
.LASF203:
	.string	"p_tcb_waking_up"
.LASF172:
	.string	"s_isr_os_cnt"
.LASF46:
	.string	"E_OS_STATE"
.LASF28:
	.string	"OSEE_TASK_WAITING"
.LASF123:
	.string	"p_counter_db"
.LASF173:
	.string	"d_isr_all_cnt"
.LASF163:
	.string	"p_curr"
.LASF101:
	.string	"OSEE_KERNEL_SHUTDOWN"
.LASF65:
	.string	"E_OS_SYS_TASK"
.LASF105:
	.string	"OsEE_MDB_tag"
.LASF133:
	.string	"OSEE_ACTION_COUNTER"
.LASF2:
	.string	"long double"
.LASF110:
	.string	"OsEE_ResourceDB"
.LASF162:
	.string	"OsEE_autostart_tdb"
.LASF124:
	.string	"action"
.LASF104:
	.string	"p_owner"
.LASF17:
	.string	"TaskActivation"
.LASF12:
	.string	"OsEE_tick_type"
.LASF157:
	.string	"trigger_array_size"
.LASF53:
	.string	"E_OS_PARAM_POINTER"
.LASF103:
	.string	"prev_prio"
.LASF116:
	.string	"event_mask"
.LASF89:
	.string	"p_bos"
.LASF51:
	.string	"E_OS_DISABLEDINT"
.LASF185:
	.string	"OsEE_KCB"
.LASF80:
	.string	"OsEE_SN"
.LASF50:
	.string	"E_OS_MISSINGEND"
.LASF204:
	.string	"osEE_activate_isr2"
.LASF107:
	.string	"prio"
.LASF35:
	.string	"ticksperbase"
.LASF142:
	.string	"OSEE_TRIGGER_CANCELED"
.LASF77:
	.string	"ready_prio"
.LASF27:
	.string	"OSEE_TASK_READY_STACKED"
.LASF47:
	.string	"E_OS_VALUE"
.LASF88:
	.string	"OsEE_SDB_tag"
.LASF151:
	.string	"OsEE_AlarmDB"
.LASF111:
	.string	"current_num_of_act"
.LASF178:
	.string	"p_sys_counter_db"
.LASF74:
	.string	"p_tcb"
.LASF4:
	.string	"unsigned char"
.LASF58:
	.string	"E_OS_PROTECTION_EXCEPTION"
.LASF201:
	.string	"p_ev"
.LASF82:
	.string	"OsEE_CTX_tag"
.LASF66:
	.string	"E_OS_SYS_STACK"
.LASF100:
	.string	"OSEE_KERNEL_STARTED"
.LASF121:
	.string	"OsEE_TriggerDB_tag"
.LASF129:
	.string	"info"
.LASF60:
	.string	"E_OS_INTERFERENCE_DEADLOCK"
.LASF61:
	.string	"E_OS_NESTING_DEADLOCK"
.LASF212:
	.string	"/home/user/Osek/OSEK-GroupProject/erika"
.LASF70:
	.string	"p_next"
.LASF26:
	.string	"OSEE_TASK_READY"
.LASF202:
	.string	"p_act_tdb"
.LASF43:
	.string	"E_OS_LIMIT"
.LASF146:
	.string	"OsEE_trigger_status"
.LASF115:
	.string	"wait_mask"
.LASF175:
	.string	"p_ccb"
.LASF196:
	.string	"osEE_kcb_var"
.LASF195:
	.string	"osEE_cdb_var"
.LASF150:
	.string	"OsEE_TriggerDB"
.LASF159:
	.string	"OsEE_autostart_tdb_tag"
.LASF20:
	.string	"OSEE_TASK_TYPE_EXTENDED"
.LASF96:
	.string	"OsEE_kernel_cb"
.LASF170:
	.string	"prev_s_isr_os_status"
.LASF168:
	.string	"last_error"
.LASF72:
	.string	"OsEE_SN_tag"
.LASF112:
	.string	"current_prio"
.LASF63:
	.string	"E_OS_SYS_INIT"
.LASF125:
	.string	"trigger_queue"
.LASF68:
	.string	"OsEE_status_type"
.LASF71:
	.string	"p_tdb"
.LASF98:
	.string	"OSEE_KERNEL_INITIALIZED"
.LASF49:
	.string	"E_OS_ILLEGAL_ADDRESS"
.LASF207:
	.string	"osEE_task_activated"
.LASF181:
	.string	"p_autostart_trigger_array"
.LASF11:
	.string	"OsEE_mem_size"
.LASF122:
	.string	"p_trigger_cb"
.LASF117:
	.string	"p_own_sn"
.LASF137:
	.string	"OsEE_action_param"
.LASF152:
	.string	"p_trigger_db"
.LASF94:
	.string	"p_scb"
.LASF32:
	.string	"TaskStateType"
.LASF138:
	.string	"param"
.LASF199:
	.string	"p_tdb_waking_up"
.LASF141:
	.string	"OSEE_TRIGGER_INACTIVE"
.LASF45:
	.string	"E_OS_RESOURCE"
.LASF200:
	.string	"Mask"
.LASF161:
	.string	"tdb_array_size"
.LASF171:
	.string	"s_isr_all_cnt"
.LASF148:
	.string	"cycle"
.LASF209:
	.string	"p_tcb_act"
.LASF136:
	.string	"mask"
.LASF213:
	.string	"p_kdb"
.LASF113:
	.string	"status"
.LASF210:
	.string	"GNU C11 7.3.0 -mn-flash=1 -mno-skip-bug -mmcu=avr5 -g -Os -std=gnu11 -ffunction-sections -fdata-sections"
.LASF78:
	.string	"dispatch_prio"
.LASF5:
	.string	"uint8_t"
.LASF48:
	.string	"E_OS_SERVICEID"
.LASF90:
	.string	"stack_size"
.LASF144:
	.string	"OSEE_TRIGGER_EXPIRED"
.LASF118:
	.string	"OsEE_TCB"
.LASF180:
	.string	"autostart_tdb_array_size"
.LASF92:
	.string	"OsEE_HDB_tag"
.LASF179:
	.string	"p_autostart_tdb_array"
.LASF127:
	.string	"OsEE_CounterCB"
.LASF44:
	.string	"E_OS_NOFUNC"
.LASF93:
	.string	"p_sdb"
.LASF41:
	.string	"E_OS_CALLEVEL"
.LASF24:
	.string	"TaskExecutionType"
.LASF29:
	.string	"OSEE_TASK_RUNNING"
.LASF155:
	.string	"OsEE_autostart_trigger_info"
.LASF37:
	.string	"EventMaskType"
.LASF197:
	.string	"osEE_ccb_var"
.LASF135:
	.string	"OsEE_action_type"
.LASF52:
	.string	"E_OS_STACKFAULT"
.LASF160:
	.string	"p_tdb_ptr_array"
.LASF83:
	.string	"p_ctx"
.LASF59:
	.string	"E_OS_SPINLOCK"
.LASF84:
	.string	"OsEE_CTX"
	.ident	"GCC: (GNU) 7.3.0"
