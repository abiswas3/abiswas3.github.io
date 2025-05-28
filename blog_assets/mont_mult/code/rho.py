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
print((bigint(rho1)+bigint(rho2)+bigint(rho3)) / bigint(p))

def digits(x,N=4):
    s = ("0"*(64*N)+bin(x)[2:])[-64*N:]
    return [int(s[64*i:64*(i+1)],2) for i in range(N)]

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

def dsum(x,y):
    c = digits(bigint(x)*bigint(y),8)
    print([hex(x) for x in c])
    return (c[7]*r**n + c[6]*r**(n-1) + c[5]*r**(n-2) + c[4]*r**(n-3) + c[3]*r**(n-4) + c[2]*bigint(rho1) + c[1]*bigint(rho2)+c[0]*bigint(rho3))/(r*bigint(p))
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
