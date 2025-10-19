import csv
l = 0
L1=[]
def rewrite(date,roll):
    global l
    with open("Student.csv","r") as csvf:

        csvfile = csv.reader(csvf)

        for rows in csvfile:
            if (l==0):
                rows.append(date)
                L1.append(rows)
                l=l+1

                # print("1",rows,L1)
                continue
            else:

                if (l>=2):
                    if rows[1]==roll:
                        rows.append("P")
                        L1.append(rows)


                else:
                    L1.append(rows)
                # print("2",rows,L1)
                l = l + 1
            # print("3",rows)
        # csvw.writerows(L1)
        print(L1)
    with open("Student.csv", "w",newline="") as csvs:
        csvw = csv.writer(csvs)
        csvw.writerows(L1)




date = input("Enter the todays date : ")

roll  = input("Enter the roll number : ")

rewrite(date,roll)