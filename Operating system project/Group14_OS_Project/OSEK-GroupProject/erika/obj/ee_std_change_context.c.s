	.file	"ee_std_change_context.c"
__SP_H__ = 0x3e
__SP_L__ = 0x3d
__SREG__ = 0x3f
__tmp_reg__ = 0
__zero_reg__ = 1
	.text
.Ltext0:
	.cfi_sections	.debug_frame
	.section	.text.osEE_change_context_from_running,"ax",@progbits
.global	osEE_change_context_from_running
	.type	osEE_change_context_from_running, @function
osEE_change_context_from_running:
.LFB64:
	.file 1 "/home/user/Osek/OSEK-GroupProject/erika/src/ee_std_change_context.c"
	.loc 1 62 0
	.cfi_startproc
.LVL0:
/* prologue: function */
/* frame size = 0 */
/* stack size = 0 */
.L__stack_usage = 0
	movw r30,r22
.LVL1:
	movw r26,r24
	adiw r26,2
	ld r20,X+
	ld r21,X
	ldd r22,Z+2
	ldd r23,Z+3
.LVL2:
	.loc 1 65 0
	ldd r26,Z+4
	ldd r27,Z+5
	adiw r26,2
	ld r24,X+
	ld r25,X
.LVL3:
	sbiw r24,2
	brne .L2
	.loc 1 66 0
	movw r24,r30
	jmp osEE_hal_save_ctx_and_restore_ctx
.LVL4:
.L2:
	.loc 1 69 0
	movw r24,r30
	jmp osEE_hal_save_ctx_and_ready2stacked
.LVL5:
	.cfi_endproc
.LFE64:
	.size	osEE_change_context_from_running, .-osEE_change_context_from_running
	.section	.text.osEE_change_context_from_task_end,"ax",@progbits
.global	osEE_change_context_from_task_end
	.type	osEE_change_context_from_task_end, @function
osEE_change_context_from_task_end:
.LFB65:
	.loc 1 82 0
	.cfi_startproc
.LVL6:
/* prologue: function */
/* frame size = 0 */
/* stack size = 0 */
.L__stack_usage = 0
	movw r24,r22
.LVL7:
	movw r26,r22
	adiw r26,2
	ld r22,X+
	ld r23,X
	sbiw r26,2+1
.LVL8:
	.loc 1 85 0
	adiw r26,4
	ld r30,X+
	ld r31,X
	ldd r18,Z+2
	ldd r19,Z+3
	cpi r18,2
	cpc r19,__zero_reg__
	brne .L4
.LVL9:
.LBB8:
.LBB9:
	.loc 1 86 0
	jmp osEE_hal_restore_ctx
.LVL10:
.L4:
.LBE9:
.LBE8:
	.loc 1 88 0
	jmp osEE_hal_ready2stacked
.LVL11:
	.cfi_endproc
.LFE65:
	.size	osEE_change_context_from_task_end, .-osEE_change_context_from_task_end
	.section	.text.osEE_idle_task_terminate,"ax",@progbits
.global	osEE_idle_task_terminate
	.type	osEE_idle_task_terminate, @function
osEE_idle_task_terminate:
.LFB66:
	.loc 1 102 0
	.cfi_startproc
.LVL12:
/* prologue: function */
/* frame size = 0 */
/* stack size = 0 */
.L__stack_usage = 0
	.loc 1 107 0
	movw r26,r24
	adiw r26,2
	ld r22,X+
	ld r23,X
	sbiw r26,2+1
.LVL13:
	.loc 1 108 0
	ld r30,X+
	ld r31,X
	ld r20,Z
	ldd r21,Z+1
.LVL14:
	.loc 1 109 0
	movw r26,r22
	ld r30,X+
	ld r31,X
.LVL15:
.L7:
	.loc 1 113 0 discriminator 2
	ldd r18,Z+18
	ldd r19,Z+19
.LVL16:
	.loc 1 114 0 discriminator 2
	cp r18,__zero_reg__
	cpc r19,__zero_reg__
	breq .L6
	.loc 1 114 0 is_stmt 0 discriminator 1
	cp r20,r18
	cpc r21,r19
	brne .L8
.L6:
	.loc 1 117 0 is_stmt 1
	movw r26,r22
	st X+,r30
	st X,r31
	.loc 1 119 0
	jmp osEE_hal_restore_ctx
.LVL17:
.L8:
	movw r30,r18
.LVL18:
	rjmp .L7
	.cfi_endproc
.LFE66:
	.size	osEE_idle_task_terminate, .-osEE_idle_task_terminate
	.section	.text.osEE_scheduler_task_end,"ax",@progbits
.global	osEE_scheduler_task_end
	.type	osEE_scheduler_task_end, @function
osEE_scheduler_task_end:
.LFB67:
	.loc 1 129 0
	.cfi_startproc
	push r28
.LCFI0:
	.cfi_def_cfa_offset 3
	.cfi_offset 28, -2
	push r29
.LCFI1:
	.cfi_def_cfa_offset 4
	.cfi_offset 29, -3
	rcall .
.LCFI2:
	.cfi_def_cfa_offset 6
	in r28,__SP_L__
	in r29,__SP_H__
.LCFI3:
	.cfi_def_cfa_register 28
/* prologue: function */
/* frame size = 2 */
/* stack size = 4 */
.L__stack_usage = 4
	.loc 1 133 0
	movw r22,r28
	subi r22,-1
	sbci r23,-1
	ldi r24,lo8(osEE_kdb_var)
	ldi r25,hi8(osEE_kdb_var)
	call osEE_scheduler_task_terminated
.LVL19:
.LBB10:
.LBB11:
	.file 2 "/home/user/Osek/OSEK-GroupProject/erika/src/ee_hal_internal.h"
	.loc 2 190 0
	movw r22,r24
	ldd r24,Y+1
	ldd r25,Y+2
.LVL20:
	call osEE_change_context_from_task_end
.LVL21:
/* epilogue start */
.LBE11:
.LBE10:
	.loc 1 140 0
	pop __tmp_reg__
	pop __tmp_reg__
	pop r29
	pop r28
	ret
	.cfi_endproc
.LFE67:
	.size	osEE_scheduler_task_end, .-osEE_scheduler_task_end
	.text
.Letext0:
	.file 3 "/home/user/arduino-1.8.19/hardware/tools/avr/avr/include/stdint.h"
	.file 4 "/home/user/Osek/OSEK-GroupProject/erika/inc/ee_platform_types.h"
	.file 5 "/home/user/Osek/OSEK-GroupProject/erika/inc/ee_api_types.h"
	.file 6 "/home/user/Osek/OSEK-GroupProject/erika/inc/ee_scheduler_types.h"
	.file 7 "/home/user/Osek/OSEK-GroupProject/erika/inc/ee_kernel_types.h"
	.file 8 "/home/user/Osek/OSEK-GroupProject/erika/inc/ee_hal_internal_types.h"
	.file 9 "/home/user/Osek/OSEK-GroupProject/erika/inc/ee_get_kernel_and_core.h"
	.file 10 "/home/user/Osek/OSEK-GroupProject/erika/src/ee_scheduler.h"
	.file 11 "/home/user/Osek/OSEK-GroupProject/erika/src/ee_std_change_context.h"
	.section	.debug_info,"",@progbits
