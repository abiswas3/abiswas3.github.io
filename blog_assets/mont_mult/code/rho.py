import sys
p = [
    0x43e1f593f0000001,
    0x2833e84879b97091,
    0xb85045b68181585d,
    0x30644e72e131a029,
]
rho1 = [
    0x2d3e8053e396ee4d,
    0xca478dbeab3c92cd,
    0xb2d8f06f77f52a93,
    0x24d6ba07f7aa8f04,
]
rho2 = [
    0x18ee753c76f9dc6f,
    0x54ad7e14a329e70f,
    0x2b16366f4f7684df,
    0x133100d71fdf3579,
];

rho3 = [
    0x9BACB016127CBE4E,
    0x0B2051FA31944124,
    0xB064EEA46091C76C,
    0x2B062AAA49F80C7D,
];

r = 2**64
n=4

def bigint(x):
    return sum([x[i]*(r**i) for i in range(4)])

print(bigint(rho1)*(2**(1*64)) % bigint(p))
print(bigint(rho2)*(2**(2*64)) % bigint(p))
print(bigint(rho3)*(2**(3*64)) % bigint(p))

# print((bigint(rho1)+bigint(rho2)+bigint(rho3)) / bigint(p))
print(bigint(rho2) / bigint(p))
print(bigint(rho1) / bigint(p))
sys.exit(0)
def digits(x,N=4):
    s = ("0"*(64*N)+bin(x)[2:])[-64*N:]
    # print(len(s),s)
    return [int(s[64*i:64*(i+1)],2) for i in range(N)][::-1]

print("p",[hex(x) for x in p])
print("p",[hex(x) for x in digits(bigint(p))])

maxQ = (bigint(p)-1)**2/(r**(n-1))
#maxQ = r*bigint(p)
maxR = (bigint(rho1)+bigint(rho2)+bigint(rho3))*(r-1)
maxS = maxQ+maxR
print(((maxS+(r-1)*bigint(p))/r)/bigint(p))

print("---")
a = [2**64-1 for i in range(4)]
b = [2**63+1 for i in range(4)]
print([hex(x) for x in digits(bigint(a)*bigint(b))])

x0 = 1 # good
b3 = x0 +r//2
a3 = (r-1)//x0

#a3*b2+b3*a2 = r-1
x1 = 1 # choose?
b2 = x1
a2 = ((r-1)-(a3*b2))//b3

#a3*b1+a2*b2+b3*a1 = r-1
x2 = 1 # choose?
b1 = x2
a1 = ((r-1)-(a3*b1+a2*b2))//b3


# all digits of product a*b as big as possible
# c[7] = carry = r-1
# c[6] = a3*b3 = r-1 mod r
# c[5] = a3*b2+b3*a2 = r-1 mod r
# c[4] = a3*b1+a2*b2+b3*a1 = r-1 mod r
# c[3] = a3*b0+a2*b1+a1*b2+a0*b3 = r-1 mod r
# c[2] = a2*b0+a1*b1+a0*b2 = r-1 mod r
# c[1] = a1*b0+a0*b1 + carry = r-1 mod r
# c[0] = a0*b0 = r-1 mod r

pmodr = (bigint(p)%r)
print("H",hex(pmodr))
pmodrinv = pow(pmodr,-1,r)
print("pinv",hex(pmodrinv))
print("pinv",hex((pmodrinv*pmodr)%r))
mu=r-pmodrinv
mu0 = mu%r


def dsum(x,y):
    c = digits(bigint(x)*bigint(y),8)
    print("A",bigint(x))
    print("B",bigint(y))
    print([hex(q) for q in x])
    print([hex(q) for q in y])
    print([hex(q) for q in c])
    Q = c[7]*r**n + c[6]*r**(n-1) + c[5]*r**(n-2) + c[4]*r**(n-3) + c[3]*r**(n-4)
    R = c[2]*bigint(rho1) + c[1]*bigint(rho2)+c[0]*bigint(rho3)
    s0 = (Q+R)%r
    m = (s0*mu0)%r # is this meant to be mod r?
    print("Q",Q/(r*bigint(p)))
    print("R",R/(r*bigint(p)))
    print("M",m/r)
    print("MOD",(Q+R+m*bigint(p))%r)
    return (Q + R + m*bigint(p))/(r*bigint(p))
    #return sum([x for x in c])

x3 = 15
b0 = x3
a0 = (r-1)//b3


import sys

a = [a0, a1, a2, a3]
b = [b0, b1, b2, b3]
print("A=",[hex(x) for x in digits(bigint(a))])
print("B=",[hex(x) for x in digits(bigint(b))])
#print([hex(x) for x in digits(bigint(a)*bigint(b),8)])
#c = digits(bigint(a)*bigint(b),8)

#print([hex(x) for x in c])
#print((c[7]*r**n + c[6]*r**(n-1) + c[5]*r**(n-2) + c[4]*r**(n-3) + c[3]*r**(n-4) + c[2]*bigint(rho1) + c[1]*bigint(rho2)+c[0]*bigint(rho3))/(r*bigint(p)))
    
D = dsum(a,b)
print("D_init",D)


a = [0xffffffffffffffff for i in range(4)]
b = [0xffffffffffffffff for i in range(4)]
print("A=",[hex(x) for x in digits(bigint(a))])
print("B=",[hex(x) for x in digits(bigint(b))])
l = []
for i in range(4,100):
    for j in range(4,100):
        a = [0xffffffffffffffff-0xffffffff*i for k in range(3)]+[0x30644e72e131a028]
        b = [0xffffffffffffffff-0xffffffff*j for k in range(3)]+[0x30644e72e131a028]
        d = dsum(a,b)
        l += [(a,b,d)]
a,b,d = max(l,key=lambda x: x[2])

print('------')
dsum(a,b)
c = digits(bigint(a)*bigint(b),8)
print('------')
print(1,all(q < r for q in a))
print(2,all(q < r for q in b))
print(3,bigint(a) < bigint(p))
print(4,bigint(b) < bigint(p))
print(5,bigint(c) < bigint(p)*bigint(p))
print(6,r**(n-1) < bigint(p))
print(7,r**(n) > bigint(p))
print("A",[hex(q) for q in a])
print(bigint(a))
print("B",[hex(q) for q in b])
print(bigint(b))
c = digits(bigint(a)*bigint(b),8)
print("C",[hex(q) for q in c])
print(d)

# with m computed mod r
# A ['0xffffffde00000021', '0xffffffde00000021', '0xffffffde00000021', '0x30644e72e131a028']
# B ['0xffffffce00000031', '0xffffffce00000031', '0xffffffce00000031', '0x30644e72e131a028']
# C ['0x925c4b8763cbf9c', '0x13ebe59ae4fb88ee', '0xfca1302e035ed675', '0xfca122e6035ee3bd', '0x9bd878c821e56e55', '0xffffd87c000020df', '0xffffe5c400001397', '0xfffff30c00000651']
# 3.2357457255668396

print("====: This is the A and B:======")
A=21888242871839275217727050262855149077127275502290488625683478804297066479649
B=21888242871839275217727050239471122885277346680498896117703862712324367319089
a=digits(A,4)
b=digits(B,4)
print([hex(x) for x in a])
print([hex(x) for x in b])
print(dsum(a,b))

