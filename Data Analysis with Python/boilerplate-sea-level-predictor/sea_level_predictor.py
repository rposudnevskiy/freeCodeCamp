import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import linregress


def draw_plot():
  # Read data from file
  df = pd.read_csv('epa-sea-level.csv')

  # Create scatter plot
  fig, ax = plt.subplots(1, 1, figsize=(15, 13))

  ax.set_title('Rise in Sea Level',
     loc='center',
     fontstyle='normal',
     fontsize=24,
     pad=12)

  ax.set_xlabel('Year', labelpad=8, fontsize=20)
  ax.set_ylabel('Sea Level (inches)', labelpad=8, fontsize=20)

  ax.xaxis.set_ticks(np.arange(1850.0, 2100.0, 25.0))
  
  ax.tick_params(labelsize=20, width=1, length=8, pad=8)
  ax.scatter(df['Year'], df['CSIRO Adjusted Sea Level'])

  # Create first line of best fit
  res = linregress(df['Year'], df['CSIRO Adjusted Sea Level'])
  plt.plot(np.arange(1880.0, 2051.0, 1.0), res.intercept + res.slope*np.arange(1880.0, 2051.0, 1.0), 'r')

  # Create second line of best fit
  df2k = df.loc[df['Year'] >= 2000.0]
  res = linregress(df2k['Year'], df2k['CSIRO Adjusted Sea Level'])
  plt.plot(np.arange(2000.0, 2051.0, 1.0), res.intercept + res.slope*np.arange(2000.0, 2051.0, 1.0), 'r')
  # Add labels and title

  # Save plot and return data for testing (DO NOT MODIFY)
  plt.savefig('sea_level_plot.png')
  return plt.gca()