.Ldebug_info0:
	.long	0xf88
	.word	0x2
	.long	.Ldebug_abbrev0
	.byte	0x4
	.uleb128 0x1
	.long	.LASF211
	.byte	0xc
	.long	.LASF212
	.long	.LASF213
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
	.byte	0x3
	.byte	0x7e
	.long	0x57
	.uleb128 0x3
	.byte	0x1
	.byte	0x8
	.long	.LASF4
	.uleb128 0x4
	.long	.LASF6
	.byte	0x3
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
	.byte	0x4
	.byte	0x5b
	.long	0x4c
	.uleb128 0x4
	.long	.LASF11
	.byte	0x4
	.byte	0x65
	.long	0x5e
	.uleb128 0x4
	.long	.LASF12
	.byte	0x4
	.byte	0x68
	.long	0x5e
	.uleb128 0x4
	.long	.LASF13
	.byte	0x4
	.byte	0x6d
	.long	0x5e
	.uleb128 0x5
	.byte	0x2
	.long	0xb0
	.uleb128 0x6
	.byte	0x1
	.uleb128 0x4
	.long	.LASF14
	.byte	0x5
	.byte	0x60
	.long	0x4c
	.uleb128 0x4
	.long	.LASF15
	.byte	0x5
	.byte	0x78
	.long	0x7e
	.uleb128 0x4
	.long	.LASF16
	.byte	0x5
	.byte	0xc8
	.long	0x4c
	.uleb128 0x4
	.long	.LASF17
	.byte	0x5
	.byte	0xf4
	.long	0x4c
	.uleb128 0x7
	.long	.LASF18
	.byte	0x5
	.word	0x13a
	.long	0xaa
	.uleb128 0x8
	.byte	0x7
	.byte	0x2
	.long	0x30
	.byte	0x5
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
	.byte	0x5
	.word	0x153
	.long	0xea
	.uleb128 0x7
	.long	.LASF24
	.byte	0x5
	.word	0x157
	.long	0x111
	.uleb128 0x8
	.byte	0x7
	.byte	0x2
	.long	0x30
	.byte	0x5
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
	.byte	0x5
	.word	0x16e
	.long	0x129
	.uleb128 0x7
	.long	.LASF32
	.byte	0x5
	.word	0x17e
	.long	0x15c
	.uleb128 0x7
	.long	.LASF33
	.byte	0x5
	.word	0x19e
	.long	0x94
	.uleb128 0xa
	.byte	0x4
	.byte	0x5
	.word	0x1b7
	.long	0x1a8
	.uleb128 0xb
	.long	.LASF34
	.byte	0x5
	.word	0x1b9
	.long	0x174
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF35
	.byte	0x5
	.word	0x1bc
	.long	0x174
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.byte	0
	.uleb128 0x7
	.long	.LASF36
	.byte	0x5
	.word	0x1c2
	.long	0x180
	.uleb128 0x7
	.long	.LASF37
	.byte	0x5
	.word	0x237
	.long	0x9f
	.uleb128 0x7
	.long	.LASF38
	.byte	0x5
	.word	0x2a3
	.long	0x89
	.uleb128 0x8
	.byte	0x7
	.byte	0x2
	.long	0x30
	.byte	0x5
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
	.byte	0x5
	.word	0x2d4
	.long	0x1cc
	.uleb128 0x7
	.long	.LASF69
	.byte	0x5
	.word	0x2d9
	.long	0x289
	.uleb128 0xc
	.long	.LASF72
	.byte	0x4
	.byte	0x6
	.byte	0x4b
	.long	0x2ca
	.uleb128 0xd
	.long	.LASF70
	.byte	0x6
	.byte	0x4d
	.long	0x2ca
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xd
	.long	.LASF71
	.byte	0x6
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
	.byte	0x7
	.word	0x108
	.long	0x356
	.uleb128 0xf
	.string	"hdb"
	.byte	0x7
	.word	0x10b
	.long	0x54b
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF74
	.byte	0x7
	.word	0x10e
	.long	0x6b2
	.byte	0x2
	.byte	0x23
	.uleb128 0x4
	.uleb128 0xf
	.string	"tid"
	.byte	0x7
	.word	0x110
	.long	0xbd
	.byte	0x2
	.byte	0x23
	.uleb128 0x6
	.uleb128 0xb
	.long	.LASF75
	.byte	0x7
	.word	0x112
	.long	0x11d
	.byte	0x2
	.byte	0x23
	.uleb128 0x7
	.uleb128 0xb
	.long	.LASF76
	.byte	0x7
	.word	0x114
	.long	0xde
	.byte	0x2
	.byte	0x23
	.uleb128 0x9
	.uleb128 0xb
	.long	.LASF77
	.byte	0x7
	.word	0x117
	.long	0xc8
	.byte	0x2
	.byte	0x23
	.uleb128 0xb
	.uleb128 0xb
	.long	.LASF78
	.byte	0x7
	.word	0x11a
	.long	0xc8
	.byte	0x2
	.byte	0x23
	.uleb128 0xc
	.uleb128 0xb
	.long	.LASF79
	.byte	0x7
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
	.byte	0x6
	.byte	0x50
	.long	0x2a1
	.uleb128 0x4
	.long	.LASF81
	.byte	0x6
	.byte	0xd5
	.long	0x377
	.uleb128 0x5
	.byte	0x2
	.long	0x361
	.uleb128 0xc
	.long	.LASF82
	.byte	0x14
	.byte	0x8
	.byte	0x43
	.long	0x48c
	.uleb128 0x11
	.string	"r29"
	.byte	0x8
	.byte	0x44
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0x11
	.string	"r28"
	.byte	0x8
	.byte	0x45
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0x1
	.uleb128 0x11
	.string	"r17"
	.byte	0x8
	.byte	0x46
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.uleb128 0x11
	.string	"r16"
	.byte	0x8
	.byte	0x47
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0x3
	.uleb128 0x11
	.string	"r15"
	.byte	0x8
	.byte	0x48
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0x4
	.uleb128 0x11
	.string	"r14"
	.byte	0x8
	.byte	0x49
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0x5
	.uleb128 0x11
	.string	"r13"
	.byte	0x8
	.byte	0x4a
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0x6
	.uleb128 0x11
	.string	"r12"
	.byte	0x8
	.byte	0x4b
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0x7
	.uleb128 0x11
	.string	"r11"
	.byte	0x8
	.byte	0x4c
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0x8
	.uleb128 0x11
	.string	"r10"
	.byte	0x8
	.byte	0x4d
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0x9
	.uleb128 0x11
	.string	"r9"
	.byte	0x8
	.byte	0x4e
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0xa
	.uleb128 0x11
	.string	"r8"
	.byte	0x8
	.byte	0x4f
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0xb
	.uleb128 0x11
	.string	"r7"
	.byte	0x8
	.byte	0x50
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0xc
	.uleb128 0x11
	.string	"r6"
	.byte	0x8
	.byte	0x51
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0xd
	.uleb128 0x11
	.string	"r5"
	.byte	0x8
	.byte	0x52
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0xe
	.uleb128 0x11
	.string	"r4"
	.byte	0x8
	.byte	0x53
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0xf
	.uleb128 0x11
	.string	"r3"
	.byte	0x8
	.byte	0x54
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0x10
	.uleb128 0x11
	.string	"r2"
	.byte	0x8
	.byte	0x55
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0x11
	.uleb128 0xd
	.long	.LASF83
	.byte	0x8
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
	.byte	0x8
	.byte	0x57
	.long	0x37d
	.uleb128 0x10
	.long	0x492
	.uleb128 0xc
	.long	.LASF85
	.byte	0x2
	.byte	0x8
	.byte	0x5a
	.long	0x4bd
	.uleb128 0xd
	.long	.LASF86
	.byte	0x8
	.byte	0x5b
	.long	0x4bd
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0x492
	.uleb128 0x4
	.long	.LASF87
	.byte	0x8
	.byte	0x5c
	.long	0x4a2
	.uleb128 0xc
	.long	.LASF88
	.byte	0x4
	.byte	0x8
	.byte	0x5e
	.long	0x4f7
	.uleb128 0xd
	.long	.LASF89
	.byte	0x8
	.byte	0x5f
	.long	0x4bd
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xd
	.long	.LASF90
	.byte	0x8
	.byte	0x60
	.long	0x89
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.byte	0
	.uleb128 0x10
	.long	0x4ce
	.uleb128 0x4
	.long	.LASF91
	.byte	0x8
	.byte	0x61
	.long	0x4f7
	.uleb128 0xc
	.long	.LASF92
	.byte	0x4
	.byte	0x8
	.byte	0x63
	.long	0x530
	.uleb128 0xd
	.long	.LASF93
	.byte	0x8
	.byte	0x64
	.long	0x535
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xd
	.long	.LASF94
	.byte	0x8
	.byte	0x65
	.long	0x540
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.byte	0
	.uleb128 0x10
	.long	0x507
	.uleb128 0x5
	.byte	0x2
	.long	0x4fc
	.uleb128 0x10
	.long	0x535
	.uleb128 0x5
	.byte	0x2
	.long	0x4c3
	.uleb128 0x10
	.long	0x540
	.uleb128 0x4
	.long	.LASF95
	.byte	0x8
	.byte	0x69
	.long	0x530
	.uleb128 0x4
	.long	.LASF96
	.byte	0x7
	.byte	0x51
	.long	0xaa
	.uleb128 0x4
	.long	.LASF97
	.byte	0x7
	.byte	0x53
	.long	0x4c
	.uleb128 0x12
	.byte	0x7
	.byte	0x2
	.long	0x30
	.byte	0x7
	.byte	0x73
	.long	0x592
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
	.byte	0x7
	.byte	0x7d
	.long	0x56c
	.uleb128 0x13
	.long	0x592
	.uleb128 0x14
	.byte	0x5
	.byte	0x7
	.byte	0x90
	.long	0x5d5
	.uleb128 0xd
	.long	.LASF70
	.byte	0x7
	.byte	0x94
	.long	0x603
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xd
	.long	.LASF103
	.byte	0x7
	.byte	0x97
	.long	0xc8
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.uleb128 0xd
	.long	.LASF104
	.byte	0x7
	.byte	0x9a
	.long	0x35b
	.byte	0x2
	.byte	0x23
	.uleb128 0x3
	.byte	0
	.uleb128 0xc
	.long	.LASF105
	.byte	0x3
	.byte	0x7
	.byte	0xb5
	.long	0x5fe
	.uleb128 0xd
	.long	.LASF106
	.byte	0x7
	.byte	0xb7
	.long	0x614
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xd
	.long	.LASF107
	.byte	0x7
	.byte	0xc3
	.long	0xc8
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.byte	0
	.uleb128 0x10
	.long	0x5d5
	.uleb128 0x5
	.byte	0x2
	.long	0x5fe
	.uleb128 0x4
	.long	.LASF108
	.byte	0x7
	.byte	0x9b
	.long	0x5a2
	.uleb128 0x5
	.byte	0x2
	.long	0x609
	.uleb128 0x4
	.long	.LASF109
	.byte	0x7
	.byte	0xce
	.long	0x5fe
	.uleb128 0x4
	.long	.LASF110
	.byte	0x7
	.byte	0xd2
	.long	0x61a
	.uleb128 0x14
	.byte	0xc
	.byte	0x7
	.byte	0xe0
	.long	0x69b
	.uleb128 0xd
	.long	.LASF111
	.byte	0x7
	.byte	0xe4
	.long	0xd3
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xd
	.long	.LASF112
	.byte	0x7
	.byte	0xea
	.long	0xc8
	.byte	0x2
	.byte	0x23
	.uleb128 0x1
	.uleb128 0xd
	.long	.LASF113
	.byte	0x7
	.byte	0xec
	.long	0x168
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.uleb128 0xd
	.long	.LASF114
	.byte	0x7
	.byte	0xef
	.long	0x69b
	.byte	0x2
	.byte	0x23
	.uleb128 0x4
	.uleb128 0xd
	.long	.LASF115
	.byte	0x7
	.byte	0xf3
	.long	0x1b4
	.byte	0x2
	.byte	0x23
	.uleb128 0x6
	.uleb128 0xd
	.long	.LASF116
	.byte	0x7
	.byte	0xf5
	.long	0x1b4
	.byte	0x2
	.byte	0x23
	.uleb128 0x8
	.uleb128 0xd
	.long	.LASF117
	.byte	0x7
	.byte	0xfb
	.long	0x377
	.byte	0x2
	.byte	0x23
	.uleb128 0xa
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0x61a
	.uleb128 0x7
	.long	.LASF118
	.byte	0x7
	.word	0x101
	.long	0x630
	.uleb128 0x10
	.long	0x6a1
	.uleb128 0x5
	.byte	0x2
	.long	0x6a1
	.uleb128 0x7
	.long	.LASF119
	.byte	0x7
	.word	0x122
	.long	0x356
	.uleb128 0x5
	.byte	0x2
	.long	0x6b8
	.uleb128 0x10
	.long	0x6c4
	.uleb128 0x7
	.long	.LASF120
	.byte	0x7
	.word	0x151
	.long	0x6db
	.uleb128 0x5
	.byte	0x2
	.long	0x71c
	.uleb128 0xe
	.long	.LASF121
	.byte	0xe
	.byte	0x7
	.word	0x269
	.long	0x71c
	.uleb128 0xb
	.long	.LASF122
	.byte	0x7
	.word	0x26b
	.long	0x8e6
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF123
	.byte	0x7
	.word	0x26d
	.long	0x80b
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.uleb128 0xb
	.long	.LASF124
	.byte	0x7
	.word	0x27b
	.long	0x84f
	.byte	0x2
	.byte	0x23
	.uleb128 0x4
	.byte	0
	.uleb128 0x10
	.long	0x6e1
	.uleb128 0xa
	.byte	0x4
	.byte	0x7
	.word	0x155
	.long	0x749
	.uleb128 0xb
	.long	.LASF125
	.byte	0x7
	.word	0x157
	.long	0x6cf
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF126
	.byte	0x7
	.word	0x159
	.long	0x174
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.byte	0
	.uleb128 0x7
	.long	.LASF127
	.byte	0x7
	.word	0x15e
	.long	0x721
	.uleb128 0xa
	.byte	0x6
	.byte	0x7
	.word	0x16f
	.long	0x77d
	.uleb128 0xb
	.long	.LASF128
	.byte	0x7
	.word	0x171
	.long	0x782
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF129
	.byte	0x7
	.word	0x177
	.long	0x1a8
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.byte	0
	.uleb128 0x10
	.long	0x755
	.uleb128 0x5
	.byte	0x2
	.long	0x749
	.uleb128 0x7
	.long	.LASF130
	.byte	0x7
	.word	0x17c
	.long	0x77d
	.uleb128 0x8
	.byte	0x7
	.byte	0x2
	.long	0x30
	.byte	0x7
	.word	0x17f
	.long	0x7bb
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
	.byte	0x7
	.word	0x184
	.long	0x794
	.uleb128 0xa
	.byte	0x8
	.byte	0x7
	.word	0x189
	.long	0x80b
	.uleb128 0xf
	.string	"f"
	.byte	0x7
	.word	0x18b
	.long	0x556
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF71
	.byte	0x7
	.word	0x18d
	.long	0x6c4
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.uleb128 0xb
	.long	.LASF123
	.byte	0x7
	.word	0x18f
	.long	0x80b
	.byte	0x2
	.byte	0x23
	.uleb128 0x4
	.uleb128 0xb
	.long	.LASF136
	.byte	0x7
	.word	0x192
	.long	0x1b4
	.byte	0x2
	.byte	0x23
	.uleb128 0x6
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0x788
	.uleb128 0x10
	.long	0x80b
	.uleb128 0x7
	.long	.LASF137
	.byte	0x7
	.word	0x194
	.long	0x7c7
	.uleb128 0xa
	.byte	0xa
	.byte	0x7
	.word	0x198
	.long	0x84a
	.uleb128 0xb
	.long	.LASF138
	.byte	0x7
	.word	0x19a
	.long	0x816
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF139
	.byte	0x7
	.word	0x19c
	.long	0x7bb
	.byte	0x2
	.byte	0x23
	.uleb128 0x8
	.byte	0
	.uleb128 0x10
	.long	0x822
	.uleb128 0x7
	.long	.LASF140
	.byte	0x7
	.word	0x19d
	.long	0x84a
	.uleb128 0x8
	.byte	0x7
	.byte	0x2
	.long	0x30
	.byte	0x7
	.word	0x22b
	.long	0x888
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
	.byte	0x7
	.word	0x231
	.long	0x85b
	.uleb128 0xa
	.byte	0x8
	.byte	0x7
	.word	0x242
	.long	0x8da
	.uleb128 0xb
	.long	.LASF70
	.byte	0x7
	.word	0x244
	.long	0x6db
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF147
	.byte	0x7
	.word	0x247
	.long	0x174
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.uleb128 0xb
	.long	.LASF113
	.byte	0x7
	.word	0x249
	.long	0x888
	.byte	0x2
	.byte	0x23
	.uleb128 0x4
	.uleb128 0xb
	.long	.LASF148
	.byte	0x7
	.word	0x24d
	.long	0x174
	.byte	0x2
	.byte	0x23
	.uleb128 0x6
	.byte	0
	.uleb128 0x7
	.long	.LASF149
	.byte	0x7
	.word	0x25e
	.long	0x894
	.uleb128 0x5
	.byte	0x2
	.long	0x8da
	.uleb128 0x7
	.long	.LASF150
	.byte	0x7
	.word	0x290
	.long	0x71c
	.uleb128 0x7
	.long	.LASF151
	.byte	0x7
	.word	0x295
	.long	0x8ec
	.uleb128 0xa
	.byte	0x6
	.byte	0x7
	.word	0x2a9
	.long	0x93b
	.uleb128 0xb
	.long	.LASF152
	.byte	0x7
	.word	0x2ad
	.long	0x940
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF153
	.byte	0x7
	.word	0x2af
	.long	0x174
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.uleb128 0xb
	.long	.LASF154
	.byte	0x7
	.word	0x2b2
	.long	0x174
	.byte	0x2
	.byte	0x23
	.uleb128 0x4
	.byte	0
	.uleb128 0x10
	.long	0x904
	.uleb128 0x5
	.byte	0x2
	.long	0x8ec
	.uleb128 0x7
	.long	.LASF155
	.byte	0x7
	.word	0x2b8
	.long	0x93b
	.uleb128 0xa
	.byte	0x4
	.byte	0x7
	.word	0x2bb
	.long	0x97a
	.uleb128 0xb
	.long	.LASF156
	.byte	0x7
	.word	0x2bd
	.long	0x98a
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF157
	.byte	0x7
	.word	0x2bf
	.long	0x1c0
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.byte	0
	.uleb128 0x10
	.long	0x952
	.uleb128 0x15
	.long	0x946
	.long	0x98a
	.uleb128 0x16
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0x97f
	.uleb128 0x7
	.long	.LASF158
	.byte	0x7
	.word	0x2c0
	.long	0x97a
	.uleb128 0xe
	.long	.LASF159
	.byte	0x4
	.byte	0x7
	.word	0x2c7
	.long	0x9c8
	.uleb128 0xb
	.long	.LASF160
	.byte	0x7
	.word	0x2c9
	.long	0x9d8
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF161
	.byte	0x7
	.word	0x2cb
	.long	0x1c0
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.byte	0
	.uleb128 0x10
	.long	0x99c
	.uleb128 0x15
	.long	0x6ca
	.long	0x9d8
	.uleb128 0x16
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0x9cd
	.uleb128 0x7
	.long	.LASF162
	.byte	0x7
	.word	0x2cc
	.long	0x9c8
	.uleb128 0xa
	.byte	0x12
	.byte	0x7
	.word	0x2d9
	.long	0xaa7
	.uleb128 0xb
	.long	.LASF163
	.byte	0x7
	.word	0x2dc
	.long	0x6c4
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xf
	.string	"rq"
	.byte	0x7
	.word	0x2ee
	.long	0x36c
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.uleb128 0xb
	.long	.LASF164
	.byte	0x7
	.word	0x2f0
	.long	0x377
	.byte	0x2
	.byte	0x23
	.uleb128 0x4
	.uleb128 0xb
	.long	.LASF165
	.byte	0x7
	.word	0x2ff
	.long	0x377
	.byte	0x2
	.byte	0x23
	.uleb128 0x6
	.uleb128 0xb
	.long	.LASF166
	.byte	0x7
	.word	0x301
	.long	0x59d
	.byte	0x2
	.byte	0x23
	.uleb128 0x8
	.uleb128 0xb
	.long	.LASF167
	.byte	0x7
	.word	0x305
	.long	0xb2
	.byte	0x2
	.byte	0x23
	.uleb128 0xa
	.uleb128 0xb
	.long	.LASF168
	.byte	0x7
	.word	0x307
	.long	0x295
	.byte	0x2
	.byte	0x23
	.uleb128 0xb
	.uleb128 0xb
	.long	.LASF169
	.byte	0x7
	.word	0x327
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0xd
	.uleb128 0xb
	.long	.LASF170
	.byte	0x7
	.word	0x329
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0xe
	.uleb128 0xb
	.long	.LASF171
	.byte	0x7
	.word	0x32b
	.long	0x561
	.byte	0x2
	.byte	0x23
	.uleb128 0xf
	.uleb128 0xb
	.long	.LASF172
	.byte	0x7
	.word	0x32d
	.long	0x561
	.byte	0x2
	.byte	0x23
	.uleb128 0x10
	.uleb128 0xb
	.long	.LASF173
	.byte	0x7
	.word	0x330
	.long	0x561
	.byte	0x2
	.byte	0x23
	.uleb128 0x11
	.byte	0
	.uleb128 0x7
	.long	.LASF174
	.byte	0x7
	.word	0x33a
	.long	0x9ea
	.uleb128 0xa
	.byte	0x10
	.byte	0x7
	.word	0x344
	.long	0xb35
	.uleb128 0xb
	.long	.LASF175
	.byte	0x7
	.word	0x34a
	.long	0xb3a
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF176
	.byte	0x7
	.word	0x351
	.long	0xde
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.uleb128 0xb
	.long	.LASF177
	.byte	0x7
	.word	0x354
	.long	0x6c4
	.byte	0x2
	.byte	0x23
	.uleb128 0x4
	.uleb128 0xb
	.long	.LASF178
	.byte	0x7
	.word	0x358
	.long	0x80b
	.byte	0x2
	.byte	0x23
	.uleb128 0x6
	.uleb128 0xb
	.long	.LASF179
	.byte	0x7
	.word	0x35c
	.long	0xb4b
	.byte	0x2
	.byte	0x23
	.uleb128 0x8
	.uleb128 0xb
	.long	.LASF180
	.byte	0x7
	.word	0x35e
	.long	0x1c0
	.byte	0x2
	.byte	0x23
	.uleb128 0xa
	.uleb128 0xb
	.long	.LASF181
	.byte	0x7
	.word	0x362
	.long	0xb5c
	.byte	0x2
	.byte	0x23
	.uleb128 0xc
	.uleb128 0xb
	.long	.LASF182
	.byte	0x7
	.word	0x364
	.long	0x1c0
	.byte	0x2
	.byte	0x23
	.uleb128 0xe
	.byte	0
	.uleb128 0x10
	.long	0xab3
	.uleb128 0x5
	.byte	0x2
	.long	0xaa7
	.uleb128 0x15
	.long	0x9de
	.long	0xb4b
	.uleb128 0x16
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0xb40
	.uleb128 0x15
	.long	0x990
	.long	0xb5c
	.uleb128 0x16
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0xb51
	.uleb128 0x7
	.long	.LASF183
	.byte	0x7
	.word	0x36a
	.long	0xb35
	.uleb128 0xa
	.byte	0x1
	.byte	0x7
	.word	0x36f
	.long	0xb87
	.uleb128 0xb
	.long	.LASF184
	.byte	0x7
	.word	0x3b1
	.long	0x7e
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.byte	0
	.uleb128 0x7
	.long	.LASF185
	.byte	0x7
	.word	0x3b3
	.long	0xb6e
	.uleb128 0xa
	.byte	0x12
	.byte	0x7
	.word	0x3c3
	.long	0xc24
	.uleb128 0xb
	.long	.LASF186
	.byte	0x7
	.word	0x3c5
	.long	0xc29
	.byte	0x2
	.byte	0x23
	.uleb128 0
	.uleb128 0xb
	.long	.LASF160
	.byte	0x7
	.word	0x3d1
	.long	0x9d8
	.byte	0x2
	.byte	0x23
	.uleb128 0x2
	.uleb128 0xb
	.long	.LASF161
	.byte	0x7
	.word	0x3d4
	.long	0x1c0
	.byte	0x2
	.byte	0x23
	.uleb128 0x4
	.uleb128 0xb
	.long	.LASF187
	.byte	0x7
	.word	0x3e0
	.long	0xc45
	.byte	0x2
	.byte	0x23
	.uleb128 0x6
	.uleb128 0xb
	.long	.LASF188
	.byte	0x7
	.word	0x3e2
	.long	0x1c0
	.byte	0x2
	.byte	0x23
	.uleb128 0x8
	.uleb128 0xb
	.long	.LASF189
	.byte	0x7
	.word	0x3e6
	.long	0xc56
	.byte	0x2
	.byte	0x23
	.uleb128 0xa
	.uleb128 0xb
	.long	.LASF190
	.byte	0x7
	.word	0x3e8
	.long	0x1c0
	.byte	0x2
	.byte	0x23
	.uleb128 0xc
	.uleb128 0xb
	.long	.LASF191
	.byte	0x7
	.word	0x3eb
	.long	0xc72
	.byte	0x2
	.byte	0x23
	.uleb128 0xe
	.uleb128 0xb
	.long	.LASF192
	.byte	0x7
	.word	0x3ed
	.long	0x1c0
	.byte	0x2
	.byte	0x23
	.uleb128 0x10
	.byte	0
	.uleb128 0x10
	.long	0xb93
	.uleb128 0x5
	.byte	0x2
	.long	0xb87
	.uleb128 0x15
	.long	0xc40
	.long	0xc3a
	.uleb128 0x16
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0x625
	.uleb128 0x10
	.long	0xc3a
	.uleb128 0x5
	.byte	0x2
	.long	0xc2f
	.uleb128 0x15
	.long	0x811
	.long	0xc56
	.uleb128 0x16
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0xc4b
	.uleb128 0x15
	.long	0xc6d
	.long	0xc67
	.uleb128 0x16
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0x8f8
	.uleb128 0x10
	.long	0xc67
	.uleb128 0x5
	.byte	0x2
	.long	0xc5c
	.uleb128 0x7
	.long	.LASF193
	.byte	0x7
	.word	0x3fc
	.long	0xc24
	.uleb128 0x17
	.long	.LASF194
	.byte	0x9
	.byte	0x3f
	.long	0xc78
	.byte	0x1
	.byte	0x1
	.uleb128 0x17
	.long	.LASF195
	.byte	0x9
	.byte	0x40
	.long	0xb62
	.byte	0x1
	.byte	0x1
	.uleb128 0x17
	.long	.LASF196
	.byte	0x9
	.byte	0x41
	.long	0xb87
	.byte	0x1
	.byte	0x1
	.uleb128 0x17
	.long	.LASF197
	.byte	0x9
	.byte	0x42
	.long	0xaa7
	.byte	0x1
	.byte	0x1
	.uleb128 0x18
	.byte	0x1
	.long	.LASF200
	.byte	0x1
	.byte	0x7d
	.byte	0x1
	.long	.LFB67
	.long	.LFE67
	.long	.LLST15
	.byte	0x1
	.long	0xd34
	.uleb128 0x19
	.long	.LASF198
	.byte	0x1
	.byte	0x82
	.long	0x6c4
	.long	.LLST16
	.uleb128 0x1a
	.long	.LASF199
	.byte	0x1
	.byte	0x83
	.long	0x6c4
	.byte	0x2
	.byte	0x8c
	.sleb128 1
	.uleb128 0x1b
	.long	0xe8d
	.long	.LBB10
	.long	.LBE10
	.byte	0x1
	.byte	0x8a
	.long	0xd1e
	.uleb128 0x1c
	.long	0xea5
	.long	.LLST16
	.uleb128 0x1c
	.long	0xe9a
	.long	.LLST18
	.uleb128 0x1d
	.long	.LVL21
	.long	0xdd8
	.byte	0
	.uleb128 0x1e
	.long	.LVL19
	.long	0xf4a
	.uleb128 0x1f
	.byte	0x6
	.byte	0x66
	.byte	0x93
	.uleb128 0x1
	.byte	0x67
	.byte	0x93
	.uleb128 0x1
	.byte	0x2
	.byte	0x8c
	.sleb128 1
	.byte	0
	.byte	0
	.uleb128 0x20
	.byte	0x1
	.long	.LASF201
	.byte	0x1
	.byte	0x62
	.byte	0x1
	.long	.LFB66
	.long	.LFE66
	.byte	0x3
	.byte	0x92
	.uleb128 0x20
	.sleb128 2
	.byte	0x1
	.long	0xdc2
	.uleb128 0x21
	.long	.LASF204
	.byte	0x1
	.byte	0x64
	.long	0x6c4
	.long	.LLST8
	.uleb128 0x19
	.long	.LASF83
	.byte	0x1
	.byte	0x67
	.long	0x4bd
	.long	.LLST9
	.uleb128 0x19
	.long	.LASF202
	.byte	0x1
	.byte	0x69
	.long	0xdc8
	.long	.LLST10
	.uleb128 0x19
	.long	.LASF93
	.byte	0x1
	.byte	0x6a
	.long	0x53b
	.long	.LLST11
	.uleb128 0x19
	.long	.LASF94
	.byte	0x1
	.byte	0x6b
	.long	0x546
	.long	.LLST12
	.uleb128 0x19
	.long	.LASF89
	.byte	0x1
	.byte	0x6c
	.long	0xdd3
	.long	.LLST13
	.uleb128 0x19
	.long	.LASF86
	.byte	0x1
	.byte	0x6d
	.long	0x4bd
	.long	.LLST14
	.uleb128 0x22
	.long	.LVL17
	.byte	0x1
	.long	0xf57
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0x54b
	.uleb128 0x10
	.long	0xdc2
	.uleb128 0x5
	.byte	0x2
	.long	0x49d
	.uleb128 0x10
	.long	0xdcd
	.uleb128 0x23
	.byte	0x1
	.long	.LASF214
	.byte	0x1
	.byte	0x4d
	.byte	0x1
	.byte	0x1
	.long	0xe08
	.uleb128 0x24
	.long	.LASF199
	.byte	0x1
	.byte	0x4f
	.long	0x6c4
	.uleb128 0x24
	.long	.LASF198
	.byte	0x1
	.byte	0x50
	.long	0x6c4
	.uleb128 0x25
	.long	.LASF205
	.byte	0x1
	.byte	0x53
	.long	0xe0e
	.byte	0
	.uleb128 0x5
	.byte	0x2
	.long	0x6ad
	.uleb128 0x10
	.long	0xe08
	.uleb128 0x20
	.byte	0x1
	.long	.LASF203
	.byte	0x1
	.byte	0x39
	.byte	0x1
	.long	.LFB64
	.long	.LFE64
	.byte	0x3
	.byte	0x92
	.uleb128 0x20
	.sleb128 2
	.byte	0x1
	.long	0xe8d
	.uleb128 0x21
	.long	.LASF199
	.byte	0x1
	.byte	0x3b
	.long	0x6c4
	.long	.LLST0
	.uleb128 0x21
	.long	.LASF198
	.byte	0x1
	.byte	0x3c
	.long	0x6c4
	.long	.LLST1
	.uleb128 0x19
	.long	.LASF205
	.byte	0x1
	.byte	0x3f
	.long	0xe0e
	.long	.LLST2
	.uleb128 0x26
	.long	.LVL4
	.byte	0x1
	.long	0xf64
	.long	0xe75
	.uleb128 0x1f
	.byte	0x6
	.byte	0x68
	.byte	0x93
	.uleb128 0x1
	.byte	0x69
	.byte	0x93
	.uleb128 0x1
	.byte	0x3
	.byte	0xf3
	.uleb128 0x1
	.byte	0x66
	.byte	0
	.uleb128 0x27
	.long	.LVL5
	.byte	0x1
	.long	0xf71
	.uleb128 0x1f
	.byte	0x6
	.byte	0x68
	.byte	0x93
	.uleb128 0x1
	.byte	0x69
	.byte	0x93
	.uleb128 0x1
	.byte	0x3
	.byte	0xf3
	.uleb128 0x1
	.byte	0x66
	.byte	0
	.byte	0
	.uleb128 0x28
	.long	.LASF215
	.byte	0x2
	.byte	0xb8
	.byte	0x1
	.byte	0x3
	.long	0xeb1
	.uleb128 0x24
	.long	.LASF199
	.byte	0x2
	.byte	0xba
	.long	0x6c4
	.uleb128 0x24
	.long	.LASF198
	.byte	0x2
	.byte	0xbb
	.long	0x6c4
	.byte	0
	.uleb128 0x29
	.long	.LASF216
	.byte	0x9
	.byte	0x54
	.byte	0x1
	.long	0xebe
	.byte	0x3
	.uleb128 0x5
	.byte	0x2
	.long	0xc78
	.uleb128 0x2a
	.long	0xdd8
	.long	.LFB65
	.long	.LFE65
	.byte	0x3
	.byte	0x92
	.uleb128 0x20
	.sleb128 2
	.byte	0x1
	.long	0xf4a
	.uleb128 0x1c
	.long	0xde6
	.long	.LLST3
	.uleb128 0x1c
	.long	0xdf1
	.long	.LLST4
	.uleb128 0x2b
	.long	0xdfc
	.long	.LLST5
	.uleb128 0x2c
	.long	0xdd8
	.long	.LBB8
	.long	.LBE8
	.long	0xf3f
	.uleb128 0x1c
	.long	0xde6
	.long	.LLST6
	.uleb128 0x1c
	.long	0xdf1
	.long	.LLST7
	.uleb128 0x2d
	.long	.LBB9
	.long	.LBE9
	.uleb128 0x2e
	.long	0xeec
	.uleb128 0x27
	.long	.LVL10
	.byte	0x1
	.long	0xf57
	.uleb128 0x1f
	.byte	0x6
	.byte	0x68
	.byte	0x93
	.uleb128 0x1
	.byte	0x69
	.byte	0x93
	.uleb128 0x1
	.byte	0x3
	.byte	0xf3
	.uleb128 0x1
	.byte	0x66
	.byte	0
	.byte	0
	.byte	0
	.uleb128 0x22
	.long	.LVL11
	.byte	0x1
	.long	0xf7e
	.byte	0
	.uleb128 0x2f
	.byte	0x1
	.byte	0x1
	.long	.LASF206
	.long	.LASF206
	.byte	0xa
	.byte	0xa3
	.uleb128 0x2f
	.byte	0x1
	.byte	0x1
	.long	.LASF207
	.long	.LASF207
	.byte	0xb
	.byte	0x61
	.uleb128 0x2f
	.byte	0x1
	.byte	0x1
	.long	.LASF208
	.long	.LASF208
	.byte	0xb
	.byte	0x59
	.uleb128 0x2f
	.byte	0x1
	.byte	0x1
	.long	.LASF209
	.long	.LASF209
	.byte	0xb
	.byte	0x68
	.uleb128 0x2f
	.byte	0x1
	.byte	0x1
	.long	.LASF210
	.long	.LASF210
	.byte	0xb
	.byte	0x70
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
	.uleb128 0x6
	.uleb128 0x2117
	.uleb128 0xc
	.uleb128 0x1
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0x19
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
	.uleb128 0x1a
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
	.uleb128 0x1b
	.uleb128 0x1d
	.byte	0x1
	.uleb128 0x31
	.uleb128 0x13
	.uleb128 0x11
	.uleb128 0x1
	.uleb128 0x12
	.uleb128 0x1
	.uleb128 0x58
	.uleb128 0xb
	.uleb128 0x59
	.uleb128 0xb
	.uleb128 0x1
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0x1c
	.uleb128 0x5
	.byte	0
	.uleb128 0x31
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
	.uleb128 0x31
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0x1e
	.uleb128 0x4109
	.byte	0x1
	.uleb128 0x11
	.uleb128 0x1
	.uleb128 0x31
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0x1f
	.uleb128 0x410a
	.byte	0
	.uleb128 0x2
	.uleb128 0xa
	.uleb128 0x2111
	.uleb128 0xa
	.byte	0
	.byte	0
	.uleb128 0x20
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
	.uleb128 0x21
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
	.uleb128 0x22
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
	.uleb128 0x23
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
	.uleb128 0x20
	.uleb128 0xb
	.uleb128 0x1
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0x24
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
	.byte	0
	.byte	0
	.uleb128 0x25
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
	.uleb128 0x26
	.uleb128 0x4109
	.byte	0x1
	.uleb128 0x11
	.uleb128 0x1
	.uleb128 0x2115
	.uleb128 0xc
	.uleb128 0x31
	.uleb128 0x13
	.uleb128 0x1
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0x27
	.uleb128 0x4109
	.byte	0x1
	.uleb128 0x11
	.uleb128 0x1
	.uleb128 0x2115
	.uleb128 0xc
	.uleb128 0x31
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0x28
	.uleb128 0x2e
	.byte	0x1
	.uleb128 0x3
	.uleb128 0xe
	.uleb128 0x3a
	.uleb128 0xb
	.uleb128 0x3b
	.uleb128 0xb
	.uleb128 0x27
	.uleb128 0xc
	.uleb128 0x20
	.uleb128 0xb
	.uleb128 0x1
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0x29
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
	.uleb128 0x2a
	.uleb128 0x2e
	.byte	0x1
	.uleb128 0x31
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
	.uleb128 0x2b
	.uleb128 0x34
	.byte	0
	.uleb128 0x31
	.uleb128 0x13
	.uleb128 0x2
	.uleb128 0x6
	.byte	0
	.byte	0
	.uleb128 0x2c
	.uleb128 0xb
	.byte	0x1
	.uleb128 0x31
	.uleb128 0x13
	.uleb128 0x11
	.uleb128 0x1
	.uleb128 0x12
	.uleb128 0x1
	.uleb128 0x1
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0x2d
	.uleb128 0xb
	.byte	0x1
	.uleb128 0x11
	.uleb128 0x1
	.uleb128 0x12
	.uleb128 0x1
	.byte	0
	.byte	0
	.uleb128 0x2e
	.uleb128 0x34
	.byte	0
	.uleb128 0x31
	.uleb128 0x13
	.byte	0
	.byte	0
	.uleb128 0x2f
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
.LLST15:
	.long	.LFB67
	.long	.LCFI0
	.word	0x3
	.byte	0x92
	.uleb128 0x20
	.sleb128 2
	.long	.LCFI0
	.long	.LCFI1
	.word	0x3
	.byte	0x92
	.uleb128 0x20
	.sleb128 3
	.long	.LCFI1
	.long	.LCFI2
	.word	0x3
	.byte	0x92
	.uleb128 0x20
	.sleb128 4
	.long	.LCFI2
	.long	.LCFI3
	.word	0x3
	.byte	0x92
	.uleb128 0x20
	.sleb128 6
	.long	.LCFI3
	.long	.LFE67
	.word	0x2
	.byte	0x8c
	.sleb128 6
	.long	0
	.long	0
