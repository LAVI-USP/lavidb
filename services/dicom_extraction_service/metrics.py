import psutil
import time
import pandas as pd
import logging
from logging.handlers import RotatingFileHandler


# f=open("metrics.csv", "a+")
# f.write('interval;cpu_percent;memory_percent\n')
# interval = 0
# while True:
#     cpu_percent = str(psutil.cpu_percent(interval=1)).replace('[','').replace(']','')
#     memory_percent = str(psutil.virtual_memory().percent)
#     interval = interval + 1 
#     f.write(f"{interval};{cpu_percent};{memory_percent}\n")

# f.close()    

formater = logging.Formatter('%(asctime)s %(levelname)-8s %(message)s')        
logger = logging.getLogger()
logger.setLevel(logging.INFO)
handler = RotatingFileHandler("metrics.csv",
                                backupCount=7)
#handler.setFormatter(formater)
logger.addHandler(handler)

df = pd.DataFrame(columns=['cpu_percent', 'memory_percent'])
metric_list = []
pid = 25286
p = psutil.Process(pid)
i = 0
try:
    logger.info(f"time,cpu_percent,memory_percent")
    while psutil.pid_exists(pid):
        #metric_list.append({'cpu_percent': p.cpu_percent(), 'memory_percent': str(p.memory_percent())})
        logger.info(f"{i}, {p.cpu_percent()},{str(p.memory_percent())}")
        i = i+10
        time.sleep(600)
    metrics = pd.DataFrame(metric_list)
    metrics.to_csv('metrics.csv')
except Exception as e:
    print(e)



# metrics = pd.DataFrame({"cpu_percent" : ['0'],
#                         "memmory_percent" : ['0']})
# new_row = {'cpu_percent': psutil.cpu_percent(interval=1), 'memmory_percent': str(psutil.virtual_memory().percent)}
# result = pd.concat([metrics, new_row])
# print(result)