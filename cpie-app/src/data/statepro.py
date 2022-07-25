import pandas as pd
import os
import json

# def addToClipBoard(text):
#     command = 'echo ' + text.strip() + '| clip'
#     os.system(command)

stated = {"AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado","CT":"Connecticut","DE":"Delaware","FL":"Florida","GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming"}

# statename = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming']
# dict = []
# for i in statename: 
#     dict.append({
#         'value': i, 'label': i
#     })
# print(dict)

# group sum 
df = pd.read_csv(r'C:\Users\coduser\Documents\GitHub\CPIE\cpie-app\src\data\new_facility_operating_scrubbers_startyear.csv')

df.groupby(['FacID','year_scrubbed' ]).count().to_csv('facility_scrubbed_count.csv') 
# for i in stated.keys():
#     df.replace(to_replace =i, 
#                  value = stated[i], 
#                   inplace = True)
# df1 = df.groupby(['FacID' ]).agg({'FacID':'first','Facility.Name':'first', 'state_facility':'first'})
# # dictl = [{"label": r["Facility.Name"] + ', ' + r['state_facility'] ,  "value" : [r['state_facility'] ,r['FacID']] } for  index, r in df.iterrows() ]
# # udict = list({v['label']:v for v in dictl}.values())
# dict2 = [{ r['FacID']: [r["Facility.Name"],r["state_facility"]]  for  index, r in df1.iterrows()}]
# # print(len(dict2))
# with open("facid_name_dict2.json", "w") as final:
#    json.dump(dict2, final)
# print(dictl)
# addToClipBoard(str(dictl))

# df2 = df.groupby(['state_zip','year'])[ 'deaths_coef_2'].sum().reset_index().rename(columns={'deaths_coef_2':'deaths_coef_2_all'}).to_csv('landing_state_overall_year.csv')
# df1 = pd.read_csv(r'./cpie-app/src/data/facility_to_state_sum.csv')

# pd.merge(df1, df2, on="FacID").to_csv('./cpie-app/src/data/facility_to_state_sum_all.csv')

# df.groupby(['year','FacID' ]).agg({'deaths_coef_1':'sum', 'deaths_coef_2':'sum',
#          'deaths_coef_3':'sum',
#          }).to_csv('./cpie-app/src/data/facility_to_state_year.csv')
# df.groupby(['year','FacID','state_zip'])[ 'deaths_coef_2'].sum().to_csv('./cpie-app/src/data/facility_to_state_year_sum2') 
# df.groupby(['year','FacID','state_zip'])[ 'deaths_coef_3'].sum().to_csv('./cpie-app/src/data/facility_to_state_year_sum3') 

# convert abb to full state name 
# making data frame from the csv file 
# dataframe = pd.read_csv("./cpie-app/src/data/facility_to_state_year_sum2.csv") 
# for i in stated.keys():
#    json.loads(json.dumps(dictl).replace(i, stated[i]))

# with open("facid_name3.json", "w") as final:
#    json.dump(dictl, final)

# # using the replace() method
# for i in stated.keys():
#     dataframe.replace(to_replace =i, 
#                  value = stated[i], 
#                   inplace = True)
  
# # writing  the dataframe to another csv file
# dataframe.to_csv('./cpie-app/src/data/facility_to_state_sum_all_fullname.csv', 
#                  index = False)