.LLST16:
	.long	.LVL19
	.long	.LVL20
	.word	0x6
	.byte	0x68
	.byte	0x93
	.uleb128 0x1
	.byte	0x69
	.byte	0x93
	.uleb128 0x1
	.long	.LVL20
	.long	.LVL21-1
	.word	0x6
	.byte	0x66
	.byte	0x93
	.uleb128 0x1
	.byte	0x67
	.byte	0x93
	.uleb128 0x1
	.long	0
	.long	0
.LLST18:
	.long	.LVL19
	.long	.LVL21-1
	.word	0x2
	.byte	0x8c
	.sleb128 1
	.long	0
	.long	0
.LLST8:
	.long	.LVL12
	.long	.LVL17-1
	.word	0x6
	.byte	0x68
	.byte	0x93
	.uleb128 0x1
	.byte	0x69
	.byte	0x93
	.uleb128 0x1
	.long	.LVL17-1
	.long	.LVL17
	.word	0x4
	.byte	0xf3
	.uleb128 0x1
	.byte	0x68
	.byte	0x9f
	.long	.LVL17
	.long	.LFE66
	.word	0x6
	.byte	0x68
	.byte	0x93
	.uleb128 0x1
	.byte	0x69
	.byte	0x93
	.uleb128 0x1
	.long	0
	.long	0
