import time

start = time.perf_counter()

import numpy
import pandas
import matplotlib.pyplot as plt
import seaborn
import sklearn

end = time.perf_counter()

print(f"Library import time: {end - start:.2f} seconds")