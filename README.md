# Constellations

A training simulator for the Constellations puzzle.

## The Game

You are given a grid and a set of 3 symbols, each with 3 of the same colour types. The grid has a hidden rule. You are also given a set of example grid configurations (i.e. with coloured symbols placed on them) and are told whether they are valid or invalid.

**What you do:**

1. Look at the starter examples labelled valid or invalid.
2. Place symbols on the grid and press 'Test Board' to learn whether your configuration is valid or invalid.
3. Once you think you know the rule, click 'Finish Experiments' and write down what you think the rule is.
4. Click 'Reveal Rule' to learn what it was.

You have a 5-second cooldown between testing boards and a maximum of 100 tests.

## Useful Info

**Constraints on the rules:**

- They depend only on what is on the board: shapes, colours, and relative positions.
- They are shift-invariant: you can slide the pattern across the grid without changing its validity.
- They are simple and singular: no conjunctions, compound rules, or special cases.
- Outside the grid counts as an empty space.

## About This Version

This was created to practise/train for the Pair application. So, there are slight differences between the puzzle they assigned and my version. The guide given to me was fairly comprehensive, and so this game is not necessarily a faithful representation of their puzzle (I haven't completed it yet).

My version has 4 time modes to vary between: 5, 10, 15, and 20 mins, and you are given one puzzle to solve in that time limit. You click 'Finish', write down what you think the rule was, and then click 'Reveal Rule' to find out if you got it correct.

In the original, you were given a set of three puzzles of increasing difficulty (of this standard format) and had 90 mins to complete them. You could freely move between the puzzles, with progress saved. When clicking 'Finish Experiments', you are given 10 written questions that would indicate to the examiner whether you understood the rule. However, upon clicking 'Finish Experiments' for a particular puzzle, you would not be able to return to the testing phase for it, but could still move between the others.

## My Assumptions/Guesses

- **(a)** The size of the board.
- **(b)** The number of symbols placed for the example configuration.
- **(c)** The number of examples given to us.

My strategy for solving this meant that (a) did not matter too much, but I made it 6x6 for simplicity.

I am not totally sure, but I guess that the rule may be more or less obvious depending on (b), but it is not standard: i.e. more symbols = more obvious, or more symbols could = less obvious. The rule would determine which.

(c) More examples = easier (generally), but depends on what kinds are given.

## My Strategy

For each puzzle, I need to find the fewest-symbol configuration to demonstrate the rule, and then permute each element. So, I needed to find out whether it was easier or harder to create a valid/invalid board.

**My basic algorithm (one possible version):**

1. Test a clear board.
2. For a valid board:
   - If board = valid, halve the number of symbols.
   - If board = valid, return to step 2. If board = invalid, restore half of the symbols you erased, check validity, and see which subsection demonstrated the rule. Remove half of the other symbols on the board, while checking validity and repeating this process.
3. When I found the fewest-symbol example of the rule, I'd permute each element to find out what parameters it considered: colours, symbol type, adjacency, alignment in rows/columns, and form a hypothesis on what the rule was.
4. With the rule, I'd create valid/invalid boards to test. With my final hypothesis, I'd adjust each invalid example board given to us according to the rule and correct them. If they stayed invalid, I'd continue testing.

This would be used if it was easier for the board to be valid than invalid. If not, then just swap out valid for invalid in the above algorithm.

This explanation is quite convoluted, and I don't think this method always works.