.LLST9:
	.long	.LVL15
	.long	.LVL17-1
	.word	0x6
	.byte	0x6e
	.byte	0x93
	.uleb128 0x1
	.byte	0x6f
	.byte	0x93
	.uleb128 0x1
	.long	.LVL17
	.long	.LVL18
	.word	0x6
	.byte	0x6e
	.byte	0x93
	.uleb128 0x1
	.byte	0x6f
	.byte	0x93
	.uleb128 0x1
	.long	0
	.long	0
.LLST10:
	.long	.LVL12
	.long	.LVL17-1
	.word	0x6
	.byte	0x68
	.byte	0x93
	.uleb128 0x1
	.byte	0x69
	.byte	0x93
	.uleb128 0x1
	.long	.LVL17-1
	.long	.LVL17
	.word	0x4
	.byte	0xf3
	.uleb128 0x1
	.byte	0x68
	.byte	0x9f
	.long	.LVL17
	.long	.LFE66
	.word	0x6
	.byte	0x68
	.byte	0x93
	.uleb128 0x1
	.byte	0x69
	.byte	0x93
	.uleb128 0x1
	.long	0
	.long	0
.LLST11:
	.long	.LVL12
	.long	.LVL17-1
	.word	0x2
	.byte	0x88
	.sleb128 0
	.long	.LVL17
	.long	.LFE66
	.word	0x2
	.byte	0x88
	.sleb128 0
	.long	0
	.long	0
