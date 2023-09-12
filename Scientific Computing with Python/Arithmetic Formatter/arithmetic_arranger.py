from os import error
import re

def arithmetic_arranger(problems, showResult = False):
    args1 = ''
    args2 = ''
    dashes = ''
    results = ''
    arranged_problems = ''
    error = ''

    if len(problems) > 5:
        error = 'Error: Too many problems.'
    else:
        for i, problem in enumerate(problems):
            m = re.match('^(\d+)\s+(.)\s+(\d+)$', problem)

            if not m:
                error = 'Error: Numbers must only contain digits.'
                break
          
            arg1 = m.group(1)
            op = m.group(2)
            arg2 = m.group(3)
            result = eval(problem)

            if op != '+' and op != '-':
                error = 'Error: Operator must be \'+\' or \'-\'.'
                break
    
            ln = max(len(arg1), len(arg2))
          
            if ln > 4:
                error = 'Error: Numbers cannot be more than four digits.'
                break

            args1 += '{}'.format(arg1.rjust(ln+2))
            args2 += '{} {}'.format(op, arg2.rjust(ln))
            dashes += '{}'.format('-'*(ln+2))
            
            results += '{}'.format(repr(result).rjust(ln+2))
          
            if i < len(problems) - 1:
                args1 += '    '
                dashes += '    '
                args2 += '    '
                results += '    '
    
        arranged_problems += '{}\n'.format(args1)
        arranged_problems += '{}\n'.format(args2)
        arranged_problems += '{}'.format(dashes)
        if showResult:
            arranged_problems += '\n{}'.format(results)

    if error:
        return error
    else:
        return arranged_problems