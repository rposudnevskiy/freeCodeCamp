import copy
import random
# Consider using the modules imported above.

class Hat:
  def __init__(self, **kwargs):
    self.contents = []
    for k, v in kwargs.items():
      for _ in range(0, v):
        self.contents.append(k)

  def draw(self, number):
    if number >= len(self.contents):
      return copy.deepcopy(self.contents)
    else:
      result = []
      for _ in range(0, number):
        result.append(self.contents.pop(random.randint(0, len(self.contents)-1)))
      return result
      
def experiment(hat, expected_balls, num_balls_drawn, num_experiments):
  M = 0
  for _ in range(0, num_experiments):
    ballcount = {}
    expected = copy.deepcopy(expected_balls)
    tmphat = copy.deepcopy(hat)
    
    for ball in tmphat.draw(num_balls_drawn):
      if ball in ballcount:
        ballcount[ball] += 1
      else:
        ballcount[ball] = 1

    for k, v in ballcount.items():
      if k in expected:
        if v >= expected[k]:
          del expected[k]
        else:
          expected[k] -= v
      else:
        continue

    if not expected:
      M += 1

  return M/num_experiments