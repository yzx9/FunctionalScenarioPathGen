import itertools


def is_include_dic(dic1, dic2):
    a = set(dic1.items())
    b = set(dic2.items())
    return a.issubset(b)


dic = {}
choose1 = input('请输入process数目: \n')
choose1 = int(choose1)
list1 = [None]*choose1
for i in range(choose1):
    ii = 'process'+str(i+1)
    dic[ii] = {}
    choose2 = input('请输入'+ii+'的post数: \n')
    choose2 = int(choose2)
    list1[i] = choose2

    for j in range(choose2):
        jj = 'post'+str(j+1)+':'+input('请输入要描述的post的G∪D:')
        dic[ii][jj] = {}
        putin = 'putin'
        dic[ii][jj][putin] = {}
        nn = int(1)
        while nn == 1:
            name = input('请输入要添加的input:')
            dic[ii][jj][putin][name] = input('请输入条件:')
            if input('是否继续添加input(YES/NO):').upper() == 'NO':
                break
            else:
                continue

        putout = 'putout'
        dic[ii][jj][putout] = {}
        nn = int(2)
        while nn == 2:
            name2 = input('请输入要添加的output:')
            dic[ii][jj][putout][name2] = input('请输入条件:')
            if input('是否继续添加output(YES/NO):').upper() == 'NO':
                break
            else:
                continue

print(dic)
print(list1)

bb = dic.keys()
bb = list(bb)
for i in range(len(bb)):
    if i == 0:
        xx = list(dic[bb[0]].keys())
    else:
        xx = itertools.product(xx, list(dic[bb[i]].keys()))

num = int(1)
for elem in xx:
    print('path'+str(num)+':')
    print(elem)
    num = num+1

print(len(bb))

index = [None]*len(bb)
print('---------判断path validity请按1-------')
print('---------退出按0-------')

while True:
    choose = input('请输入你想选择的操作编号:')
    choose = int(choose)

    while choose == 1:
        for i in range(len(bb)):
            ii = str(int(i)+1)
            index[i] = input('process'+ii+'中的post编号为：')
        print(index)
        count = int(0)
        for k in range(len(index)-1):
            print(k)

            try1 = list(dic[bb[k]].keys())
            try2 = list(dic[bb[k+1]].keys())
            print(try1)
            print(try2)

            try3 = int(index[k])-1
            try4 = int(index[k+1])-1
            print(try3)
            print(try4)

            t = dic[bb[k]][try1[try3]]['putout']
            t2 = dic[bb[k+1]][try2[try4]]['putin']
            print(t)
            print(t2)

            r = is_include_dic(t, t2)
            if r == True:
                count = count+1

        if count == len(index) - 1:
            print('合法路径')
        else:
            print('非法路径')
        break

    if choose == 0:
        break
