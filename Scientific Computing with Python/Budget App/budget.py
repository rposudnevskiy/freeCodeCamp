class Category:

  # parameterized constructor
  def __init__(self, name):
    self.name = name
    self.ledger = []

  def __repr__(self):
    total = 0
    repr = '{:*^30}\n'.format(self.name)
    for obj in self.ledger:
      total += obj["amount"]
      repr += '{:<23.23}{:>7.2f}\n'.format(obj["description"], obj["amount"])
    repr += 'Total: {:.2f}'.format(total)
    return repr

  def deposit(self, amount, description=''):
    self.ledger.append({"amount": amount, "description": description})
    return True

  def withdraw(self, amount, description=''):
    if self.check_funds(amount):
      self.ledger.append({"amount": -amount, "description": description})
      return True
    else:
      return False

  def get_balance(self):
    total = 0
    for obj in self.ledger:
      total += obj["amount"]
    return total

  def transfer(self, amount, category):
    if self.check_funds(amount):
      self.withdraw(amount, 'Transfer to {}'.format(category.name))
      category.deposit(amount, 'Transfer from {}'.format(self.name))
      return True
    else:
      return False

  def check_funds(self, amount):
    total = 0
    for obj in self.ledger:
      total += obj["amount"]
    return not amount > total


def create_spend_chart(categories):
  chart = 'Percentage spent by category\n'

  percentage = {}
  for cat in categories:
    for op in cat.ledger:
      if op['amount'] < 0:
        percentage['total'] = percentage.get('total', 0) + abs(op['amount'])
        percentage[cat.name] = percentage.get(cat.name, 0) + abs(op['amount'])

  for cat in categories:
    percentage[cat.name] = round(100 * percentage[cat.name] /
                                 percentage['total'])

  for p in range(100, -10, -10):
    chart += '{:>3d}|'.format(p)
    for cat in categories:
      if p <= percentage[cat.name]:
        chart += '{: ^3}'.format('o')
      else:
        chart += '   '
    chart += ' \n'

  chart += '    {:{fill}{align}{width}}'.format('',
                                                  fill='-',
                                                  align='<',
                                                  width=len(categories) * 3 +
                                                  1)

  i = 0
  done = True

  while True:
    chart += '\n    '  
    for cat in categories:
      if i < len(cat.name):
        chart += '{: ^3}'.format(cat.name[i])
        done = not i + 1 < len(cat.name)
      else:
        chart += '   '

    if not done:
      #done = True
      i += 1
      chart += ' '
      continue
    else:
      chart += ' '
      break

  return chart