.LLST12:
	.long	.LVL13
	.long	.LVL17-1
	.word	0x6
	.byte	0x66
	.byte	0x93
	.uleb128 0x1
	.byte	0x67
	.byte	0x93
	.uleb128 0x1
	.long	.LVL17
	.long	.LFE66
	.word	0x6
	.byte	0x66
	.byte	0x93
	.uleb128 0x1
	.byte	0x67
	.byte	0x93
	.uleb128 0x1
	.long	0
	.long	0
.LLST13:
	.long	.LVL14
	.long	.LVL17-1
	.word	0x6
	.byte	0x64
	.byte	0x93
	.uleb128 0x1
	.byte	0x65
	.byte	0x93
	.uleb128 0x1
	.long	.LVL17
	.long	.LFE66
	.word	0x6
	.byte	0x64
	.byte	0x93
	.uleb128 0x1
	.byte	0x65
	.byte	0x93
	.uleb128 0x1
	.long	0
	.long	0
.LLST14:
	.long	.LVL15
	.long	.LVL16
	.word	0x6
	.byte	0x6e
	.byte	0x93
	.uleb128 0x1
	.byte	0x6f
	.byte	0x93
	.uleb128 0x1
	.long	.LVL16
	.long	.LVL17-1
	.word	0x6
	.byte	0x62
	.byte	0x93
	.uleb128 0x1
	.byte	0x63
	.byte	0x93
	.uleb128 0x1
	.long	.LVL17
	.long	.LFE66
	.word	0x6
	.byte	0x62
	.byte	0x93
	.uleb128 0x1
	.byte	0x63
	.byte	0x93
	.uleb128 0x1
	.long	0
	.long	0
