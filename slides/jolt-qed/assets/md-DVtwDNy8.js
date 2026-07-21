import{K as e,O as t,V as n,et as r,tt as i,v as a,x as o,xt as s,y as c,yt as l}from"./modules/shiki-twwFsL5Y.js";import{n as u,t as d}from"./slidev/context-on1mAbOK.js";import{t as f}from"./slidev/default-CsM--Nt4.js";import{t as p}from"./jolt-overview-F2itmQpB.js";var m={class:`jolt-zkvm-stage`},h={class:`jolt-zkvm-figure`,src:p,alt:`Baseline proof sketch`},g={class:`jolt-riscv-overlay`},_={__name:`slides.md__slidev_2`,setup(p){let{$slidev:_,$nav:v,$clicksContext:y,$clicks:b,$page:x,$renderContext:S,$frontmatter:C}=u();return y.setup(),(u,p)=>{let _=e(`click`),v=e(`click-hide`);return n(),c(f,s(t(l(d)(l(C),1))),{default:r(()=>[p[1]||=a(`h1`,null,`The Jolt Zk-VM`,-1),p[2]||=a(`p`,null,`We start with user input which is a RISC-V binary.`,-1),a(`div`,m,[i(a(`img`,h,null,512),[[_,1]]),i((n(),o(`div`,g,[...p[0]||=[a(`pre`,{class:`jolt-riscv-code`},[a(`code`,null,`ADDI sp, sp, -16
SD   ra, 8(sp)
LW   t0, 0(a0)
ADDI t1, t0, 7
MUL  t2, t1, a1
XOR  t3, t2, a2
SW   t3, 0(a3)
LD   ra, 8(sp)
ADDI sp, sp, 16
JALR zero, 0(ra)`)],-1)]])),[[_,0],[v,1]])])]),_:1},16)}}};export{_ as default};