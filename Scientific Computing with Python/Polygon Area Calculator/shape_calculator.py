class Rectangle:

  def __init__(self, width, height):
    self.width = width
    self.height = height

  def __repr__(self):
    return 'Rectangle(width={}, height={})'.format(self.width, self.height)
  
  def set_width(self, width):
    self.width = width
    
  def set_height(self, height):
    self.height = height

  def get_area(self):
    return self.width * self.height

  def get_perimeter(self):
    return 2 * self.width + 2 * self.height

  def get_diagonal(self):
    return (self.width ** 2 + self.height ** 2) ** .5

  def get_amount_inside(self, shape):
    return (self.width // shape.width) * (self.height // shape.height)

  def get_picture(self):
    if self.width > 50 or self.height > 50:
      return 'Too big for picture.'
    else:
      pic = ''
      for _ in range(0, self.height):
        pic += '{:{fill}{align}{width}}\n'.format('',
                                                    fill='*',
                                                    align='<',
                                                    width=self.width)
      return pic

class Square(Rectangle):

  def __init__(self, side):
    Rectangle.__init__(self, side, side)

  def __repr__(self):
    return 'Square(side={})'.format(self.width)
    
  def set_side(self, side):
    Rectangle.set_width(self, side)
    Rectangle.set_height(self, side)
