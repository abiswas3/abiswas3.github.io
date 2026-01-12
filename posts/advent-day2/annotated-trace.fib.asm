================================================================================
ANNOTATED RISC-V ASSEMBLY - fibonacci-guest (constant return 1)
================================================================================

================================================================================
SECTION: .text.boot (Program Entry Point)
================================================================================
Address: 0x80000000

0x80000000:  00001117    auipc  sp,0x1
    # Add Upper Immediate to PC
    # sp = PC + (0x1 << 12) = 0x80000000 + 0x1000 = 0x80001000
    # Setting up stack pointer base address

0x80000004:  12010113    addi   sp,sp,288
    # Add Immediate
    # sp = sp + 288 = 0x80001000 + 0x120 = 0x80001120
    # Final stack pointer positioned at end of stack space

0x80000008:  00000097    auipc  ra,0x0
    # Add Upper Immediate to PC
    # ra = PC + 0 = 0x80000008
    # Save return address (for potential return to boot)

0x8000000c:  02e080e7    jalr   46(ra)
    # Jump And Link Register
    # Jump to: ra + 46 = 0x80000008 + 46 = 0x80000036 (main function)
    # ra = PC + 4 = 0x80000010 (return address saved)
    # *** EXECUTION JUMPS TO MAIN ***

0x80000010:  a001        j      0x80000010
    # Infinite loop (should never reach here)
    # If main returns, hang forever


================================================================================
SECTION: .text.unlikely._ZN4core9panicking9panic_fmt (Panic Handler)
================================================================================
Address: 0x80000012

# This code only executes if there's an error/panic
# NOT part of normal execution path

0x80000012:  1141        addi   sp,sp,-16
    # Allocate 16 bytes on stack for panic frame

0x80000014:  e406        sd     ra,8(sp)
    # Save return address at sp+8

0x80000016:  e022        sd     s0,0(sp)
    # Save frame pointer at sp+0

0x80000018:  0800        addi   s0,sp,16
    # Set frame pointer to top of frame

0x8000001a:  7fffc537    lui    a0,0x7fffc
    # Load Upper Immediate
    # a0 = 0x7fffc000 (panic flag memory address)

0x8000001e:  4585        li     a1,1
    # Load Immediate: a1 = 1 (panic indicator value)

0x80000020:  00b50023    sb     a1,0(a0)
    # Store Byte: Write 1 to address 0x7fffc000
    # Signal panic condition to host

0x80000024:  a001        j      0x80000024
    # Infinite loop - hang after panic


================================================================================
SECTION: .text.unlikely._ZN4core6result13unwrap_failed (Unwrap Failed Handler)
================================================================================
Address: 0x80000026

# This executes if input validation fails
# Calls the panic handler above

0x80000026:  1141        addi   sp,sp,-16
    # Allocate stack frame

0x80000028:  e406        sd     ra,8(sp)
    # Save return address

0x8000002a:  e022        sd     s0,0(sp)
    # Save frame pointer

0x8000002c:  0800        addi   s0,sp,16
    # Set frame pointer

0x8000002e:  00000097    auipc  ra,0x0
    # ra = PC = 0x8000002e

0x80000032:  fe4080e7    jalr   -28(ra)
    # Jump to: ra + (-28) = 0x8000002e - 28 = 0x80000012
    # *** JUMPS TO PANIC HANDLER ***


================================================================================
SECTION: .text.main (Main Function - WHERE THE ACTUAL WORK HAPPENS)
================================================================================
Address: 0x80000036

--------------------------------------------------------------------------------
PHASE 1: INITIALIZATION
--------------------------------------------------------------------------------

0x80000036:  7fffa5b7    lui    a1,0x7fffa
    # Load Upper Immediate
    # a1 = 0x7fffa000
    # This is the INPUT BUFFER ADDRESS where postcard-serialized data lives
    # Register a1 = input_ptr