.LLST0:
	.long	.LVL0
	.long	.LVL3
	.word	0x6
	.byte	0x68
	.byte	0x93
	.uleb128 0x1
	.byte	0x69
	.byte	0x93
	.uleb128 0x1
	.long	.LVL3
	.long	.LFE64
	.word	0x4
	.byte	0xf3
	.uleb128 0x1
	.byte	0x68
	.byte	0x9f
	.long	0
	.long	0
.LLST1:
	.long	.LVL0
	.long	.LVL2
	.word	0x6
	.byte	0x66
	.byte	0x93
	.uleb128 0x1
	.byte	0x67
	.byte	0x93
	.uleb128 0x1
	.long	.LVL2
	.long	.LVL4-1
	.word	0x6
	.byte	0x6e
	.byte	0x93
	.uleb128 0x1
	.byte	0x6f
	.byte	0x93
	.uleb128 0x1
	.long	.LVL4-1
	.long	.LVL4
	.word	0x4
	.byte	0xf3
	.uleb128 0x1
	.byte	0x66
	.byte	0x9f
	.long	.LVL4
	.long	.LVL5-1
	.word	0x6
	.byte	0x6e
	.byte	0x93
	.uleb128 0x1
	.byte	0x6f
	.byte	0x93
	.uleb128 0x1
	.long	.LVL5-1
	.long	.LFE64
	.word	0x4
	.byte	0xf3
	.uleb128 0x1
	.byte	0x66
	.byte	0x9f
	.long	0
	.long	0
