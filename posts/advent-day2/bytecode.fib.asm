
/tmp/jolt-guest-targets/fibonacci-guest-/riscv64imac-unknown-none-elf/release/fibonacci-guest:     file format elf64-littleriscv


Disassembly of section .text.boot:

0000000080000000 <.text.boot>:
    80000000:	00001117          	auipc	sp,0x1
    80000004:	12010113          	addi	sp,sp,288 # 0x80001120
    80000008:	00000097          	auipc	ra,0x0
    8000000c:	02e080e7          	jalr	46(ra) # 0x80000036
    80000010:	a001                	j	0x80000010

Disassembly of section .text.unlikely._ZN4core9panicking9panic_fmt17h6b34329394ab4351E:

0000000080000012 <.text.unlikely._ZN4core9panicking9panic_fmt17h6b34329394ab4351E>:
    80000012:	1141                	addi	sp,sp,-16
    80000014:	e406                	sd	ra,8(sp)
    80000016:	e022                	sd	s0,0(sp)
    80000018:	0800                	addi	s0,sp,16
    8000001a:	7fffc537          	lui	a0,0x7fffc
    8000001e:	4585                	li	a1,1
    80000020:	00b50023          	sb	a1,0(a0) # 0x7fffc000
    80000024:	a001                	j	0x80000024

Disassembly of section .text.unlikely._ZN4core6result13unwrap_failed17hb6ec8cc04f3e1c3aE:

0000000080000026 <.text.unlikely._ZN4core6result13unwrap_failed17hb6ec8cc04f3e1c3aE>:
    80000026:	1141                	addi	sp,sp,-16
    80000028:	e406                	sd	ra,8(sp)
    8000002a:	e022                	sd	s0,0(sp)
    8000002c:	0800                	addi	s0,sp,16
    8000002e:	00000097          	auipc	ra,0x0
    80000032:	fe4080e7          	jalr	-28(ra) # 0x80000012

Disassembly of section .text.main:

0000000080000036 <.text.main>:
    80000036:	7fffa5b7          	lui	a1,0x7fffa
    8000003a:	557d                	li	a0,-1
    8000003c:	4611                	li	a2,4
    8000003e:	04c50a63          	beq	a0,a2,0x80000092
    80000042:	00058683          	lb	a3,0(a1) # 0x7fffa000
    80000046:	0585                	addi	a1,a1,1
    80000048:	0505                	addi	a0,a0,1
    8000004a:	fe06cae3          	bltz	a3,0x8000003e
    8000004e:	4591                	li	a1,4
    80000050:	00b51763          	bne	a0,a1,0x8000005e
    80000054:	0ff6f513          	zext.b	a0,a3
    80000058:	45bd                	li	a1,15
    8000005a:	02a5ec63          	bltu	a1,a0,0x80000092
    8000005e:	00000517          	auipc	a0,0x0
    80000062:	000c86b7          	lui	a3,0xc8
    80000066:	4705                	li	a4,1
    80000068:	4621                	li	a2,8
    8000006a:	04250593          	addi	a1,a0,66 # 0x800000a0
    8000006e:	c1e6851b          	addiw	a0,a3,-994 # 0xc7c1e
    80000072:	4685                	li	a3,1
    80000074:	00000073          	ecall
    80000078:	7fffb837          	lui	a6,0x7fffb
    8000007c:	7fffc7b7          	lui	a5,0x7fffc
    80000080:	4621                	li	a2,8
    80000082:	4689                	li	a3,2
    80000084:	00000073          	ecall
    80000088:	00e80023          	sb	a4,0(a6) # 0x7fffb000
    8000008c:	00e78423          	sb	a4,8(a5) # 0x7fffc008
    80000090:	8082                	ret
    80000092:	00000097          	auipc	ra,0x0
    80000096:	f94080e7          	jalr	-108(ra) # 0x80000026
