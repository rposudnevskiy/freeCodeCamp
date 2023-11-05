import matplotlib.pyplot as plt
import matplotlib as mpl
from matplotlib.lines import Line2D
from matplotlib.dates import MonthLocator, YearLocator, DateFormatter
import pandas as pd
import numpy as np
import seaborn as sns
from pandas.plotting import register_matplotlib_converters

register_matplotlib_converters()

# Import data (Make sure to parse dates. Consider setting index column to 'date'.)
df = pd.read_csv('fcc-forum-pageviews.csv')

# covert date string to timestamp
df["date"] = pd.to_datetime(df["date"])

# Clean data
df = df.loc[((df['value'] >= df['value'].quantile(0.025)) &
             (df['value'] <= df['value'].quantile(0.975)))]


def draw_line_plot():
  dfcopy = df.copy(deep=True)
  # Draw line plot
  fig = plt.figure(figsize=(32, 10))
  ax = fig.add_subplot()

  ax.set_title('Daily freeCodeCamp Forum Page Views 5/2016-12/2019',
               loc='center',
               fontstyle='normal',
               fontsize=24,
               pad=12)

  ax.set_xlabel('Date', labelpad=8, fontsize=20)
  ax.set_ylabel('Page Views', labelpad=8, fontsize=20)

  ax.tick_params(labelsize=20, width=2, length=8, pad=8)
  # change all spines
  ax.spines[['top', 'bottom', 'left', 'right']].set_linewidth(2)

  ax.xaxis.set_major_locator(MonthLocator(bymonth=[1, 7]))
  ax.xaxis.set_major_formatter(DateFormatter('%Y-%m'))

  plt.plot(dfcopy["date"], dfcopy["value"], color='red', linewidth=3.0)

  # Save image and return fig (don't change this part)
  fig.savefig('line_plot.png')
  return fig


def draw_bar_plot():
  # Copy and modify data for monthly bar plot
  df_bar = df.copy(deep=True).groupby(pd.Grouper(key='date', freq='M')).mean().astype(int)
  df_bar['Year'] = df_bar.index.year
  df_bar['Months'] = df_bar.index.month_name()

  dict = {'date': [pd.to_datetime('2016-01-31'), pd.to_datetime('2016-02-28'), 
                   pd.to_datetime('2016-03-31'), pd.to_datetime('2016-04-30')],
          'value': [0, 0, 0, 0],
          'Year': ['2016', '2016', '2016', '2016'],
          'Months': ['January', 'February', 'March', 'April']}

  df1 = pd.DataFrame(dict, columns=['date', 'value', 'Year', 'Months'])
  df1 = df1.set_index('date')

  df_bar = pd.concat([df1, df_bar])

  # Draw bar plot
  fig, ax = plt.subplots(1, 1, figsize=(15, 13))

  ax.set_xlabel('Years', labelpad=8, fontsize=20)
  ax.set_ylabel('Average Page Views', labelpad=8, fontsize=20)

  ax.tick_params(labelsize=20, width=1, length=8, pad=8)
  # change all spines
  ax.spines[['top', 'bottom', 'left', 'right']].set_linewidth(2)

  hue_order = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  ax = sns.barplot(data=df_bar, x="Year", y="value", hue="Months", hue_order=hue_order, palette="tab10", legend=False, ax=ax)

  legend_elements = []
  cmap = plt.colormaps['tab10']
  
  for i, label in enumerate(hue_order):
    c = i if i <=9 else i-10
    legend_elements.append(Line2D([0], [0], lw=8, color=cmap(c), label=label))
    
  ax.legend(handles=legend_elements, loc="upper left", title="Months", borderpad=1 , borderaxespad=1)
  
  # for legend text size
  plt.setp(ax.get_legend().get_texts(), fontsize='20')  

  # for legend title size
  plt.setp(ax.get_legend().get_title(), fontsize='20')
  
  # Save image and return fig (don't change this part)
  fig.savefig('bar_plot.png')
  return fig


def draw_box_plot():
  # Prepare data for box plots (this part is done!)
  df_box = df.copy()
  df_box.reset_index(inplace=True)
  df_box['year'] = [d.year for d in df_box.date]
  df_box['month'] = [d.strftime('%b') for d in df_box.date]

  # Draw bar plot
  fig, axes = plt.subplots(1, 2, figsize=(28, 11), layout="constrained")
  fig.get_layout_engine().set(w_pad=0.5, h_pad=0.5)
  
  axes[0].set_title("Year-wise Box Plot (Trend)",
                    loc='center',
                    fontstyle='normal',
                    fontsize=18)
  # Draw box plots (using Seaborn)
  axes[0]= sns.boxplot(
    data=df_box, x="year", y="value", hue='year', palette="tab10", legend=None, ax=axes[0])

  axes[0].set_xlabel('Year', fontsize=15)
  axes[0].set_ylabel('Page Views', fontsize=15)
  axes[0].tick_params(labelsize=15)
  axes[0].yaxis.set_ticks(np.arange(0,220000, 20000))
  
  order = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  
  axes[1].set_title("Month-wise Box Plot (Seasonality)",
                    loc='center',
                    fontstyle='normal',
                    fontsize=18)
  # Draw box plots (using Seaborn)
  axes[1] = sns.boxplot(
    data=df_box, x="month", y="value", hue='month', order=order, hue_order=order, palette=sns.color_palette("husl",12), legend=None, ax=axes[1])

  axes[1].set_xlabel('Month', fontsize=15)
  axes[1].set_ylabel('Page Views', fontsize=15)
  axes[1].tick_params(labelsize=15)
  axes[1].yaxis.set_ticks(np.arange(0,220000, 20000))
  
  # Save image and return fig (don't change this part)
  fig.savefig('box_plot.png')
  return fig