0x8000003a:  557d        li     a0,-1
    # Load Immediate: a0 = -1 (0xFFFFFFFFFFFFFFFF in 64-bit)
    # Register a0 = byte_counter (starts at -1, increments as we read)

0x8000003c:  4611        li     a2,4
    # Load Immediate: a2 = 4
    # Register a2 = max_bytes (maximum bytes we're allowed to read)


--------------------------------------------------------------------------------
PHASE 2: INPUT VALIDATION LOOP (Read postcard-encoded bytes)
--------------------------------------------------------------------------------

0x8000003e:  04c50a63    beq    a0,a2,0x80000092
    # Branch if Equal
    # if (byte_counter == max_bytes) goto ERROR at 0x80000092
    # Check: have we read too many bytes? (safety check)

0x80000042:  00058683    lb     a3,0(a1)
    # Load Byte (sign-extended)
    # a3 = *a1 (read byte from input buffer)
    # Register a3 = current_byte

0x80000046:  0585        addi   a1,a1,1
    # Add Immediate: a1 = a1 + 1
    # input_ptr++ (move to next byte)

0x80000048:  0505        addi   a0,a0,1
    # Add Immediate: a0 = a0 + 1
    # byte_counter++ (increment count of bytes read)

0x8000004a:  fe06cae3    bltz   a3,0x8000003e
    # Branch if Less Than Zero
    # if (current_byte < 0) goto 0x8000003e (LOOP BACK)
    # In postcard encoding, high bit set (negative) means "more bytes follow"
    # Keep looping while high bit is set

# When we get here, we've read a byte with high bit CLEAR (final byte)


--------------------------------------------------------------------------------
PHASE 3: OPTIONAL INPUT RANGE CHECK (only if we read exactly 4 bytes)
--------------------------------------------------------------------------------

0x8000004e:  4591        li     a1,4
    # Load Immediate: a1 = 4
    # Reusing a1 for comparison value

0x80000050:  00b51763    bne    a0,a1,0x8000005e
    # Branch if Not Equal
    # if (byte_counter != 4) goto SKIP_CHECK at 0x8000005e
    # Only validate range if we read exactly 4 bytes

0x80000054:  0ff6f513    zext.b a0,a3
    # Zero-extend Byte
    # a0 = a3 & 0xFF (get last byte as unsigned 8-bit value)

0x80000058:  45bd        li     a1,15
    # Load Immediate: a1 = 15
    # Maximum allowed value

0x8000005a:  02a5ec63    bltu   a1,a0,0x80000092
    # Branch if Less Than Unsigned
    # if (15 < last_byte) goto ERROR at 0x80000092
    # Validate: input must be <= 15


