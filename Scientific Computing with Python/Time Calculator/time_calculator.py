def add_time(start, duration, startweekday=''):

  weekdays = ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
              'Saturday')

  startHours = int(start.split(':')[0])
  starMinutes = int(start.split(':')[1].split(' ')[0])
  startAmpm = start.split(':')[1].split(' ')[1]

  if startweekday != '':
    startweekday = startweekday.lower()[0].upper() + startweekday.lower()[1:]

  durationHours = int(duration.split(':')[0])
  durationMinutes = int(duration.split(':')[1])

  if startAmpm == 'PM':
    startHours += 12

  startTotalMinutes = startHours * 60 + starMinutes
  durationTotalMinutes = durationHours * 60 + durationMinutes

  newTotalMinutes = startTotalMinutes + durationTotalMinutes

  newDays = newTotalMinutes // 1440
  newHour = newTotalMinutes % 1440 // 60
  newMinutes = newTotalMinutes % 1440 % 60

  if newHour >= 12:
    newHour = newHour - 12 if newHour > 12 else 12
    newAmpm = ' PM'
  else:
    newHour = 12 if newHour == 0 else newHour
    newAmpm = ' AM'

  newWeekday = ', {}'.format(
      weekdays[(weekdays.index(startweekday) + newDays) %
               7]) if startweekday != '' else ''

  if newDays == 1:
    newDays = ' (next day)'
  elif newDays > 1:
    newDays = ' ({} days later)'.format(newDays)
  else:
    newDays = ''

  new_time = '{}:{:02}{}{}{}'.format(newHour, newMinutes, newAmpm, newWeekday,
                                     newDays)

  return new_time
