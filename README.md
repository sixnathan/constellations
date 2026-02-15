# constellations

a training simulator for the constellations puzzle.

## the game

you are given a grid and a set of 3 symbols, each with 3 of the same colour types. the grid has a hidden rule. you are also given a set of example grid configurations (i.e. with coloured symbols placed on them) and are told whether they are valid or invalid.

**what you do:**

1. look at the starter examples labelled valid or invalid.
2. place symbols on the grid and press 'test board' to learn whether your configuration is valid or invalid.
3. once you think you know the rule, click 'finish experiments' and write down what you think the rule is.
4. click 'reveal rule' to learn what it was.

you have a 5-second cooldown between testing boards and a maximum of 100 tests.

## useful info

**constraints on the rules:**

- they depend only on what is on the board: shapes, colours, and relative positions.
- they are shift-invariant: you can slide the pattern across the grid without changing its validity.
- they are simple and singular: no conjunctions, compound rules, or special cases.
- outside the grid counts as an empty space.

## about this version

this was created to practise/train for the pair application. so, there are slight differences between the puzzle they assigned and my version. the guide given before playing was fairly comprehensive but left out a few details,  so this game is not necessarily a faithful representation of their puzzle (i haven't completed it yet).

my version has 4 time modes to vary between: 5, 10, 15, and 20 mins, and you are given one puzzle to solve in that time limit. you click 'finish', write down what you think the rule was, and then click 'reveal rule' to find out if you got it correct.

in the original, you were given a set of three puzzles of increasing difficulty (of this standard format) and had 90 mins to complete them. you could freely move between the puzzles, with progress saved. when clicking 'finish experiments', you are given 10 written questions that would indicate to the examiner whether you understood the rule. however, upon clicking 'finish experiments' for a particular puzzle, you would not be able to return to the testing phase for it, but could still move between the others.

## my assumptions/guesses

- **(a)** the size of the board.
- **(b)** the number of symbols placed for the example configuration.
- **(c)** the number of examples given to us.

my strategy for solving this meant that (a) did not matter too much.

i am not totally sure, but i guess that the rule may be more or less obvious depending on (b), but it is not standard: i.e. more symbols = more obvious, or more symbols could = less obvious. the rule would determine which.

(c) more examples = easier (generally), but depends on what kinds are given.

## my strategy

for each puzzle, i need to find the fewest-symbol configuration to demonstrate the rule, and then permute each element. so, i needed to find out whether it was easier or harder to create a valid/invalid board.

**my basic algorithm (one possible version):**

1. test a clear board.
2. for a valid board:
   - if board = valid, halve the number of symbols.
   - if board = valid, return to step 2. if board = invalid, restore half of the symbols you erased, check validity, and see which subsection toggled the rule. remove half of the other symbols on the board, while checking validity and repeating this process.
3. when i found the fewest-symbol example of the rule, i'd permute each element to find out what parameters it considered: colours, symbol type, adjacency, alignment in rows/columns, and form a hypothesis on what the rule was.
4. with the rule, i'd create valid/invalid boards to test. with my final hypothesis, i'd adjust each invalid example board given to us according to the rule and correct them. if they stayed invalid, i'd continue testing.

this would be used if it was easier for the board to be valid than invalid. if not, then just swap out valid for invalid in the algo above.

this strategy seems quite convoluted, and probably not optimal.
