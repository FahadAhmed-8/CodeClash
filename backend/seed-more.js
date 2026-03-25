require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Problem = require('./models/problemModel');

const newProblems = [
  {
    name: "Count Digits",
    difficulty: "Easy",
    tags: ["Math", "String"],
    statement: `Given a non-negative integer n, count the number of digits in it.

Constraints:
- 0 <= n <= 10^9

Input Format:
A single integer n.

Output Format:
A single integer — the number of digits.`,
    samples: [
      { input: "12345", output: "5" },
      { input: "0", output: "1" }
    ],
    testCases: [
      { input: "12345", expectedOutput: "5" },
      { input: "0", expectedOutput: "1" },
      { input: "9", expectedOutput: "1" },
      { input: "100", expectedOutput: "3" },
      { input: "999999999", expectedOutput: "9" }
    ]
  },
  {
    name: "Power of Two",
    difficulty: "Easy",
    tags: ["Math", "Bit Manipulation"],
    statement: `Given an integer n, return "true" if it is a power of two. Otherwise, return "false".

An integer n is a power of two if there exists an integer x such that n == 2^x.

Constraints:
- -2^31 <= n <= 2^31 - 1

Input Format:
A single integer n.

Output Format:
"true" or "false"`,
    samples: [
      { input: "1", output: "true" },
      { input: "16", output: "true" },
      { input: "3", output: "false" }
    ],
    testCases: [
      { input: "1", expectedOutput: "true" },
      { input: "16", expectedOutput: "true" },
      { input: "3", expectedOutput: "false" },
      { input: "0", expectedOutput: "false" },
      { input: "1024", expectedOutput: "true" },
      { input: "-16", expectedOutput: "false" },
      { input: "2", expectedOutput: "true" }
    ]
  },
  {
    name: "Remove Duplicates from Sorted Array",
    difficulty: "Easy",
    tags: ["Array", "Two Pointers"],
    statement: `Given a sorted integer array, remove the duplicates in-place and print the unique elements in order, space-separated.

Constraints:
- 1 <= n <= 3 * 10^4
- -100 <= nums[i] <= 100
- Array is sorted in non-decreasing order.

Input Format:
First line: n (size of array)
Second line: n space-separated sorted integers

Output Format:
Space-separated unique integers.`,
    samples: [
      { input: "7\n1 1 2 2 3 4 4", output: "1 2 3 4" },
      { input: "5\n0 0 1 1 2", output: "0 1 2" }
    ],
    testCases: [
      { input: "7\n1 1 2 2 3 4 4", expectedOutput: "1 2 3 4" },
      { input: "5\n0 0 1 1 2", expectedOutput: "0 1 2" },
      { input: "1\n5", expectedOutput: "5" },
      { input: "3\n1 1 1", expectedOutput: "1" },
      { input: "6\n-3 -1 -1 0 2 2", expectedOutput: "-3 -1 0 2" }
    ]
  },
  {
    name: "Climbing Stairs",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Math"],
    statement: `You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

Constraints:
- 1 <= n <= 45

Input Format:
A single integer n.

Output Format:
A single integer — the number of distinct ways.`,
    samples: [
      { input: "2", output: "2" },
      { input: "3", output: "3" },
      { input: "5", output: "8" }
    ],
    testCases: [
      { input: "2", expectedOutput: "2" },
      { input: "3", expectedOutput: "3" },
      { input: "5", expectedOutput: "8" },
      { input: "1", expectedOutput: "1" },
      { input: "10", expectedOutput: "89" },
      { input: "20", expectedOutput: "10946" }
    ]
  },
  {
    name: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["String", "Sliding Window", "Hash Map"],
    statement: `Given a string s, find the length of the longest substring without repeating characters.

Constraints:
- 0 <= s.length <= 5 * 10^4
- s consists of English letters, digits, symbols and spaces.

Input Format:
A single line containing the string s.

Output Format:
A single integer — the length of the longest substring without repeating characters.`,
    samples: [
      { input: "abcabcbb", output: "3" },
      { input: "bbbbb", output: "1" },
      { input: "pwwkew", output: "3" }
    ],
    testCases: [
      { input: "abcabcbb", expectedOutput: "3" },
      { input: "bbbbb", expectedOutput: "1" },
      { input: "pwwkew", expectedOutput: "3" },
      { input: "a", expectedOutput: "1" },
      { input: "abcdef", expectedOutput: "6" },
      { input: "dvdf", expectedOutput: "3" },
      { input: "anviaj", expectedOutput: "5" }
    ]
  },
  {
    name: "Rotate Array",
    difficulty: "Medium",
    tags: ["Array", "Math"],
    statement: `Given an integer array nums, rotate the array to the right by k steps, where k is non-negative. Print the rotated array.

Constraints:
- 1 <= nums.length <= 10^5
- -2^31 <= nums[i] <= 2^31 - 1
- 0 <= k <= 10^5

Input Format:
First line: n and k separated by space
Second line: n space-separated integers

Output Format:
Space-separated integers after rotation.`,
    samples: [
      { input: "7 3\n1 2 3 4 5 6 7", output: "5 6 7 1 2 3 4" },
      { input: "4 2\n-1 -100 3 99", output: "3 99 -1 -100" }
    ],
    testCases: [
      { input: "7 3\n1 2 3 4 5 6 7", expectedOutput: "5 6 7 1 2 3 4" },
      { input: "4 2\n-1 -100 3 99", expectedOutput: "3 99 -1 -100" },
      { input: "3 0\n1 2 3", expectedOutput: "1 2 3" },
      { input: "3 3\n1 2 3", expectedOutput: "1 2 3" },
      { input: "5 7\n1 2 3 4 5", expectedOutput: "4 5 1 2 3" }
    ]
  },
  {
    name: "Product of Array Except Self",
    difficulty: "Medium",
    tags: ["Array", "Prefix Sum"],
    statement: `Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].

You must write an algorithm that runs in O(n) time and without using the division operation.

Constraints:
- 2 <= nums.length <= 10^5
- -30 <= nums[i] <= 30
- The product of any prefix or suffix of nums fits in a 32-bit integer.

Input Format:
First line: n (size of array)
Second line: n space-separated integers

Output Format:
Space-separated integers of the result array.`,
    samples: [
      { input: "4\n1 2 3 4", output: "24 12 8 6" },
      { input: "5\n-1 1 0 -3 3", output: "0 0 9 0 0" }
    ],
    testCases: [
      { input: "4\n1 2 3 4", expectedOutput: "24 12 8 6" },
      { input: "5\n-1 1 0 -3 3", expectedOutput: "0 0 9 0 0" },
      { input: "2\n5 3", expectedOutput: "3 5" },
      { input: "3\n2 2 2", expectedOutput: "4 4 4" },
      { input: "4\n0 0 1 2", expectedOutput: "0 0 0 0" }
    ]
  },
  {
    name: "Container With Most Water",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers", "Greedy"],
    statement: `You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.

Constraints:
- 2 <= n <= 10^5
- 0 <= height[i] <= 10^4

Input Format:
First line: n (number of lines)
Second line: n space-separated integers (heights)

Output Format:
A single integer — the maximum area.`,
    samples: [
      { input: "9\n1 8 6 2 5 4 8 3 7", output: "49" },
      { input: "2\n1 1", output: "1" }
    ],
    testCases: [
      { input: "9\n1 8 6 2 5 4 8 3 7", expectedOutput: "49" },
      { input: "2\n1 1", expectedOutput: "1" },
      { input: "3\n1 2 1", expectedOutput: "2" },
      { input: "5\n5 5 5 5 5", expectedOutput: "20" },
      { input: "6\n1 2 4 3 2 1", expectedOutput: "6" }
    ]
  },
  {
    name: "Matrix Diagonal Sum",
    difficulty: "Easy",
    tags: ["Array", "Matrix"],
    statement: `Given a square matrix mat, return the sum of the matrix diagonals.

Only include the sum of all the elements on the primary diagonal and all the elements on the secondary diagonal that are not part of the primary diagonal.

Constraints:
- 1 <= n <= 100
- 1 <= mat[i][j] <= 100

Input Format:
First line: n (size of square matrix)
Next n lines: n space-separated integers each

Output Format:
A single integer — the diagonal sum.`,
    samples: [
      { input: "3\n1 2 3\n4 5 6\n7 8 9", output: "25" },
      { input: "2\n1 2\n3 4", output: "10" }
    ],
    testCases: [
      { input: "3\n1 2 3\n4 5 6\n7 8 9", expectedOutput: "25" },
      { input: "2\n1 2\n3 4", expectedOutput: "10" },
      { input: "1\n5", expectedOutput: "5" },
      { input: "4\n1 1 1 1\n1 1 1 1\n1 1 1 1\n1 1 1 1", expectedOutput: "8" },
      { input: "3\n7 0 3\n0 5 0\n3 0 7", expectedOutput: "25" }
    ]
  },
  {
    name: "Sort Colors (Dutch National Flag)",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers", "Sorting"],
    statement: `Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red (0), white (1), and blue (2).

You must solve this problem without using the library's sort function.

Constraints:
- 1 <= n <= 300
- nums[i] is 0, 1, or 2.

Input Format:
First line: n (size of array)
Second line: n space-separated integers (0, 1, or 2)

Output Format:
Space-separated sorted integers.`,
    samples: [
      { input: "6\n2 0 2 1 1 0", output: "0 0 1 1 2 2" },
      { input: "3\n2 0 1", output: "0 1 2" }
    ],
    testCases: [
      { input: "6\n2 0 2 1 1 0", expectedOutput: "0 0 1 1 2 2" },
      { input: "3\n2 0 1", expectedOutput: "0 1 2" },
      { input: "1\n0", expectedOutput: "0" },
      { input: "4\n1 1 1 1", expectedOutput: "1 1 1 1" },
      { input: "5\n2 2 1 0 0", expectedOutput: "0 0 1 2 2" },
      { input: "9\n0 2 1 2 0 1 2 0 1", expectedOutput: "0 0 0 1 1 1 2 2 2" }
    ]
  },
  {
    name: "Trapping Rain Water",
    difficulty: "Hard",
    tags: ["Array", "Two Pointers", "Stack", "Dynamic Programming"],
    statement: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

Constraints:
- 1 <= n <= 2 * 10^4
- 0 <= height[i] <= 10^5

Input Format:
First line: n (number of bars)
Second line: n space-separated integers (heights)

Output Format:
A single integer — the total units of trapped water.`,
    samples: [
      { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", output: "6" },
      { input: "6\n4 2 0 3 2 5", output: "9" }
    ],
    testCases: [
      { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", expectedOutput: "6" },
      { input: "6\n4 2 0 3 2 5", expectedOutput: "9" },
      { input: "3\n1 0 1", expectedOutput: "1" },
      { input: "5\n5 4 3 2 1", expectedOutput: "0" },
      { input: "5\n1 2 3 2 1", expectedOutput: "0" },
      { input: "6\n3 0 2 0 4 0", expectedOutput: "7" }
    ]
  },
  {
    name: "Word Search in Grid",
    difficulty: "Hard",
    tags: ["Backtracking", "Matrix", "DFS"],
    statement: `Given an m x n grid of characters board and a string word, return "true" if word exists in the grid.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.

Constraints:
- 1 <= m, n <= 6
- 1 <= word.length <= 15
- board and word consist of only lowercase and uppercase English letters.

Input Format:
First line: m and n separated by space
Next m lines: n characters separated by space
Last line: the word to search

Output Format:
"true" or "false"`,
    samples: [
      { input: "3 4\nA B C E\nS F C S\nA D E E\nABCCED", output: "true" },
      { input: "3 4\nA B C E\nS F C S\nA D E E\nSEE", output: "true" },
      { input: "3 4\nA B C E\nS F C S\nA D E E\nABCB", output: "false" }
    ],
    testCases: [
      { input: "3 4\nA B C E\nS F C S\nA D E E\nABCCED", expectedOutput: "true" },
      { input: "3 4\nA B C E\nS F C S\nA D E E\nSEE", expectedOutput: "true" },
      { input: "3 4\nA B C E\nS F C S\nA D E E\nABCB", expectedOutput: "false" },
      { input: "1 1\nA\nA", expectedOutput: "true" },
      { input: "1 1\nA\nB", expectedOutput: "false" },
      { input: "2 2\nA B\nC D\nABDC", expectedOutput: "true" }
    ]
  },
  {
    name: "Minimum Path Sum",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "Matrix"],
    statement: `Given an m x n grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path.

You can only move either down or right at any point in time.

Constraints:
- 1 <= m, n <= 200
- 0 <= grid[i][j] <= 200

Input Format:
First line: m and n separated by space
Next m lines: n space-separated integers

Output Format:
A single integer — the minimum path sum.`,
    samples: [
      { input: "3 3\n1 3 1\n1 5 1\n4 2 1", output: "7" },
      { input: "2 3\n1 2 3\n4 5 6", output: "12" }
    ],
    testCases: [
      { input: "3 3\n1 3 1\n1 5 1\n4 2 1", expectedOutput: "7" },
      { input: "2 3\n1 2 3\n4 5 6", expectedOutput: "12" },
      { input: "1 1\n0", expectedOutput: "0" },
      { input: "1 3\n1 2 3", expectedOutput: "6" },
      { input: "3 1\n1\n2\n3", expectedOutput: "6" },
      { input: "3 3\n1 2 3\n4 5 6\n7 8 9", expectedOutput: "21" }
    ]
  }
];

const seedMore = async () => {
  try {
    await connectDB();

    // Check for duplicates by name
    const existingNames = (await Problem.find({}, 'name')).map(p => p.name);
    const toInsert = newProblems.filter(p => !existingNames.includes(p.name));

    if (toInsert.length === 0) {
      console.log('All 13 problems already exist. Nothing to add.');
      process.exit(0);
    }

    await Problem.insertMany(toInsert);
    console.log(`\nSuccessfully added ${toInsert.length} new problems!\n`);
    toInsert.forEach((p, i) => {
      console.log(`  ${i + 1}. [${p.difficulty}] ${p.name} (${p.tags.join(', ')})`);
    });

    const total = await Problem.countDocuments();
    console.log(`\nTotal problems in database: ${total}`);
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seedMore();
