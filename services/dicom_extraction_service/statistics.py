import pandas as pd
import numpy as np
import matplotlib.pyplot as plt


colors = ['red', 'black']

data_set = pd.read_csv('metrics.csv', sep=';')
data_array = np.array(data_set)

time = data_array[:,0].tolist()
cpu_percent = data_array[:,1].tolist()
memory_percent = data_array[:,2].tolist()


#plt.plot(time,cpu_percent , label="CPU")
plt.subplot(1, 2, 1)
plt.plot(time,memory_percent, label="Memory" , color="orange")
#plt.legend()
plt.ylabel('Percentage (%)' , fontsize=30)
plt.xlabel('Processing Time (Seconds)' , fontsize=30)
plt.xticks(fontsize=20)
plt.yticks(fontsize=20)
plt.title("Memory Usage" , fontsize=30)




plt.subplot(1, 2, 2)
plt.plot(time,cpu_percent, label="Memory")
#plt.legend()
plt.ylabel('Percentage (%)' , fontsize=30)
plt.xlabel('Processing Time (Seconds)' , fontsize=30)
plt.xticks(fontsize=20)
plt.yticks(fontsize=20)
plt.title("CPU Usage" , fontsize=30)
plt.show()