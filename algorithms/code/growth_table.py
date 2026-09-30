from math import log2


def growth_table(sizes: list[int]) -> None:
    for n in sizes:
        print(f"{n=:>5}  {log2(n)=:>8.2f}  {n*n=:>10}")


growth_table([8, 64, 512, 4096])