--------------------------------------------------------------------------------
PHASE 4: FIRST ECALL (Syscall #1 - Setup/Write ID)
--------------------------------------------------------------------------------

0x8000005e:  00000517    auipc  a0,0x0
    # Add Upper Immediate to PC
    # a0 = PC + 0 = 0x8000005e
    # Loading address for syscall parameter

0x80000062:  000c86b7    lui    a3,0xc8
    # Load Upper Immediate
    # a3 = 0xc8000 = 819200
    # Syscall parameter (looks like a syscall ID or magic number)

0x80000066:  4705        li     a4,1
    # Load Immediate: a4 = 1
    # Register a4 = THE CONSTANT VALUE TO RETURN
    # *** THIS IS THE FIBONACCI RESULT (always 1) ***

0x80000068:  4621        li     a2,8
    # Load Immediate: a2 = 8
    # Syscall parameter (length? 8 bytes for u64?)

0x8000006a:  04250593    addi   a1,a0,66
    # Add Immediate: a1 = a0 + 66 = 0x8000005e + 66 = 0x800000a0
    # Syscall parameter (buffer address?)

0x8000006e:  c1e6851b    addiw  a0,a3,-994
    # Add Immediate Word (32-bit)
    # a0 = a3 - 994 = 0xc8000 - 994 = 819200 - 994 = 818206 = 0xc7c1e
    # Syscall ID/parameter

0x80000072:  4685        li     a3,1
    # Load Immediate: a3 = 1
    # Syscall type/flag

0x80000074:  00000073    ecall
    # Environment Call (syscall)
    # Make syscall with parameters in a0-a7
    # Likely: write metadata or setup output


--------------------------------------------------------------------------------
PHASE 5: SETUP OUTPUT ADDRESSES
--------------------------------------------------------------------------------

0x80000078:  7fffb837    lui    a6,0x7fffb
    # Load Upper Immediate
    # a6 = 0x7fffb000
    # Register a6 = OUTPUT BUFFER ADDRESS

0x8000007c:  7fffc7b7    lui    a5,0x7fffc
    # Load Upper Immediate
    # a5 = 0x7fffc000
    # Register a5 = SUCCESS FLAG ADDRESS


--------------------------------------------------------------------------------
PHASE 6: SECOND ECALL (Syscall #2 - Write Output)
--------------------------------------------------------------------------------

0x80000080:  4621        li     a2,8
    # Load Immediate: a2 = 8
    # Syscall parameter (8 bytes to write)

0x80000082:  4689        li     a3,2
    # Load Immediate: a3 = 2
    # Syscall type/flag (different from first ecall)

0x80000084:  00000073    ecall
    # Environment Call (syscall)
    # Make second syscall (likely: write output data)


--------------------------------------------------------------------------------
PHASE 7: WRITE RESULTS TO MEMORY & RETURN
--------------------------------------------------------------------------------

0x80000088:  00e80023    sb     a4,0(a6)
    # Store Byte
    # Write a4 (the value 1) to address a6 (0x7fffb000)
    # *** WRITE OUTPUT VALUE = 1 TO OUTPUT BUFFER ***

0x8000008c:  00e78423    sb     a4,8(a5)
    # Store Byte
    # Write a4 (the value 1) to address a5 + 8 (0x7fffc008)
    # *** WRITE SUCCESS FLAG = 1 ***

0x80000090:  8082        ret
    # Return
    # Jump back to return address (0x80000010 - the infinite loop)
    # *** PROGRAM COMPLETE ***


================================================================================
SECTION: ERROR HANDLER
================================================================================
Address: 0x80000092

# Reached if input validation fails

0x80000092:  00000097    auipc  ra,0x0
    # ra = PC = 0x80000092

0x80000096:  f94080e7    jalr   -108(ra)
    # Jump to: ra + (-108) = 0x80000092 - 108 = 0x80000026
    # *** JUMP TO UNWRAP_FAILED HANDLER ***


================================================================================
EXECUTION SUMMARY
================================================================================

Normal execution path (no errors):
  1. Boot      : 0x80000000 → 0x8000000c → Jump to main
  2. Main      : 0x80000036 (start)
  3. Init      : Load addresses and counters
  4. Validate  : Read and validate input format
  5. Syscalls  : Two ecalls for I/O operations
  6. Write     : Store result (1) to output buffer
  7. Return    : Exit via ret instruction

Key Register Usage:
  • a0 = byte counter / syscall parameters
  • a1 = input pointer / syscall parameters
  • a2 = max bytes / syscall parameters
  • a3 = current byte / syscall parameters
  • a4 = THE RESULT VALUE (always 1)
  • a5 = success flag address (0x7fffc000)
  • a6 = output buffer address (0x7fffb000)
  • sp = stack pointer (0x80001120)
  • ra = return address

Memory Map:
  0x80000000 - 0x800000FF : Code (.text sections)
  0x7fffa000             : Input buffer (postcard-serialized input)
  0x7fffb000             : Output buffer (result written here)
  0x7fffc000             : Control/status region (panic/success flags)
  0x80001120             : Stack top

Total Instructions in Normal Path: ~26 instructions
