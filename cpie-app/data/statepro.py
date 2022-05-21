import pandas as pd


stated = {"AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado","CT":"Connecticut","DE":"Delaware","FL":"Florida","GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming"}


# group sum 
# df = pd.read_csv(r'./cpie-app/data/pm25_facility_state.csv')

# df.groupby(['year', 'state_facility','state_zip' ])[ 'deaths_coef_2'].sum().to_csv('./cpie-app/data/pm25_facility_state_sum.csv') 

# convert abb to full state name 
# making data frame from the csv file 
dataframe = pd.read_csv("./cpie-app/data/pm25_facility_state_sum.csv") 
    
# using the replace() method
for i in stated.keys():
    dataframe.replace(to_replace =i, 
                 value = stated[i], 
                  inplace = True)
  
# writing  the dataframe to another csv file
dataframe.to_csv('./cpie-app/data/pm25_facility_state_sum_fullname.csv', 
                 index = False)