.LLST2:
	.long	.LVL1
	.long	.LVL2
	.word	0x2
	.byte	0x86
	.sleb128 4
	.long	.LVL2
	.long	.LVL4-1
	.word	0x2
	.byte	0x8e
	.sleb128 4
	.long	.LVL4
	.long	.LVL5-1
	.word	0x6
	.byte	0x6a
	.byte	0x93
	.uleb128 0x1
	.byte	0x6b
	.byte	0x93
	.uleb128 0x1
	.long	0
	.long	0
.LLST3:
	.long	.LVL6
	.long	.LVL7
	.word	0x6
	.byte	0x68
	.byte	0x93
	.uleb128 0x1
	.byte	0x69
	.byte	0x93
	.uleb128 0x1
	.long	.LVL7
	.long	.LFE65
	.word	0x4
	.byte	0xf3
	.uleb128 0x1
	.byte	0x68
	.byte	0x9f
	.long	0
	.long	0
.LLST4:
	.long	.LVL6
	.long	.LVL8
	.word	0x6
	.byte	0x66
	.byte	0x93
	.uleb128 0x1
	.byte	0x67
	.byte	0x93
	.uleb128 0x1
	.long	.LVL8
	.long	.LVL10-1
	.word	0x6
	.byte	0x68
	.byte	0x93
	.uleb128 0x1
	.byte	0x69
	.byte	0x93
	.uleb128 0x1
	.long	.LVL10-1
	.long	.LVL10
	.word	0x4
	.byte	0xf3
	.uleb128 0x1
	.byte	0x66
	.byte	0x9f
	.long	.LVL10
	.long	.LVL11-1
	.word	0x6
	.byte	0x68
	.byte	0x93
	.uleb128 0x1
	.byte	0x69
	.byte	0x93
	.uleb128 0x1
	.long	.LVL11-1
	.long	.LFE65
	.word	0x4
	.byte	0xf3
	.uleb128 0x1
	.byte	0x66
	.byte	0x9f
	.long	0
	.long	0
