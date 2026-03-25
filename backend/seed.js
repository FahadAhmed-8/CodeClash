require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Problem = require('./models/problemModel');

const problems = [
  {
    name: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Map"],
    statement: `Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Example:
Input: nums = [2, 7, 11, 15], target = 9
Output: 0 1
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Constraints:
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- Only one valid answer exists.

Input Format:
First line: n (size of array) and target separated by space
Second line: n space-separated integers

Output Format:
Two space-separated indices (0-indexed)`,
    samples: [
      { input: "4 9\n2 7 11 15", output: "0 1" },
      { input: "3 6\n3 2 4", output: "1 2" }
    ],
    testCases: [
      { input: "4 9\n2 7 11 15", expectedOutput: "0 1" },
      { input: "3 6\n3 2 4", expectedOutput: "1 2" },
      { input: "2 6\n3 3", expectedOutput: "0 1" },
      { input: "5 10\n1 2 3 4 6", expectedOutput: "3 4" }
    ]
  },
  {
    name: "Reverse String",
    difficulty: "Easy",
    tags: ["String", "Two Pointers"],
    statement: `Write a function that reverses a string. The input string is given as a single line.

Print the reversed string.

Constraints:
- 1 <= s.length <= 10^5
- s consists of printable ASCII characters.

Input Format:
A single line containing the string.

Output Format:
The reversed string.`,
    samples: [
      { input: "hello", output: "olleh" },
      { input: "CodeClash", output: "hsalCedoC" }
    ],
    testCases: [
      { input: "hello", expectedOutput: "olleh" },
      { input: "CodeClash", expectedOutput: "hsalCedoC" },
      { input: "a", expectedOutput: "a" },
      { input: "abcdef", expectedOutput: "fedcba" },
      { input: "racecar", expectedOutput: "racecar" }
    ]
  },
  {
    name: "Palindrome Check",
    difficulty: "Easy",
    tags: ["String", "Two Pointers"],
    statement: `Given a string s, determine if it is a palindrome. A palindrome reads the same forward and backward.

Consider only alphanumeric characters and ignore cases.

Print "true" if it is a palindrome, "false" otherwise.

Constraints:
- 1 <= s.length <= 2 * 10^5
- s consists only of printable ASCII characters.

Input Format:
A single line containing the string.

Output Format:
"true" or "false"`,
    samples: [
      { input: "racecar", output: "true" },
      { input: "hello", output: "false" }
    ],
    testCases: [
      { input: "racecar", expectedOutput: "true" },
      { input: "hello", expectedOutput: "false" },
      { input: "a", expectedOutput: "true" },
      { input: "abba", expectedOutput: "true" },
      { input: "abcba", expectedOutput: "true" },
      { input: "abc", expectedOutput: "false" }
    ]
  },
  {
    name: "FizzBuzz",
    difficulty: "Easy",
    tags: ["Math", "Simulation"],
    statement: `Given an integer n, print numbers from 1 to n. But for multiples of 3, print "Fizz" instead of the number, for multiples of 5 print "Buzz", and for multiples of both 3 and 5 print "FizzBuzz".

Each output should be on a new line.

Constraints:
- 1 <= n <= 10^4

Input Format:
A single integer n.

Output Format:
n lines, each containing either the number, "Fizz", "Buzz", or "FizzBuzz".`,
    samples: [
      { input: "5", output: "1\n2\nFizz\n4\nBuzz" },
      { input: "15", output: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz" }
    ],
    testCases: [
      { input: "5", expectedOutput: "1\n2\nFizz\n4\nBuzz" },
      { input: "15", expectedOutput: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz" },
      { input: "1", expectedOutput: "1" },
      { input: "3", expectedOutput: "1\n2\nFizz" }
    ]
  },
  {
    name: "Maximum Subarray",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming", "Kadane's Algorithm"],
    statement: `Given an integer array nums, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.

Constraints:
- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4

Input Format:
First line: n (size of array)
Second line: n space-separated integers

Output Format:
A single integer — the maximum subarray sum.`,
    samples: [
      { input: "9\n-2 1 -3 4 -1 2 1 -5 4", output: "6" },
      { input: "1\n1", output: "1" }
    ],
    testCases: [
      { input: "9\n-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" },
      { input: "1\n1", expectedOutput: "1" },
      { input: "5\n5 4 -1 7 8", expectedOutput: "23" },
      { input: "3\n-1 -2 -3", expectedOutput: "-1" },
      { input: "6\n1 2 -1 3 -2 5", expectedOutput: "8" }
    ]
  },
  {
    name: "Valid Parentheses",
    difficulty: "Medium",
    tags: ["Stack", "String"],
    statement: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

Print "true" if the string is valid, "false" otherwise.

Constraints:
- 1 <= s.length <= 10^4
- s consists of parentheses only '()[]{}'.

Input Format:
A single line containing the string of brackets.

Output Format:
"true" or "false"`,
    samples: [
      { input: "()", output: "true" },
      { input: "()[]{}", output: "true" },
      { input: "(]", output: "false" }
    ],
    testCases: [
      { input: "()", expectedOutput: "true" },
      { input: "()[]{}", expectedOutput: "true" },
      { input: "(]", expectedOutput: "false" },
      { input: "([)]", expectedOutput: "false" },
      { input: "{[]}", expectedOutput: "true" },
      { input: "((()))", expectedOutput: "true" },
      { input: ")(", expectedOutput: "false" }
    ]
  },
  {
    name: "Binary Search",
    difficulty: "Medium",
    tags: ["Array", "Binary Search"],
    statement: `Given a sorted array of distinct integers and a target value, return the index of the target if it is found. If not, return -1.

You must write an algorithm with O(log n) runtime complexity.

Constraints:
- 1 <= nums.length <= 10^4
- -10^4 < nums[i], target < 10^4
- All the integers in nums are unique.
- nums is sorted in ascending order.

Input Format:
First line: n (size of array) and target separated by space
Second line: n space-separated sorted integers

Output Format:
A single integer — the index (0-based) or -1`,
    samples: [
      { input: "6 9\n-1 0 3 5 9 12", output: "4" },
      { input: "6 2\n-1 0 3 5 9 12", output: "-1" }
    ],
    testCases: [
      { input: "6 9\n-1 0 3 5 9 12", expectedOutput: "4" },
      { input: "6 2\n-1 0 3 5 9 12", expectedOutput: "-1" },
      { input: "1 5\n5", expectedOutput: "0" },
      { input: "3 1\n1 2 3", expectedOutput: "0" },
      { input: "3 3\n1 2 3", expectedOutput: "2" },
      { input: "5 6\n1 2 3 4 5", expectedOutput: "-1" }
    ]
  },
  {
    name: "Merge Two Sorted Arrays",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers", "Sorting"],
    statement: `You are given two sorted arrays of integers. Merge them into a single sorted array and print the result.

Constraints:
- 0 <= n, m <= 10^4
- -10^6 <= arr[i] <= 10^6

Input Format:
First line: n (size of first array)
Second line: n space-separated sorted integers (or empty if n=0)
Third line: m (size of second array)
Fourth line: m space-separated sorted integers (or empty if m=0)

Output Format:
Space-separated integers of the merged sorted array.`,
    samples: [
      { input: "3\n1 3 5\n3\n2 4 6", output: "1 2 3 4 5 6" },
      { input: "2\n1 2\n1\n3", output: "1 2 3" }
    ],
    testCases: [
      { input: "3\n1 3 5\n3\n2 4 6", expectedOutput: "1 2 3 4 5 6" },
      { input: "2\n1 2\n1\n3", expectedOutput: "1 2 3" },
      { input: "4\n1 1 1 1\n3\n2 2 2", expectedOutput: "1 1 1 1 2 2 2" },
      { input: "1\n5\n1\n5", expectedOutput: "5 5" }
    ]
  },
  {
    name: "Longest Common Subsequence",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "String"],
    statement: `Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.

A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.

For example, "ace" is a subsequence of "abcde".

Constraints:
- 1 <= text1.length, text2.length <= 1000
- text1 and text2 consist of only lowercase English characters.

Input Format:
First line: text1
Second line: text2

Output Format:
A single integer — the length of the LCS.`,
    samples: [
      { input: "abcde\nace", output: "3" },
      { input: "abc\nabc", output: "3" },
      { input: "abc\ndef", output: "0" }
    ],
    testCases: [
      { input: "abcde\nace", expectedOutput: "3" },
      { input: "abc\nabc", expectedOutput: "3" },
      { input: "abc\ndef", expectedOutput: "0" },
      { input: "oxcpqrsvwf\nshmtulqrypy", expectedOutput: "2" },
      { input: "abcba\nabcbcba", expectedOutput: "5" }
    ]
  },
  {
    name: "N-Queens Counter",
    difficulty: "Hard",
    tags: ["Backtracking", "Recursion"],
    statement: `The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.

Given an integer n, return the number of distinct solutions to the n-queens puzzle.

Constraints:
- 1 <= n <= 9

Input Format:
A single integer n.

Output Format:
A single integer — the number of solutions.`,
    samples: [
      { input: "4", output: "2" },
      { input: "1", output: "1" }
    ],
    testCases: [
      { input: "4", expectedOutput: "2" },
      { input: "1", expectedOutput: "1" },
      { input: "5", expectedOutput: "10" },
      { input: "6", expectedOutput: "4" },
      { input: "8", expectedOutput: "92" }
    ]
  },
  {
    name: "Fibonacci Number",
    difficulty: "Easy",
    tags: ["Math", "Recursion", "Dynamic Programming"],
    statement: `The Fibonacci numbers, commonly denoted F(n), form a sequence such that each number is the sum of the two preceding ones, starting from 0 and 1. That is:
F(0) = 0, F(1) = 1
F(n) = F(n - 1) + F(n - 2), for n > 1.

Given n, calculate F(n).

Constraints:
- 0 <= n <= 30

Input Format:
A single integer n.

Output Format:
A single integer — F(n).`,
    samples: [
      { input: "2", output: "1" },
      { input: "10", output: "55" }
    ],
    testCases: [
      { input: "2", expectedOutput: "1" },
      { input: "10", expectedOutput: "55" },
      { input: "0", expectedOutput: "0" },
      { input: "1", expectedOutput: "1" },
      { input: "20", expectedOutput: "6765" },
      { input: "30", expectedOutput: "832040" }
    ]
  },
  {
    name: "Coin Change",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "BFS"],
    statement: `You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.

You may assume that you have an infinite number of each kind of coin.

Constraints:
- 1 <= coins.length <= 12
- 1 <= coins[i] <= 2^31 - 1
- 0 <= amount <= 10^4

Input Format:
First line: n (number of coin types) and amount separated by space
Second line: n space-separated coin values

Output Format:
A single integer — minimum number of coins, or -1.`,
    samples: [
      { input: "3 11\n1 5 6", output: "2" },
      { input: "1 3\n2", output: "-1" },
      { input: "1 0\n1", output: "0" }
    ],
    testCases: [
      { input: "3 11\n1 5 6", expectedOutput: "2" },
      { input: "1 3\n2", expectedOutput: "-1" },
      { input: "1 0\n1", expectedOutput: "0" },
      { input: "3 11\n1 2 5", expectedOutput: "3" },
      { input: "3 100\n1 5 10", expectedOutput: "10" }
    ]
  }
];

const seedDB = async () => {
  try {
    await connectDB();

    const existing = await Problem.countDocuments();
    if (existing > 0) {
      console.log(`Database already has ${existing} problems. Skipping seed.`);
      console.log('To re-seed, drop the problems collection first.');
      process.exit(0);
    }

    await Problem.insertMany(problems);
    console.log(`Successfully seeded ${problems.length} problems!`);
    console.log('Problems added:');
    problems.forEach((p, i) => {
      console.log(`  ${i + 1}. [${p.difficulty}] ${p.name} (${p.tags.join(', ')})`);
    });
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seedDB();