.LLST5:
	.long	.LVL7
	.long	.LVL8
	.word	0x2
	.byte	0x86
	.sleb128 4
	.long	.LVL8
	.long	.LVL10-1
	.word	0x2
	.byte	0x88
	.sleb128 4
	.long	.LVL10
	.long	.LVL11-1
	.word	0x6
	.byte	0x6e
	.byte	0x93
	.uleb128 0x1
	.byte	0x6f
	.byte	0x93
	.uleb128 0x1
	.long	0
	.long	0
.LLST6:
	.long	.LVL9
	.long	.LVL10
	.word	0x4
	.byte	0xf3
	.uleb128 0x1
	.byte	0x68
	.byte	0x9f
	.long	0
	.long	0
.LLST7:
	.long	.LVL9
	.long	.LVL10-1
	.word	0x6
	.byte	0x68
	.byte	0x93
	.uleb128 0x1
	.byte	0x69
	.byte	0x93
	.uleb128 0x1
	.long	.LVL10-1
	.long	.LVL10
	.word	0x4
	.byte	0xf3
	.uleb128 0x1
	.byte	0x66
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
.LASF204:
	.string	"p_idle_tdb"
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
.LASF205:
	.string	"p_to_tcb"
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
.LASF19:
	.string	"OSEE_TASK_TYPE_BASIC"
.LASF215:
	.string	"osEE_change_context_from_isr2_end"
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
.LASF69:
	.string	"StatusType"
.LASF31:
	.string	"OsEE_task_status"
.LASF87:
	.string	"OsEE_SCB"
.LASF201:
	.string	"osEE_idle_task_terminate"
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
.LASF37:
	.string	"EventMaskType"
.LASF182:
	.string	"autostart_trigger_array_size"
.LASF108:
	.string	"OsEE_MCB"
.LASF212:
	.string	"/home/user/Osek/OSEK-GroupProject/erika/src/ee_std_change_context.c"
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
.LASF42:
	.string	"E_OS_ID"
.LASF38:
	.string	"MemSize"
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
.LASF203:
	.string	"osEE_change_context_from_running"
.LASF73:
	.string	"OsEE_TDB_tag"
.LASF85:
	.string	"OsEE_SCB_tag"
.LASF30:
	.string	"OSEE_TASK_CHAINED"
.LASF216:
	.string	"osEE_get_kernel"
.LASF81:
	.string	"OsEE_RQ"
.LASF174:
	.string	"OsEE_CCB"
.LASF207:
	.string	"osEE_hal_restore_ctx"
.LASF176:
	.string	"p_idle_hook"
.LASF169:
	.string	"prev_s_isr_all_status"
.LASF198:
	.string	"p_to"
.LASF189:
	.string	"p_counter_ptr_array"
.LASF190:
	.string	"counter_array_size"
.LASF192:
	.string	"alarm_array_size"
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
.LASF209:
	.string	"osEE_hal_save_ctx_and_ready2stacked"
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
.LASF202:
	.string	"p_idle_hdb"
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
.LASF210:
	.string	"osEE_hal_ready2stacked"
.LASF50:
	.string	"E_OS_MISSINGEND"
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
.LASF206:
	.string	"osEE_scheduler_task_terminated"
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
.LASF213:
	.string	"/home/user/Osek/OSEK-GroupProject/erika"
.LASF70:
	.string	"p_next"
.LASF26:
	.string	"OSEE_TASK_READY"
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
.LASF208:
	.string	"osEE_hal_save_ctx_and_restore_ctx"
.LASF98:
	.string	"OSEE_KERNEL_INITIALIZED"
.LASF49:
	.string	"E_OS_ILLEGAL_ADDRESS"
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
.LASF141:
	.string	"OSEE_TRIGGER_INACTIVE"
.LASF45:
	.string	"E_OS_RESOURCE"
.LASF161:
	.string	"tdb_array_size"
.LASF171:
	.string	"s_isr_all_cnt"
.LASF148:
	.string	"cycle"
.LASF136:
	.string	"mask"
.LASF113:
	.string	"status"
.LASF200:
	.string	"osEE_scheduler_task_end"
.LASF211:
	.string	"GNU C11 7.3.0 -mn-flash=1 -mno-skip-bug -mmcu=avr5 -g -Os -std=gnu11 -ffunction-sections -fdata-sections"
.LASF78:
	.string	"dispatch_prio"
.LASF5:
	.string	"uint8_t"
.LASF214:
	.string	"osEE_change_context_from_task_end"
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
.LASF199:
	.string	"p_from"
.LASF59:
	.string	"E_OS_SPINLOCK"
.LASF84:
	.string	"OsEE_CTX"
	.ident	"GCC: (GNU) 7.3.0"
